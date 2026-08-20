import AsyncStorage from "@react-native-async-storage/async-storage";
import type { OnboardingState } from "@/types/onboarding";

const STORAGE_KEY = "gig:onboardingState";

export const DEFAULT_ONBOARDING_STATE: OnboardingState = {
  currentStep: 0,
  onboardingCompleted: false,
  selectedBank: null,
  selectedPlatforms: [],
  bankFeedResult: null,
  gigPayoutResults: null,
};

export async function loadOnboardingState(): Promise<OnboardingState> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_ONBOARDING_STATE;
    return { ...DEFAULT_ONBOARDING_STATE, ...JSON.parse(raw) } as OnboardingState;
  } catch {
    return DEFAULT_ONBOARDING_STATE;
  }
}

export async function saveOnboardingState(state: OnboardingState): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/** Used by Profile → "Sign out / Start over". Only clears onboarding data. */
export async function clearOnboardingState(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
