import { supabase } from "@/lib/supabase";

export async function getUserLedgerContext(userId: string) {
  const { data: transactions, error } = await supabase
    .from("transactions")
    .select("type, amount, category, is_tax_deductible, source_ref, date")
    .eq("user_id", userId);

  if (error || !transactions) {
    return "User ledger unavailable.";
  }

  let totalIncome = 0;
  let totalExpenses = 0;
  let markedDeductible = 0;
  const potentialDeductibles: string[] = [];

  transactions.forEach((t) => {
    const amt = Number(t.amount) || 0;
    if (t.type === "INCOME") {
      totalIncome += amt;
    } else {
      totalExpenses += amt;
      if (t.is_tax_deductible) {
        markedDeductible += amt;
      } else {
        const cat = (t.category || "").toLowerCase();
        const src = (t.source_ref || "").toLowerCase();
        if (cat.includes("travel") || cat.includes("software") || src.includes("fuel") || src.includes("petrol")) {
          potentialDeductibles.push(`${t.source_ref || t.category}: ₹${amt}`);
        }
      }
    }
  });

  const sec44adaTaxableBase = totalIncome * 0.5;

  return `
USER REAL-TIME LEDGER DATA:
- Gross Income: ₹${totalIncome}
- Total Expenses: ₹${totalExpenses}
- Verified Business Deductions: ₹${markedDeductible}
- Sec 44ADA Taxable Base (50% Gross): ₹${sec44adaTaxableBase}
- Flagged Unclaimed Deductions: ${
    potentialDeductibles.length > 0 ? potentialDeductibles.join(", ") : "None"
  }
`;
}