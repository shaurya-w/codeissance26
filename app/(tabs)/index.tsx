import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Header } from "@/components/Header";
import { theme } from "@/constants/theme";
import { isSupabaseConfigured } from "@/lib/supabase";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Header
        eyebrow="Water Intelligence"
        title="Dashboard"
        subtitle="Crop & water consumption analytics"
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Display Headline */}
        <View style={styles.heroSection}>
          <Text style={styles.heroEyebrow}>SYSTEM OVERVIEW</Text>
          <Text style={styles.heroHeadline}>Water</Text>
          <Text style={styles.heroHeadlineAccent}>Footprint</Text>
          <Text style={styles.heroSub}>
            Real-time agricultural telemetry & origin impact estimation.
          </Text>
        </View>

        {/* Data Card Motif: Large font-mono metric card */}
        <View style={styles.dataCard}>
          <View style={styles.dataCardHeader}>
            <Text style={styles.microLabel}>ESTIMATED INTENSITY</Text>
            <View
              style={[
                styles.badge,
                { backgroundColor: theme.colors.waterIntensity.low.background },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  { color: theme.colors.waterIntensity.low.text },
                ]}
              >
                LOW INTENSITY
              </Text>
            </View>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.monoMetric}>1,420</Text>
            <Text style={styles.monoUnit}>L / kg</Text>
          </View>
          <Text style={styles.contextText}>
            Current origin estimate is 14% below regional benchmark.
          </Text>
          <View style={styles.dashedDivider} />
          <View style={styles.benchmarkRow}>
            <View style={styles.benchmarkItem}>
              <Text style={styles.microLabel}>INDIA AVERAGE</Text>
              <Text style={[styles.benchmarkValue, { color: theme.colors.indiaAverage }]}>
                1,650 L/kg
              </Text>
            </View>
            <View
              style={[
                styles.avgBadge,
                { backgroundColor: theme.colors.belowAverage.background },
              ]}
            >
              <Text
                style={[
                  styles.avgBadgeText,
                  { color: theme.colors.belowAverage.text },
                ]}
              >
                BELOW AVG
              </Text>
            </View>
          </View>
        </View>

        {/* Supabase Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusCardHeader}>
            <Text style={styles.microLabel}>SUPABASE DATABASE</Text>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: isSupabaseConfigured
                    ? theme.colors.waterIntensity.low.text
                    : theme.colors.waterIntensity.high.text,
                },
              ]}
            />
          </View>
          <Text style={styles.statusValue}>
            {isSupabaseConfigured ? "Connected & Active" : "Configuration Required"}
          </Text>
          <Text style={styles.statusHint}>
            {isSupabaseConfigured
              ? "Real-time edge telemetry synchronized."
              : "Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to .env"}
          </Text>
        </View>

        {/* Water Intensity Badge Tokens Preview */}
        <View style={styles.badgesSection}>
          <Text style={styles.sectionTitle}>Intensity Scale</Text>
          <View style={styles.badgesRow}>
            <View
              style={[
                styles.badge,
                { backgroundColor: theme.colors.waterIntensity.low.background },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  { color: theme.colors.waterIntensity.low.text },
                ]}
              >
                LOW
              </Text>
            </View>
            <View
              style={[
                styles.badge,
                { backgroundColor: theme.colors.waterIntensity.medium.background },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  { color: theme.colors.waterIntensity.medium.text },
                ]}
              >
                MEDIUM
              </Text>
            </View>
            <View
              style={[
                styles.badge,
                { backgroundColor: theme.colors.waterIntensity.high.background },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  { color: theme.colors.waterIntensity.high.text },
                ]}
              >
                HIGH
              </Text>
            </View>
          </View>
        </View>

        {/* Food Swatches Preview */}
        <View style={styles.swatchesSection}>
          <Text style={styles.sectionTitle}>Food Palette Swatches</Text>
          <View style={styles.swatchesGrid}>
            {theme.colors.foodSwatches.map((color, index) => (
              <View
                key={index}
                style={[
                  styles.swatchItem,
                  { backgroundColor: color },
                ]}
              >
                <Text style={styles.swatchIndex}>{index + 1}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.pageBg,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.md,
    gap: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  heroSection: {
    marginTop: theme.spacing.xs,
    gap: theme.spacing.xxs,
  },
  heroEyebrow: {
    fontSize: theme.typography.eyebrow.fontSize,
    fontWeight: theme.typography.eyebrow.fontWeight,
    letterSpacing: theme.typography.eyebrow.letterSpacing,
    textTransform: theme.typography.eyebrow.textTransform,
    color: theme.colors.brandGreen,
  },
  heroHeadline: {
    fontSize: theme.typography.displayHeadline.fontSize,
    fontWeight: theme.typography.displayHeadline.fontWeight,
    letterSpacing: theme.typography.displayHeadline.letterSpacing,
    lineHeight: theme.typography.displayHeadline.lineHeight,
    color: theme.colors.ink,
  },
  heroHeadlineAccent: {
    fontSize: theme.typography.displayHeadline.fontSize,
    fontWeight: theme.typography.displayHeadline.fontWeight,
    letterSpacing: theme.typography.displayHeadline.letterSpacing,
    lineHeight: theme.typography.displayHeadline.lineHeight,
    color: theme.colors.brandGreen,
  },
  heroSub: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedSage.muted1,
    marginTop: theme.spacing.xs,
  },
  dataCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.card,
    padding: theme.spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
    gap: theme.spacing.sm,
  },
  dataCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  microLabel: {
    fontSize: theme.typography.eyebrow.fontSize,
    fontWeight: theme.typography.eyebrow.fontWeight,
    letterSpacing: theme.typography.eyebrow.letterSpacing,
    textTransform: theme.typography.eyebrow.textTransform,
    color: theme.colors.mutedSage.muted1,
  },
  metricRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  monoMetric: {
    fontFamily: theme.typography.fontMono,
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.typography.fontWeights.black,
    color: theme.colors.ink,
  },
  monoUnit: {
    fontFamily: theme.typography.fontMono,
    fontSize: theme.fontSize.md,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.mutedSage.muted1,
  },
  contextText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedSage.muted2,
  },
  dashedDivider: {
    height: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: "dashed",
    marginVertical: theme.spacing.xs,
  },
  benchmarkRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  benchmarkItem: {
    gap: theme.spacing.xxs,
  },
  benchmarkValue: {
    fontFamily: theme.typography.fontMono,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.typography.fontWeights.bold,
  },
  avgBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.full,
  },
  avgBadgeText: {
    fontSize: theme.fontSize.micro,
    fontWeight: theme.typography.fontWeights.black,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  statusCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.card,
    padding: theme.spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    ...theme.shadows.soft,
    gap: theme.spacing.xs,
  },
  statusCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: theme.radius.full,
  },
  statusValue: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.ink,
  },
  statusHint: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.mutedSage.muted1,
  },
  badgesSection: {
    gap: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.typography.fontWeights.black,
    color: theme.colors.ink,
  },
  badgesRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  badge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.full,
  },
  badgeText: {
    fontSize: theme.typography.eyebrow.fontSize,
    fontWeight: theme.typography.eyebrow.fontWeight,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  swatchesSection: {
    gap: theme.spacing.sm,
  },
  swatchesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.xs,
  },
  swatchItem: {
    width: 38,
    height: 38,
    borderRadius: theme.radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  swatchIndex: {
    fontFamily: theme.typography.fontMono,
    fontSize: theme.fontSize.micro,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.ink,
  },
});

