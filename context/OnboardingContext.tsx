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
import { supabase } from "@/lib/supabase";

interface OnboardingContextValue {
  state: OnboardingState;
  /** True once the persisted state has been read from AsyncStorage. */
  isReady: boolean;

  // Step 0
  isSubmittingStep0: boolean;
  step0Error: string | null;
  submitStep0: (
    name: string,
    email: string,
    taxRegime: "normal" | "presumptive",
    presumptiveScheme: "44AD" | "44ADA" | null
  ) => Promise<boolean>;

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
  const [providerState, setProviderState] = useState<{
    state: OnboardingState;
    isReady: boolean;
  }>({
    state: DEFAULT_ONBOARDING_STATE,
    isReady: false,
  });

  const { state, isReady } = providerState;

  const [selectedBank, setSelectedBankState] = useState<BankId | null>(null);
  const [isSubmittingStep0, setIsSubmittingStep0] = useState(false);
  const [step0Error, setStep0Error] = useState<string | null>(null);
  const [isSubmittingStep1, setIsSubmittingStep1] = useState(false);
  const [step1Error, setStep1Error] = useState<string | null>(null);

  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformId[]>([]);
  const [isSubmittingStep2, setIsSubmittingStep2] = useState(false);
  const [step2Error, setStep2Error] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const loaded = await loadOnboardingState();
      setSelectedBankState(loaded.selectedBank);
      setSelectedPlatforms(loaded.selectedPlatforms);
      setProviderState({
        state: loaded,
        isReady: true,
      });
    })();
  }, []);

  const persist = useCallback(async (next: OnboardingState) => {
    setProviderState({
      state: next,
      isReady: true,
    });
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

  const submitStep0 = useCallback(async (
    name: string,
    email: string,
    taxRegime: "normal" | "presumptive",
    presumptiveScheme: "44AD" | "44ADA" | null
  ): Promise<boolean> => {
    if (isSubmittingStep0) return false;

    setIsSubmittingStep0(true);
    setStep0Error(null);
    try {
      const { error } = await supabase
        .from("users")
        .upsert({
          id: "97fc9b68-f8b6-497f-8dc4-a6829af235f7",
          name,
          email,
          tax_regime: taxRegime,
          presumptive_scheme: taxRegime === "normal" ? null : presumptiveScheme,
        });

      if (error) {
        throw new Error(error.message || "Failed to create/update user.");
      }

      await persist({
        ...state,
        currentStep: 1,
      });
      return true;
    } catch (err) {
      setStep0Error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      return false;
    } finally {
      setIsSubmittingStep0(false);
    }
  }, [isSubmittingStep0, persist, state]);

  const submitStep1 = useCallback(async (): Promise<boolean> => {
    if (selectedPlatforms.length === 0 || isSubmittingStep1) return false;

    setIsSubmittingStep1(true);
    setStep1Error(null);
    try {
      const results = await submitGigPayouts(selectedPlatforms);
      await persist({
        ...state,
        currentStep: 2,
        selectedPlatforms,
        gigPayoutResults: results,
      });
      return true;
    } catch (err) {
      setStep1Error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      return false;
    } finally {
      setIsSubmittingStep1(false);
    }
  }, [selectedPlatforms, isSubmittingStep1, persist, state]);

  const submitStep2 = useCallback(async (): Promise<boolean> => {
    if (!selectedBank || isSubmittingStep2) return false;

    setIsSubmittingStep2(true);
    setStep2Error(null);
    try {
      const result = await submitBankFeed();
      await persist({
        ...state,
        currentStep: 2,
        selectedBank,
        bankFeedResult: result,
        onboardingCompleted: true,
      });
      return true;
    } catch (err) {
      setStep2Error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      return false;
    } finally {
      setIsSubmittingStep2(false);
    }
  }, [selectedBank, isSubmittingStep2, persist, state]);

  const signOut = useCallback(async () => {
    await clearOnboardingState();
    setSelectedBankState(null);
    setSelectedPlatforms([]);
    setStep1Error(null);
    setStep2Error(null);
    setProviderState({
      state: DEFAULT_ONBOARDING_STATE,
      isReady: true,
    });
  }, []);

  return (
    <OnboardingContext.Provider
      value={{
        state,
        isReady,
        isSubmittingStep0,
        step0Error,
        submitStep0,
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
