import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Header } from "@/components/Header";
import { theme } from "@/constants/theme";

export default function ActivityScreen() {
  return (
    <View style={styles.container}>
      <Header
        eyebrow="Activity Feed"
        title="Activity"
        subtitle="Recent scans, approvals & batch estimates"
      />
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardEyebrow}>TELEMETRY LOGS</Text>
          <Text style={styles.cardHeading}>Recent Actions</Text>
          <Text style={styles.body}>
            All receipt OCR scans and high-confidence automatic classifications will appear here.
          </Text>
        </View>
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
});

