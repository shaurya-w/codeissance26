import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

import { submitBankFeed } from "@/lib/api/bankFeed";
import { submitGigPayouts } from "@/lib/api/gigPayout";
import {
  DEFAULT_ONBOARDING_STATE,
  clearOnboardingState,
  loadOnboardingState,
  saveOnboardingState,
} from "@/lib/onboardingStorage";
import type { BankId, OnboardingState, PlatformId } from "@/types/onboarding";

interface OnboardingContextValue {
  state: OnboardingState;
  /** True once the persisted state has been read from AsyncStorage. */
  isReady: boolean;

  // Step 1
  selectedBank: BankId | null;
  setSelectedBank: (bank: BankId) => void;
  isSubmittingStep1: boolean;
  step1Error: string | null;
  submitStep1: () => Promise<boolean>;

  // Step 2
  selectedPlatforms: PlatformId[];
  togglePlatform: (platform: PlatformId) => void;
  isSubmittingStep2: boolean;
  step2Error: string | null;
  submitStep2: () => Promise<boolean>;

  // Lifecycle
  signOut: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextValue | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<OnboardingState>(DEFAULT_ONBOARDING_STATE);
  const [isReady, setIsReady] = useState(false);

  const [selectedBank, setSelectedBankState] = useState<BankId | null>(null);
  const [isSubmittingStep1, setIsSubmittingStep1] = useState(false);
  const [step1Error, setStep1Error] = useState<string | null>(null);

  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformId[]>([]);
  const [isSubmittingStep2, setIsSubmittingStep2] = useState(false);
  const [step2Error, setStep2Error] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const loaded = await loadOnboardingState();
      setState(loaded);
      setSelectedBankState(loaded.selectedBank);
      setSelectedPlatforms(loaded.selectedPlatforms);
      setIsReady(true);
    })();
  }, []);

  const persist = useCallback(async (next: OnboardingState) => {
    setState(next);
    await saveOnboardingState(next);
  }, []);

  const setSelectedBank = useCallback((bank: BankId) => {
    setStep1Error(null);
    setSelectedBankState(bank);
  }, []);

  const togglePlatform = useCallback((platform: PlatformId) => {
    setStep2Error(null);
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  }, []);

  const submitStep1 = useCallback(async (): Promise<boolean> => {
    if (!selectedBank || isSubmittingStep1) return false;

    setIsSubmittingStep1(true);
    setStep1Error(null);
    try {
      const result = await submitBankFeed();
      await persist({
        ...state,
        currentStep: 2,
        selectedBank,
        bankFeedResult: result,
      });
      return true;
    } catch (err) {
      setStep1Error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      return false;
    } finally {
      setIsSubmittingStep1(false);
    }
  }, [selectedBank, isSubmittingStep1, persist, state]);

  const submitStep2 = useCallback(async (): Promise<boolean> => {
    if (selectedPlatforms.length === 0 || isSubmittingStep2) return false;

    setIsSubmittingStep2(true);
    setStep2Error(null);
    try {
      const results = await submitGigPayouts(selectedPlatforms);
      await persist({
        ...state,
        currentStep: 2,
        selectedPlatforms,
        gigPayoutResults: results,
        onboardingCompleted: true,
      });
      return true;
    } catch (err) {
      setStep2Error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      return false;
    } finally {
      setIsSubmittingStep2(false);
    }
  }, [selectedPlatforms, isSubmittingStep2, persist, state]);

  const signOut = useCallback(async () => {
    await clearOnboardingState();
    setState(DEFAULT_ONBOARDING_STATE);
    setSelectedBankState(null);
    setSelectedPlatforms([]);
    setStep1Error(null);
    setStep2Error(null);
  }, []);

  return (
    <OnboardingContext.Provider
      value={{
        state,
        isReady,
        selectedBank,
        setSelectedBank,
        isSubmittingStep1,
        step1Error,
        submitStep1,
        selectedPlatforms,
        togglePlatform,
        isSubmittingStep2,
        step2Error,
        submitStep2,
        signOut,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding(): OnboardingContextValue {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used within an OnboardingProvider");
  return ctx;
}
