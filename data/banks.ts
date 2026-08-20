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
    logoUri: "https://companieslogo.com/img/orig/BANKINDIA.NS-e3d88e01.png?t=1720244490",
    // No fallback image found in assets/ for Bank of India
  },
  {
    id: "BOB",
    name: "Bank of Baroda",
    shortName: "BOB",
    logoUri: "https://images.seeklogo.com/logo-png/19/1/bank-of-baroda-logo-png_seeklogo-195534.png",
    fallbackAsset: require("../assets/BOB.jpeg"),
  },
  {
    id: "HDFC",
    name: "HDFC Bank",
    shortName: "HDFC",
    logoUri: "https://companieslogo.com/img/orig/HDB-bb6241fe.png?t=1720244492",
    fallbackAsset: require("../assets/HDFC.jpeg"),
  },
  {
    id: "AXIS",
    name: "Axis Bank",
    shortName: "Axis",
    logoUri: "https://img.logo.dev/axisbank.com?token=live_6a1a28fd-6420-4492-aeb0-b297461d9de2&size=512&retina=true&format=png",
    fallbackAsset: require("../assets/AXIS.jpeg"),
  },
  {
    id: "ICICI",
    name: "ICICI Bank",
    shortName: "ICICI",
    logoUri: "https://logos-world.net/wp-content/uploads/2025/11/ICICI-Bank-Symbol.png",
    fallbackAsset: require("../assets/ICICI.jpeg"),
  },
  {
    id: "SBI",
    name: "State Bank of India",
    shortName: "SBI",
    logoUri: "https://images.seeklogo.com/logo-png/39/2/sbi-logo-png_seeklogo-398127.png",
    fallbackAsset: require("../assets/SBI.jpeg"),
  },
];
