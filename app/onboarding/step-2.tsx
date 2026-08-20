import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { OnboardingFooter } from "@/components/onboarding/OnboardingFooter";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { BankSelector } from "@/components/onboarding/BankSelector";
import { theme } from "@/constants/theme";
import { useOnboarding } from "@/context/OnboardingContext";

export default function OnboardingStep2Screen() {
  const { selectedBank, setSelectedBank, isSubmittingStep2, step2Error, submitStep2 } =
    useOnboarding();

  const handleFinish = async () => {
    const success = await submitStep2();
    if (success) {
      router.replace("/(tabs)");
    }
  };

  return (
    <OnboardingLayout
      step={2}
      eyebrow="Almost there"
      title="Onboarding"
      subtitle="Connect your bank so we can track income and expenses automatically."
      footer={
        <OnboardingFooter
          ctaLabel="Finish setup"
          onPress={handleFinish}
          disabled={!selectedBank}
          loading={isSubmittingStep2}
          error={step2Error}
        />
      }
    >
      <View style={styles.intro}>
        <Text style={styles.headline}>Link your bank</Text>
        <Text style={styles.subtext}>
          Choose the bank your gig income lands in. This lets us surface your real cash flow —
          nothing is shared beyond what's needed to categorize transactions.
        </Text>
      </View>

      <BankSelector selectedBank={selectedBank} onSelect={setSelectedBank} />
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  intro: {
    gap: theme.spacing.xxs,
    marginBottom: theme.spacing.xs,
  },
  headline: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.typography.fontWeights.black,
    color: theme.colors.ink,
    letterSpacing: -0.5,
  },
  subtext: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedSage.muted1,
    lineHeight: 20,
  },
});
