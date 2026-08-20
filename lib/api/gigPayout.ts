import { supabase } from "@/lib/supabase";
import { getMockUserId } from "@/lib/mockUser";
import { PLATFORM_MOCK_FINANCIALS, GIG_PLATFORMS } from "@/data/platforms";
import type { GigPayoutResponse, PlatformId } from "@/types/onboarding";


/**
 * Calls the mock-gig-payout edge function once per selected platform, using
 * the exact request shape from the provided contract. Field names and
 * structure are unchanged; only platform_name/expected_gross/platform_fee/
 * tds_deducted vary, sourced from data/platforms.ts.
 */
export async function submitGigPayouts(
  selectedPlatforms: PlatformId[]
): Promise<GigPayoutResponse[]> {
  const mock_user_id = await getMockUserId();

  const results: GigPayoutResponse[] = [];

  for (const platformId of selectedPlatforms) {
    const platform = GIG_PLATFORMS.find((p) => p.id === platformId);
    const financials = PLATFORM_MOCK_FINANCIALS[platformId];
    if (!platform || !financials) continue;

    for (const record of financials) {
      const body = {
        mock_user_id,
        platform_name: platform.platformName,
        expected_gross: record.gross_amount,
        platform_fee: record.platform_fee,
        tds_deducted: record.tds_deducted,
        payout_date: `${record.payout_date}T10:00:00+05:30`,
      };

      const { data, error } = await supabase.functions.invoke<GigPayoutResponse>(
        "mock-gig-payout",
        { body }
      );

      if (error) {
        throw new Error(
          error.message || `Failed to record payout data for ${platform.platformName}.`
        );
      }
      if (!data) {
        throw new Error(`No response received for ${platform.platformName}.`);
      }

      results.push(data);
    }
  }

  return results;
}
