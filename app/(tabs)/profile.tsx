import { LogOut } from "lucide-react-native";
import { router } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { Header } from "@/components/Header";
import { theme } from "@/constants/theme";
import { useOnboarding } from "@/context/OnboardingContext";

export default function ProfileScreen() {
  const { signOut } = useOnboarding();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await signOut();
      router.replace("/onboarding/step-1");
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        eyebrow="Account & Preferences"
        title="Profile"
        subtitle="User credentials and environmental parameters"
      />
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardEyebrow}>ACCOUNT DETAILS</Text>
          <Text style={styles.cardHeading}>User Settings</Text>
          <Text style={styles.body}>
            Manage telemetry sync, Supabase authentication, and regional benchmarks.
          </Text>
        </View>

        <Pressable
          onPress={handleSignOut}
          disabled={isSigningOut}
          accessibilityRole="button"
          accessibilityLabel="Sign out and start over"
          accessibilityState={{ disabled: isSigningOut, busy: isSigningOut }}
          style={({ pressed }) => [
            styles.signOutButton,
            pressed && !isSigningOut && styles.signOutButtonPressed,
          ]}
        >
          {isSigningOut ? (
            <ActivityIndicator color={theme.colors.onboarding.feedback.errorText} />
          ) : (
            <>
              <LogOut size={18} color={theme.colors.onboarding.feedback.errorText} />
              <Text style={styles.signOutText}>Sign out / Start over</Text>
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.pageBg,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.card,
    padding: theme.spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
    gap: theme.spacing.xs,
  },
  cardEyebrow: {
    fontSize: theme.typography.eyebrow.fontSize,
    fontWeight: theme.typography.eyebrow.fontWeight,
    letterSpacing: theme.typography.eyebrow.letterSpacing,
    textTransform: theme.typography.eyebrow.textTransform,
    color: theme.colors.brandGreen,
  },
  cardHeading: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.typography.fontWeights.black,
    color: theme.colors.ink,
  },
  body: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedSage.muted1,
    lineHeight: 20,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    height: 52,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.onboarding.feedback.errorBackground,
  },
  signOutButtonPressed: {
    opacity: 0.85,
  },
  signOutText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.onboarding.feedback.errorText,
  },
});
