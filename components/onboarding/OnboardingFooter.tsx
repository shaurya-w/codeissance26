import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/constants/theme";

interface OnboardingFooterProps {
  ctaLabel: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  error?: string | null;
}

export function OnboardingFooter({
  ctaLabel,
  onPress,
  disabled = false,
  loading = false,
  error,
}: OnboardingFooterProps) {
  const isDisabled = disabled || loading;

  return (
    <View style={styles.container}>
      {error ? (
        <View style={styles.errorBanner} accessibilityLiveRegion="polite">
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityLabel={ctaLabel}
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        style={({ pressed }) => [
          styles.cta,
          isDisabled && styles.ctaDisabled,
          pressed && !isDisabled && styles.ctaPressed,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={theme.colors.onboarding.cta.text} />
        ) : (
          <Text style={[styles.ctaText, isDisabled && styles.ctaTextDisabled]}>{ctaLabel}</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.sm,
  },
  errorBanner: {
    backgroundColor: theme.colors.onboarding.feedback.errorBackground,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  errorText: {
    color: theme.colors.onboarding.feedback.errorText,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.typography.fontWeights.semibold,
  },
  cta: {
    height: 56,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.onboarding.cta.background,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaDisabled: {
    backgroundColor: theme.colors.onboarding.cta.backgroundDisabled,
  },
  ctaPressed: {
    opacity: 0.9,
  },
  ctaText: {
    color: theme.colors.onboarding.cta.text,
    fontSize: theme.fontSize.md,
    fontWeight: theme.typography.fontWeights.black,
    letterSpacing: 0.3,
  },
  ctaTextDisabled: {
    color: theme.colors.onboarding.cta.textDisabled,
  },
});
