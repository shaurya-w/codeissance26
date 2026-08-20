/**
 * services/geminiOcr.ts
 * ---------------------
 * Uses Google Gemini 2.0 Flash multimodal API to extract structured receipt
 * data directly from an image. Returns a ReceiptData object or throws on failure.
 */

import { ReceiptData } from "@/types/receipt";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent";

const EXTRACTION_PROMPT = `You are a receipt parser. Analyze this receipt image and extract the following information.
Return ONLY a valid JSON object with no markdown formatting, no code fences, no extra text.

{
  "amount": <number — the total/final amount paid, as a plain number like 850.00>,
  "transaction_type": "EXPENSE",
  "date": "<YYYY-MM-DD format>",
  "vendor": "<name of the store/business/vendor>",
  "description": "<brief 1-line description of what was purchased>",
  "timestamp": null,
  "source_type": "RECEIPT_OCR"
}

Rules:
- "amount" must be a number, not a string. Remove currency symbols.
- "date" must be in YYYY-MM-DD format. Convert from any format you see.
- "vendor" should be the business/store name, not the address.
- "description" should briefly describe the purchase (e.g. "Petrol purchase from Indian Oil").
- If a field is not clearly visible, make your best reasonable guess.
- Always return exactly one JSON object, nothing else.`;

/**
 * Send a receipt image to Gemini and get structured ReceiptData back.
 *
 * @param base64Image - The image encoded as a base64 string (without data URI prefix).
 * @param mimeType    - The MIME type of the image (e.g. "image/jpeg", "image/png").
 * @returns Parsed ReceiptData.
 * @throws If the API call fails or the response can't be parsed.
 */
export async function extractReceiptData(
  base64Image: string,
  mimeType: string = "image/jpeg"
): Promise<ReceiptData> {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "EXPO_PUBLIC_GEMINI_API_KEY is not configured. Add it to your .env file."
    );
  }

  const requestBody = {
    contents: [
      {
        parts: [
          { text: EXTRACTION_PROMPT },
          {
            inlineData: {
              mimeType,
              data: base64Image,
            },
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.1, // Low temperature for deterministic extraction
      maxOutputTokens: 1024,
    },
  };

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const result = await response.json();

  // Extract the text content from Gemini's response
  const textContent = result?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textContent) {
    throw new Error("Gemini returned an empty response. Please try again or enter details manually.");
  }

  // Parse the JSON from the response (strip any accidental markdown fences)
  const cleaned = textContent
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  let parsed: any;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(
      "Could not parse Gemini's response as JSON. Please enter details manually."
    );
  }

  // Validate and normalize the parsed data
  const receiptData: ReceiptData = {
    amount: normalizeAmount(parsed.amount),
    transaction_type: parsed.transaction_type === "INCOME" ? "INCOME" : "EXPENSE",
    date: normalizeDate(parsed.date),
    vendor: String(parsed.vendor || "Unknown").trim(),
    timestamp: null,
    description: String(parsed.description || "").trim(),
    source_type: "RECEIPT_OCR",
  };

  return receiptData;
}

/**
 * Ensure amount is a valid positive number.
 */
function normalizeAmount(raw: any): number {
  if (typeof raw === "number" && !isNaN(raw)) {
    return Math.round(raw * 100) / 100; // 2 decimal places
  }
  if (typeof raw === "string") {
    // Remove currency symbols and commas
    const cleaned = raw.replace(/[₹$€,Rs.INR\s]/gi, "").trim();
    const num = parseFloat(cleaned);
    if (!isNaN(num)) return Math.round(num * 100) / 100;
  }
  return 0;
}

/**
 * Ensure date is in YYYY-MM-DD format.
 * Handles common Indian formats: DD/MM/YYYY, DD-MM-YYYY, etc.
 */
function normalizeDate(raw: any): string {
  if (!raw) return new Date().toISOString().split("T")[0];

  const str = String(raw).trim();

  // Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;

  // DD/MM/YYYY or DD-MM-YYYY
  const ddmmyyyy = str.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})$/);
  if (ddmmyyyy) {
    const [, dd, mm, yyyy] = ddmmyyyy;
    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  }

  // DD/MM/YY or DD-MM-YY
  const ddmmyy = str.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2})$/);
  if (ddmmyy) {
    const [, dd, mm, yy] = ddmmyy;
    const yyyy = parseInt(yy, 10) > 50 ? `19${yy}` : `20${yy}`;
    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  }

  // Try native Date parsing as last resort
  const d = new Date(str);
  if (!isNaN(d.getTime())) return d.toISOString().split("T")[0];

  // Fallback to today
  return new Date().toISOString().split("T")[0];
}
