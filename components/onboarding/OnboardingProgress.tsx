import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { theme } from "@/constants/theme";

interface OnboardingProgressProps {
  currentStep: 1 | 2;
  totalSteps?: number;
}

export function OnboardingProgress({ currentStep, totalSteps = 2 }: OnboardingProgressProps) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const fillPct = (currentStep / totalSteps) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.stepLabel}>
          STEP {pad(currentStep)} / {pad(totalSteps)}
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${fillPct}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.xs,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stepLabel: {
    fontFamily: theme.typography.fontMono,
    fontSize: theme.typography.eyebrow.fontSize,
    fontWeight: theme.typography.fontWeights.black,
    letterSpacing: theme.typography.eyebrow.letterSpacing,
    color: theme.colors.onboarding.progress.stepActive,
  },
  track: {
    height: 4,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.onboarding.progress.track,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.onboarding.progress.fill,
  },
});
