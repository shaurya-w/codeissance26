import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Header } from "@/components/Header";
import { theme } from "@/constants/theme";
import { isSupabaseConfigured } from "@/lib/supabase";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Header title="Home" />
      <View style={styles.content}>
        <Text style={styles.heading}>Home</Text>
        <Text style={styles.body}>Welcome to the app.</Text>
        <Text style={styles.body}>Supabase is connected.</Text>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Supabase</Text>
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isSupabaseConfigured ? theme.colors.success : theme.colors.danger },
              ]}
            />
            <Text style={styles.cardValue}>
              {isSupabaseConfigured ? "Connected" : "Not configured"}
            </Text>
          </View>
          {!isSupabaseConfigured ? (
            <Text style={styles.cardHint}>
              Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to your .env file.
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  heading: {
    fontSize: theme.fontSize.xl,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  body: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textMuted,
  },
  card: {
    marginTop: theme.spacing.lg,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },
  cardLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.xs,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  cardValue: {
    fontSize: theme.fontSize.md,
    fontWeight: "600",
    color: theme.colors.text,
  },
  cardHint: {
    marginTop: theme.spacing.sm,
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
  },
});
