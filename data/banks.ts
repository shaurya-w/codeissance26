import type { Bank } from "@/types/onboarding";

/**
 * Real bank logos are fetched by domain via Clearbit's public logo API
 * (https://clearbit.com/logo) rather than bundled/faked. If a logo fails to
 * load, <BankSelector /> falls back to a text-initial badge automatically —
 * see components/onboarding/BankSelector.tsx.
 *
 * `id` is the stable internal identifier the app uses in local state.
 * It is NOT currently sent to the setu-aa-ingestion endpoint, since that
 * contract only accepts { mock_user_id, Payload }. If the backend contract
 * changes to accept a bank identifier, wire `selectedBank` through in
 * lib/api/bankFeed.ts.
 */
export const BANKS: Bank[] = [
  {
    id: "BOI",
    name: "Bank of India",
    shortName: "BOI",
    logoUri: "https://logo.clearbit.com/bankofindia.co.in?size=128",
  },
  {
    id: "BOB",
    name: "Bank of Baroda",
    shortName: "BOB",
    logoUri: "https://logo.clearbit.com/bankofbaroda.in?size=128",
  },
  {
    id: "HDFC",
    name: "HDFC Bank",
    shortName: "HDFC",
    logoUri: "https://logo.clearbit.com/hdfcbank.com?size=128",
  },
  {
    id: "AXIS",
    name: "Axis Bank",
    shortName: "Axis",
    logoUri: "https://logo.clearbit.com/axisbank.com?size=128",
  },
  {
    id: "ICICI",
    name: "ICICI Bank",
    shortName: "ICICI",
    logoUri: "https://logo.clearbit.com/icicibank.com?size=128",
  },
  {
    id: "SBI",
    name: "State Bank of India",
    shortName: "SBI",
    logoUri: "https://logo.clearbit.com/sbi.co.in?size=128",
  },
];
