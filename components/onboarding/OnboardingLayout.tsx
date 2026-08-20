import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";

import { Header } from "@/components/Header";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { theme } from "@/constants/theme";

interface OnboardingLayoutProps {
  step: 1 | 2;
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

export function OnboardingLayout({
  step,
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: OnboardingLayoutProps) {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Header eyebrow={eyebrow} title={title} subtitle={subtitle} />

      <View style={styles.progressWrap}>
        <OnboardingProgress currentStep={step} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>

      <View style={styles.footer}>{footer}</View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.pageBg,
  },
  progressWrap: {
    paddingHorizontal: theme.spacing.md,
    marginTop: theme.spacing.xs,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.md,
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  footer: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.pageBg,
  },
});
