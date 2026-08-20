import { supabase } from "@/lib/supabase";
import { getMockUserId } from "@/lib/mockUser";
import { PLATFORM_MOCK_FINANCIALS, GIG_PLATFORMS } from "@/data/platforms";
import type { GigPayoutResponse, PlatformId } from "@/types/onboarding";

/** Formats "now" as an IST-offset ISO string, matching the contract's example format. */
function istTimestampNow(): string {
  const now = new Date();
  const istOffsetMs = 5.5 * 60 * 60 * 1000;
  const ist = new Date(now.getTime() + istOffsetMs);
  const pad = (n: number) => String(n).padStart(2, "0");
  const y = ist.getUTCFullYear();
  const m = pad(ist.getUTCMonth() + 1);
  const d = pad(ist.getUTCDate());
  const hh = pad(ist.getUTCHours());
  const mm = pad(ist.getUTCMinutes());
  const ss = pad(ist.getUTCSeconds());
  return `${y}-${m}-${d}T${hh}:${mm}:${ss}+05:30`;
}

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
  const payout_date = istTimestampNow();

  const results: GigPayoutResponse[] = [];

  for (const platformId of selectedPlatforms) {
    const platform = GIG_PLATFORMS.find((p) => p.id === platformId);
    const financials = PLATFORM_MOCK_FINANCIALS[platformId];
    if (!platform || !financials) continue;

    const body = {
      mock_user_id,
      platform_name: platform.platformName,
      expected_gross: financials.expected_gross,
      platform_fee: financials.platform_fee,
      tds_deducted: financials.tds_deducted,
      payout_date,
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

  return results;
}
