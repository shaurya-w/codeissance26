export type BankId = "BOI" | "BOB" | "HDFC" | "AXIS" | "ICICI" | "SBI";

export interface Bank {
  id: BankId;
  name: string;
  shortName: string;
  /**
   * Remote logo URI. Falls back to a text/initial badge in <BankSelector />
   * if the image fails to load (offline, blocked domain, etc).
   */
  logoUri: string;
}

export type PlatformId = "swiggy" | "zomato" | "blinkit" | "fiverr" | "zepto" | "uber" | "ola";

export interface GigPlatform {
  id: PlatformId;
  /** Sent to the backend as `platform_name` — must match backend expectations exactly. */
  platformName: string;
  logoUri: string;
}

/** A single transaction row as returned by the setu-aa-ingestion function. */
export interface BankFeedTransaction {
  id: string;
  user_id: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  date: string;
  category: string;
  is_tax_deductible: boolean;
  source_type: string;
  source_ref: string;
  tax_rule_applied: string | null;
  created_at: string;
}

export interface BankFeedIngestionResponse {
  message: string;
  total_processed: number;
  data: BankFeedTransaction[];
}

/** A single payout record as returned by the mock-gig-payout function. */
export interface GigPayoutRecord {
  id: string;
  integration_id: string;
  expected_gross: number;
  expected_net: number;
  platform_fee: number;
  tds_deducted: number;
  payout_date: string;
  is_reconciled: boolean;
  created_at: string;
}

export interface GigPayoutResponse {
  message: string;
  data: GigPayoutRecord;
}

export interface OnboardingState {
  currentStep: 1 | 2;
  onboardingCompleted: boolean;
  selectedBank: BankId | null;
  selectedPlatforms: PlatformId[];
  bankFeedResult: BankFeedIngestionResponse | null;
  gigPayoutResults: GigPayoutResponse[] | null;
}
