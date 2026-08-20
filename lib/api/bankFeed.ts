import { getMockUserId } from "@/lib/mockUser";
import type { BankFeedIngestionResponse } from "@/types/onboarding";

// Point this to your teammate's Ngrok or deployed FastAPI backend URL
const FASTAPI_URL = "https://army-mantis-enable.ngrok-free.dev";

/**
 * Calls the FastAPI backend directly in controlled chunks to avoid timeouts
 * while ingesting the complete 58-item mock bank dataset.
 */
export async function submitBankFeed(): Promise<BankFeedIngestionResponse> {
  const mock_user_id = await getMockUserId();

  // Your complete 58-item mock transaction list
  const rawTransactions = [
    {"type": "CREDIT", "mode": "NEFT", "amount": "7915.00", "currentBalance": "25000.00", "transactionTimestamp": "2026-06-01T10:00:00+05:30", "narration": "NEFT/SWIGGY-PAYOUT/UTR001", "reference": "SWIGGY-2026-001"},
    {"type": "DEBIT", "mode": "UPI", "amount": "450.00", "currentBalance": "24550.00", "transactionTimestamp": "2026-06-02T12:00:00+05:30", "narration": "UPI/DR/IOCL PETROL PUMP/Fuel", "reference": "EXP_01"},
    {"type": "CREDIT", "mode": "NEFT", "amount": "5828.00", "currentBalance": "30378.00", "transactionTimestamp": "2026-06-03T10:00:00+05:30", "narration": "NEFT/ZOMATO-PAYOUT/UTR002", "reference": "ZOMATO-2026-001"},
    {"type": "DEBIT", "mode": "UPI", "amount": "999.00", "currentBalance": "29379.00", "transactionTimestamp": "2026-06-04T15:30:00+05:30", "narration": "UPI/DR/AIRTEL FIBER BROADBAND/Utility", "reference": "EXP_02"},
    {"type": "CREDIT", "mode": "NEFT", "amount": "9100.00", "currentBalance": "38479.00", "transactionTimestamp": "2026-06-05T10:00:00+05:30", "narration": "NEFT/UBER-PAYOUT/UTR003", "reference": "UBER-2026-001"},
    {"type": "CREDIT", "mode": "NEFT", "amount": "7419.00", "currentBalance": "45898.00", "transactionTimestamp": "2026-06-06T10:00:00+05:30", "narration": "NEFT/OLA-PAYOUT/UTR004", "reference": "OLA-2026-001"},
    {"type": "DEBIT", "mode": "UPI", "amount": "1499.00", "currentBalance": "44399.00", "transactionTimestamp": "2026-06-07T11:20:00+05:30", "narration": "UPI/DR/GITHUB SUBSCRIPTION/Software", "reference": "EXP_03"},
    {"type": "CREDIT", "mode": "NEFT", "amount": "7638.00", "currentBalance": "52037.00", "transactionTimestamp": "2026-06-08T10:00:00+05:30", "narration": "NEFT/SWIGGY-PAYOUT/UTR005", "reference": "SWIGGY-2026-002"},
    {"type": "DEBIT", "mode": "UPI", "amount": "650.00", "currentBalance": "51387.00", "transactionTimestamp": "2026-06-09T14:10:00+05:30", "narration": "UPI/DR/SWIGGY FOOD DINING/Food", "reference": "EXP_04"},
    {"type": "CREDIT", "mode": "NEFT", "amount": "6105.00", "currentBalance": "57492.00", "transactionTimestamp": "2026-06-10T10:00:00+05:30", "narration": "NEFT/ZOMATO-PAYOUT/UTR006", "reference": "ZOMATO-2026-002"},
    {"type": "DEBIT", "mode": "UPI", "amount": "320.00", "currentBalance": "57172.00", "transactionTimestamp": "2026-06-11T16:00:00+05:30", "narration": "UPI/DR/ZEPTO GROCERIES SHOPPING/Supplies", "reference": "EXP_05"},
    {"type": "CREDIT", "mode": "NEFT", "amount": "8655.00", "currentBalance": "65827.00", "transactionTimestamp": "2026-06-12T10:00:00+05:30", "narration": "NEFT/UBER-PAYOUT/UTR007", "reference": "UBER-2026-002"},
    {"type": "CREDIT", "mode": "NEFT", "amount": "7696.00", "currentBalance": "73523.00", "transactionTimestamp": "2026-06-13T10:00:00+05:30", "narration": "NEFT/OLA-PAYOUT/UTR008", "reference": "OLA-2026-002"},
    {"type": "DEBIT", "mode": "UPI", "amount": "500.00", "currentBalance": "73023.00", "transactionTimestamp": "2026-06-14T10:30:00+05:30", "narration": "UPI/DR/HPCL PETROL PUMP/Fuel", "reference": "EXP_06"},
    {"type": "CREDIT", "mode": "NEFT", "amount": "8291.00", "currentBalance": "81314.00", "transactionTimestamp": "2026-06-15T10:00:00+05:30", "narration": "NEFT/SWIGGY-PAYOUT/UTR009", "reference": "SWIGGY-2026-003"},
    {"type": "DEBIT", "mode": "UPI", "amount": "1299.00", "currentBalance": "80015.00", "transactionTimestamp": "2026-06-16T12:00:00+05:30", "narration": "UPI/DR/AMAZON SHOPPING/Supplies", "reference": "EXP_07"},
    {"type": "CREDIT", "mode": "NEFT", "amount": "5546.00", "currentBalance": "85561.00", "transactionTimestamp": "2026-06-17T10:00:00+05:30", "narration": "NEFT/ZOMATO-PAYOUT/UTR010", "reference": "ZOMATO-2026-003"},
    {"type": "DEBIT", "mode": "UPI", "amount": "450.00", "currentBalance": "85111.00", "transactionTimestamp": "2026-06-18T18:00:00+05:30", "narration": "UPI/DR/RESTAURANT DINING/Food", "reference": "EXP_08"},
    {"type": "CREDIT", "mode": "NEFT", "amount": "9545.00", "currentBalance": "94656.00", "transactionTimestamp": "2026-06-19T10:00:00+05:30", "narration": "NEFT/UBER-PAYOUT/UTR011", "reference": "UBER-2026-003"},
    {"type": "CREDIT", "mode": "NEFT", "amount": "7241.00", "currentBalance": "101897.00", "transactionTimestamp": "2026-06-20T10:00:00+05:30", "narration": "NEFT/OLA-PAYOUT/UTR012", "reference": "OLA-2026-003"},
    {"type": "DEBIT", "mode": "UPI", "amount": "800.00", "currentBalance": "101097.00", "transactionTimestamp": "2026-06-21T09:30:00+05:30", "narration": "UPI/DR/BPCL FUEL/Fuel", "reference": "EXP_09"},
    {"type": "CREDIT", "mode": "NEFT", "amount": "7272.00", "currentBalance": "108369.00", "transactionTimestamp": "2026-06-22T10:00:00+05:30", "narration": "NEFT/SWIGGY-PAYOUT/UTR013", "reference": "SWIGGY-2026-004"},
    {"type": "DEBIT", "mode": "UPI", "amount": "2499.00", "currentBalance": "105870.00", "transactionTimestamp": "2026-06-23T14:00:00+05:30", "narration": "UPI/DR/OFFICE WAREHOUSE RENT/Workspace", "reference": "EXP_10"},
    {"type": "CREDIT", "mode": "NEFT", "amount": "6293.00", "currentBalance": "112163.00", "transactionTimestamp": "2026-06-24T10:00:00+05:30", "narration": "NEFT/ZOMATO-PAYOUT/UTR014", "reference": "ZOMATO-2026-004"},
    {"type": "DEBIT", "mode": "UPI", "amount": "399.00", "currentBalance": "111764.00", "transactionTimestamp": "2026-06-25T11:00:00+05:30", "narration": "UPI/DR/NETFLIX SUBSCRIPTION/Software", "reference": "EXP_11"},
    {"type": "CREDIT", "mode": "NEFT", "amount": "8922.00", "currentBalance": "120686.00", "transactionTimestamp": "2026-06-26T10:00:00+05:30", "narration": "NEFT/UBER-PAYOUT/UTR015", "reference": "UBER-2026-004"},
    {"type": "CREDIT", "mode": "NEFT", "amount": "7874.00", "currentBalance": "128560.00", "transactionTimestamp": "2026-06-27T10:00:00+05:30", "narration": "NEFT/OLA-PAYOUT/UTR016", "reference": "OLA-2026-004"},
    {"type": "DEBIT", "mode": "UPI", "amount": "450.00", "currentBalance": "128110.00", "transactionTimestamp": "2026-06-28T13:30:00+05:30", "narration": "UPI/DR/IOCL PETROL PUMP/Fuel", "reference": "EXP_12"},
    {"type": "CREDIT", "mode": "NEFT", "amount": "8459.00", "currentBalance": "136569.00", "transactionTimestamp": "2026-06-29T10:00:00+05:30", "narration": "NEFT/SWIGGY-PAYOUT/UTR017", "reference": "SWIGGY-2026-005"},
    {"type": "DEBIT", "mode": "UPI", "amount": "1200.00", "currentBalance": "135369.00", "transactionTimestamp": "2026-06-30T16:00:00+05:30", "narration": "UPI/DR/ELECTRICITY BILL/Utility", "reference": "EXP_13"},
    {"type": "CREDIT", "mode": "NEFT", "amount": "5734.00", "currentBalance": "141103.00", "transactionTimestamp": "2026-07-01T10:00:00+05:30", "narration": "NEFT/ZOMATO-PAYOUT/UTR018", "reference": "ZOMATO-2026-005"},
    {"type": "DEBIT", "mode": "UPI", "amount": "550.00", "currentBalance": "140553.00", "transactionTimestamp": "2026-07-02T12:00:00+05:30", "narration": "UPI/DR/HPCL PETROL/Fuel", "reference": "EXP_14"},
    {"type": "CREDIT", "mode": "NEFT", "amount": "9288.00", "currentBalance": "149841.00", "transactionTimestamp": "2026-07-03T10:00:00+05:30", "narration": "NEFT/UBER-PAYOUT/UTR019", "reference": "UBER-2026-005"},
    {"type": "CREDIT", "mode": "NEFT", "amount": "7508.00", "currentBalance": "157349.00", "transactionTimestamp": "2026-07-04T10:00:00+05:30", "narration": "NEFT/OLA-PAYOUT/UTR020", "reference": "OLA-2026-005"},
    {"type": "DEBIT", "mode": "UPI", "amount": "799.00", "currentBalance": "156550.00", "transactionTimestamp": "2026-07-05T15:00:00+05:30", "narration": "UPI/DR/JIO FIBER BROADBAND/Utility", "reference": "EXP_15"},
    {"type": "CREDIT", "mode": "NEFT", "amount": "7826.00", "currentBalance": "164376.00", "transactionTimestamp": "2026-07-06T10:00:00+05:30", "narration": "NEFT/SWIGGY-PAYOUT/UTR021", "reference": "SWIGGY-2026-006"},
    {"type": "DEBIT", "mode": "UPI", "amount": "349.00", "currentBalance": "164027.00", "transactionTimestamp": "2026-07-07T11:00:00+05:30", "narration": "UPI/DR/DOMINOS PIZZA/Food", "reference": "EXP_16"},
    {"type": "CREDIT", "mode": "NEFT", "amount": "6016.00", "currentBalance": "170043.00", "transactionTimestamp": "2026-07-08T10:00:00+05:30", "narration": "NEFT/ZOMATO-PAYOUT/UTR022", "reference": "ZOMATO-2026-006"},
    {"type": "CREDIT", "mode": "NEFT", "amount": "8744.00", "currentBalance": "178787.00", "transactionTimestamp": "2026-07-10T10:00:00+05:30", "narration": "NEFT/UBER-PAYOUT/UTR023", "reference": "UBER-2026-006"},
    {"type": "CREDIT", "mode": "NEFT", "amount": "7785.00", "currentBalance": "186572.00", "transactionTimestamp": "2026-07-11T10:00:00+05:30", "narration": "NEFT/OLA-PAYOUT/UTR024", "reference": "OLA-2026-006"},
    {"type": "DEBIT", "mode": "UPI", "amount": "480.00", "currentBalance": "186092.00", "transactionTimestamp": "2026-07-12T13:00:00+05:30", "narration": "UPI/DR/SHELL PETROL PUMP/Fuel", "reference": "EXP_17"},
    {"type": "CREDIT", "mode": "NEFT", "amount": "8014.00", "currentBalance": "194106.00", "transactionTimestamp": "2026-07-13T10:00:00+05:30", "narration": "NEFT/SWIGGY-PAYOUT/UTR025", "reference": "SWIGGY-2026-007"},
    {"type": "CREDIT", "mode": "NEFT", "amount": "6382.00", "currentBalance": "200488.00", "transactionTimestamp": "2026-07-15T10:00:00+05:30", "narration": "NEFT/ZOMATO-PAYOUT/UTR026", "reference": "ZOMATO-2026-007"},
    {"type": "CREDIT", "mode": "NEFT", "amount": "9723.00", "currentBalance": "210211.00", "transactionTimestamp": "2026-07-17T10:00:00+05:30", "narration": "NEFT/UBER-PAYOUT/UTR027", "reference": "UBER-2026-007"},
    {"type": "CREDIT", "mode": "NEFT", "amount": "8062.00", "currentBalance": "218273.00", "transactionTimestamp": "2026-07-18T10:00:00+05:30", "narration": "NEFT/OLA-PAYOUT/UTR028", "reference": "OLA-2026-007"},
    {"type": "DEBIT", "mode": "UPI", "amount": "1899.00", "currentBalance": "216374.00", "transactionTimestamp": "2026-07-19T14:30:00+05:30", "narration": "UPI/DR/ADOBE CREATIVE CLOUD/Software", "reference": "EXP_18"},
    {"type": "CREDIT", "mode": "NEFT", "amount": "7549.00", "currentBalance": "223923.00", "transactionTimestamp": "2026-07-20T10:00:00+05:30", "narration": "NEFT/SWIGGY-PAYOUT/UTR029", "reference": "SWIGGY-2026-008"},
    {"type": "CREDIT", "mode": "NEFT", "amount": "5922.00", "currentBalance": "229845.00", "transactionTimestamp": "2026-07-22T10:00:00+05:30", "narration": "NEFT/ZOMATO-PAYOUT/UTR030", "reference": "ZOMATO-2026-008"},
    {"type": "CREDIT", "mode": "NEFT", "amount": "9011.00", "currentBalance": "238856.00", "transactionTimestamp": "2026-07-24T10:00:00+05:30", "narration": "NEFT/UBER-PAYOUT/UTR031", "reference": "UBER-2026-008"},
    {"type": "CREDIT", "mode": "NEFT", "amount": "7330.00", "currentBalance": "246186.00", "transactionTimestamp": "2026-07-25T10:00:00+05:30", "narration": "NEFT/OLA-PAYOUT/UTR032", "reference": "OLA-2026-008"},
    {"type": "CREDIT", "mode": "NEFT", "amount": "8152.50", "currentBalance": "254338.50", "transactionTimestamp": "2026-07-27T10:00:00+05:30", "narration": "NEFT/SWIGGY-PAYOUT/UTR033", "reference": "SWIGGY-2026-009"},
    {"type": "CREDIT", "mode": "NEFT", "amount": "6204.00", "currentBalance": "260542.50", "transactionTimestamp": "2026-07-29T10:00:00+05:30", "narration": "NEFT/ZOMATO-PAYOUT/UTR034", "reference": "ZOMATO-2026-009"},
    {"type": "CREDIT", "mode": "NEFT", "amount": "9466.00", "currentBalance": "270008.50", "transactionTimestamp": "2026-07-31T10:00:00+05:30", "narration": "NEFT/UBER-PAYOUT/UTR035", "reference": "UBER-2026-009"},
    {"type": "CREDIT", "mode": "NEFT", "amount": "7651.50", "currentBalance": "277660.00", "transactionTimestamp": "2026-08-01T10:00:00+05:30", "narration": "NEFT/OLA-PAYOUT/UTR036", "reference": "OLA-2026-009"},
    {"type": "CREDIT", "mode": "NEFT", "amount": "7737.00", "currentBalance": "285397.00", "transactionTimestamp": "2026-08-03T10:00:00+05:30", "narration": "NEFT/SWIGGY-PAYOUT/UTR037", "reference": "SWIGGY-2026-010"},
    {"type": "CREDIT", "mode": "NEFT", "amount": "5783.50", "currentBalance": "291180.50", "transactionTimestamp": "2026-08-05T10:00:00+05:30", "narration": "NEFT/ZOMATO-PAYOUT/UTR038", "reference": "ZOMATO-2026-010"},
    {"type": "CREDIT", "mode": "NEFT", "amount": "8877.50", "currentBalance": "300058.00", "transactionTimestamp": "2026-08-07T10:00:00+05:30", "narration": "NEFT/UBER-PAYOUT/UTR039", "reference": "UBER-2026-010"},
    {"type": "CREDIT", "mode": "NEFT", "amount": "7562.50", "currentBalance": "307620.50", "transactionTimestamp": "2026-08-08T10:00:00+05:30", "narration": "NEFT/OLA-PAYOUT/UTR040", "reference": "OLA-2026-010"}
  ];

  // Process in controlled chunks (batches of 3) to prevent overloading the backend/AI
  const chunkSize = 3;
  let totalSynced = 0;

  for (let i = 0; i < rawTransactions.length; i += chunkSize) {
    const chunk = rawTransactions.slice(i, i + chunkSize);

    const chunkPromises = chunk.map(async (txn) => {
      const isCredit = txn.type === 'CREDIT';
      const category = getCategoryFromNarration(txn.narration);
      
      const webhookPayload = {
        user_id: mock_user_id,
        amount: parseFloat(txn.amount),
        txn_type: isCredit ? "INCOME" : "EXPENSE",
        source_ref: txn.reference,
        raw_narration: txn.narration,
        category: category,
        transaction_category: category,
        date: txn.transactionTimestamp,
        timestamp: txn.transactionTimestamp,
        txn_timestamp: txn.transactionTimestamp
      };

      const response = await fetch(`${FASTAPI_URL}/webhooks/bank-transaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(webhookPayload)
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `Failed to sync transaction ${txn.reference}`);
      }

      totalSynced++;
    });

    // Wait for the current batch of 3 to finish before proceeding to the next batch
    await Promise.all(chunkPromises);
  }

  // Return a valid BankFeedIngestionResponse so the onboarding screen transitions smoothly
  return {
    message: "Successfully ingested and categorized bank feed",
    total_processed: totalSynced,
    data: []
  } as unknown as BankFeedIngestionResponse;
}

function getCategoryFromNarration(narration: string): string {
  if (narration.endsWith("/Fuel")) return "TRAVEL_AND_TRANSPORT";
  if (narration.endsWith("/Utility")) return "UTILITIES_TELECOM";
  if (narration.endsWith("/Software")) return "SOFTWARE_SUBSCRIPTIONS";
  if (narration.endsWith("/Food")) return "FOOD_AND_DINING";
  if (narration.endsWith("/Supplies")) return "OFFICE_BUSINESS_SUPPLIES";
  if (narration.endsWith("/Workspace")) return "RENT_WORKSPACE";
  return "OTHER";
}