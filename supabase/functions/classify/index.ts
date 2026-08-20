import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { GoogleGenAI, Type } from "npm:@google/genai@^2.17.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  user_id: string;
  amount: number;
  vendor: string;
  description?: string;
  date: string; // YYYY-MM-DD from OCR
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const ai = new GoogleGenAI({ apiKey: geminiApiKey });

    const body: RequestBody = await req.json();
    const { user_id, amount, vendor, description, date } = body;

    if (!user_id || !amount || !vendor || !date) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: user_id, amount, vendor, date" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const prompt = `
      Classify this transaction extracted via OCR:
      Vendor: ${vendor}
      Amount: ${amount}
      Description: ${description || "N/A"}
      Date: ${date}

      Map 'category' strictly to one of:
      - personal transfers
      - food and dining
      - shopping
      - travel and transport
      - other

      Assess confidence_score from 0 to 100 based on vendor clarity and expense ambiguity.
    `;

    // Correct @google/genai API: call generateContent directly off ai.models,
    // pass generation config (responseMimeType/responseSchema) via `config`.
    const aiResult = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: {
              type: Type.STRING,
              enum: [
                "personal transfers",
                "food and dining",
                "shopping",
                "travel and transport",
                "other",
              ],
            },
            is_tax_deductible: { type: Type.BOOLEAN },
            confidence_score: { type: Type.INTEGER }, // 0 to 100
            reasoning: { type: Type.STRING },
          },
          required: ["category", "is_tax_deductible", "confidence_score", "reasoning"],
        },
      },
    });

    // response.text is a property (getter), not a method, in @google/genai
    const rawText = aiResult.text;
    if (!rawText) {
      throw new Error("Gemini returned no text content in the response.");
    }
    const classification = JSON.parse(rawText);

    const { category, is_tax_deductible, confidence_score, reasoning } = classification;
    const currentTimestamp = new Date().toISOString();

    // Database Routing Logic (Threshold <= 60)
    if (confidence_score <= 60) {
      const { data, error } = await supabase.from("pending_actions").insert([
        {
          user_id,
          agent_name: "ClassificationAgent",
          action_type: "CLASSIFY_TRANSACTION",
          proposed_payload: {
            amount,
            vendor,
            description,
            date,
            suggested_category: category,
            type: "EXPENSE",
            is_tax_deductible,
            confidence_score,
            source_type: "RECEIPT_OCR",
          },
          agent_reasoning: `Low confidence (${confidence_score}%): ${reasoning}`,
          status: "PENDING",
          created_at: currentTimestamp,
        },
      ]).select();

      if (error) throw error;

      return new Response(
        JSON.stringify({
          status: "REQUIRES_APPROVAL",
          message: "Transaction flagged for manual user review due to low confidence.",
          confidence_score,
          pending_action_id: data[0].id,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      const { data, error } = await supabase.from("transactions").insert([
        {
          user_id,
          type: "EXPENSE", // Defaulted as requested
          amount,
          date: new Date(date).toISOString(),
          category,
          is_tax_deductible,
          source_type: "RECEIPT_OCR", // ENUM value matched
          source_ref: vendor,
          tax_rule_applied: is_tax_deductible ? "Standard Business Expense Deduction" : null,
          created_at: currentTimestamp,
        },
      ]).select();

      if (error) throw error;

      return new Response(
        JSON.stringify({
          status: "SUCCESS",
          message: "Transaction classified and saved automatically.",
          confidence_score,
          transaction: data[0],
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});