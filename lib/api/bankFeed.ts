import { supabase } from "@/lib/supabase";
import { getMockUserId } from "@/lib/mockUser";
import type { BankFeedIngestionResponse } from "@/types/onboarding";

/**
 * Calls the setu-aa-ingestion edge function.
 *
 * IMPORTANT: the request body is the exact shape from the provided API
 * contract. The contract's `Payload` array is fixed sample transaction data
 * (this is a *mock* AA-ingestion endpoint, not a live bank connection), so
 * only `mock_user_id` varies per call — nothing about the payload was invented.
 */
export async function submitBankFeed(): Promise<BankFeedIngestionResponse> {
  const mock_user_id = await getMockUserId();

  const body = {
    mock_user_id,
    Payload: [
      {
        data: [
          {
            decryptedFI: {
              account: {
                type: "SAVINGS",
                maskedAccNumber: "XXXXXX1234",
                transactions: {
                  transaction: [
                    {
                      type: "CREDIT",
                      mode: "NEFT",
                      amount: "7900.00",
                      currentBalance: "15420.50",
                      transactionTimestamp: "2026-08-25T10:30:00+05:30",
                      narration: "NEFT/SWIGGY-PAYOUT/UTR123456789",
                      reference: "UTR123456789",
                    },
                    {
                      type: "DEBIT",
                      mode: "UPI",
                      amount: "450.00",
                      currentBalance: "14970.50",
                      transactionTimestamp: "2026-08-25T12:15:00+05:30",
                      narration: "UPI/DR/98765/P पेट्रोल बंक/PetrolPump",
                      reference: "UPI987654321",
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    ],
  };

  const { data, error } = await supabase.functions.invoke<BankFeedIngestionResponse>(
    "setu-aa-ingestion",
    { body }
  );

  if (error) {
    throw new Error(error.message || "Failed to link bank account. Please try again.");
  }
  if (!data) {
    throw new Error("No response received from the bank ingestion service.");
  }

  return data;
}
