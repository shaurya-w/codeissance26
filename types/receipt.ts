/**
 * types/receipt.ts
 * ----------------
 * Type definitions for receipt data extracted via OCR or manual entry,
 * and the request/response shapes for the /classify Edge Function.
 */

export type TransactionType = "EXPENSE" | "INCOME";

export type SourceType = "RECEIPT_OCR" | "MANUAL";

/** Shape of data extracted from a receipt (internal to the app). */
export interface ReceiptData {
  /** The total amount on the receipt (e.g. 850.00) */
  amount: number;

  /** Whether this is an expense or income */
  transaction_type: TransactionType;

  /** Date of the transaction in YYYY-MM-DD format */
  date: string;

  /** Vendor / store / business name */
  vendor: string;

  /** ISO timestamp — always null for now */
  timestamp: string | null;

  /** Human-readable description of the purchase */
  description: string;

  /** How this data was captured */
  source_type: SourceType;
}

/**
 * Payload expected by the /classify Supabase Edge Function.
 * See: supabase/functions/classify/index.ts
 */
export interface ClassifyRequest {
  user_id: string;
  amount: number;
  vendor: string;
  description?: string;
  date: string; // YYYY-MM-DD
}

/** Response when confidence > 60 — auto-classified and saved. */
export interface ClassifySuccessResponse {
  status: "SUCCESS";
  message: string;
  confidence_score: number;
  transaction: Record<string, any>;
}

/** Response when confidence <= 60 — needs manual user approval. */
export interface ClassifyPendingResponse {
  status: "REQUIRES_APPROVAL";
  message: string;
  confidence_score: number;
  pending_action_id: string;
}

/** Union of both possible /classify responses. */
export type ClassifyResponse = ClassifySuccessResponse | ClassifyPendingResponse;
