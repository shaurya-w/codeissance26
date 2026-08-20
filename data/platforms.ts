import type { GigPlatform, PlatformId } from "@/types/onboarding";

/**
 * `platformName` is sent verbatim as the backend's `platform_name` field —
 * keep it matching exactly what the backend expects (see the mock-gig-payout
 * contract, which shows "Swiggy" as an example).
 */
export const GIG_PLATFORMS: GigPlatform[] = [
  {
    id: "swiggy",
    platformName: "Swiggy",
    logoUri: "https://logo.clearbit.com/swiggy.com?size=128",
  },
  {
    id: "zomato",
    platformName: "Zomato",
    logoUri: "https://logo.clearbit.com/zomato.com?size=128",
  },
  {
    id: "blinkit",
    platformName: "Blinkit",
    logoUri: "https://logo.clearbit.com/blinkit.com?size=128",
  },
  {
    id: "fiverr",
    platformName: "Fiverr",
    logoUri: "https://logo.clearbit.com/fiverr.com?size=128",
  },
];

/**
 * Mock payout figures per platform. The mock-gig-payout function only
 * documents ONE example request (Swiggy: gross 10000 / fee 2000 / tds 100).
 * The exact numbers for other platforms were not provided in the API
 * contract, so these are indicative placeholders scaled off that one
 * example — replace with real figures once the backend/product team
 * confirms per-platform values.
 */
export const PLATFORM_MOCK_FINANCIALS: Record<
  PlatformId,
  { expected_gross: number; platform_fee: number; tds_deducted: number }
> = {
  swiggy: { expected_gross: 10000.0, platform_fee: 2000.0, tds_deducted: 100.0 },
  zomato: { expected_gross: 9500.0, platform_fee: 1900.0, tds_deducted: 95.0 },
  blinkit: { expected_gross: 8200.0, platform_fee: 1230.0, tds_deducted: 82.0 },
  fiverr: { expected_gross: 15000.0, platform_fee: 2250.0, tds_deducted: 150.0 },
};
