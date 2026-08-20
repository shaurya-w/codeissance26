import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Header } from "@/components/Header";
import { theme } from "@/constants/theme";
import { useOnboarding } from "@/context/OnboardingContext";

function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  } catch {
    return iso;
  }
}

export default function HomeScreen() {
  const { state } = useOnboarding();
  const { bankFeedResult, gigPayoutResults } = state;

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
        
        {gigPayoutResults && gigPayoutResults.length > 0 ? (
          <View style={styles.dataCard}>
            <View style={styles.dataCardHeader}>
              <Text style={styles.microLabel}>GIG PAYOUTS</Text>
              <Text style={styles.microLabel}>{gigPayoutResults.length} LINKED</Text>
            </View>

            {gigPayoutResults.map((result, index) => (
              <View key={result.data.id}>
                <View style={styles.metricRow}>
                  <Text style={styles.monoMetric}>{formatCurrency(result.data.expected_net)}</Text>
                  <Text style={styles.monoUnit}>net</Text>
                </View>
                <Text style={styles.contextText}>{result.message}</Text>

                <View style={styles.dashedDivider} />

                <View style={styles.benchmarkRow}>
                  <View style={styles.benchmarkItem}>
                    <Text style={styles.microLabel}>GROSS</Text>
                    <Text style={[styles.benchmarkValue, { color: theme.colors.ink }]}>
                      {formatCurrency(result.data.expected_gross)}
                    </Text>
                  </View>
                  <View style={styles.benchmarkItem}>
                    <Text style={styles.microLabel}>PLATFORM FEE</Text>
                    <Text style={[styles.benchmarkValue, { color: theme.colors.danger }]}>
                      -{formatCurrency(result.data.platform_fee)}
                    </Text>
                  </View>
                  <View style={styles.benchmarkItem}>
                    <Text style={styles.microLabel}>TDS</Text>
                    <Text style={[styles.benchmarkValue, { color: theme.colors.warning }]}>
                      -{formatCurrency(result.data.tds_deducted)}
                    </Text>
                  </View>
                </View>

                {index < gigPayoutResults.length - 1 && <View style={styles.dashedDivider} />}
              </View>
            ))}
          </View>
        ) : null}

        {bankFeedResult && bankFeedResult.data.length > 0 ? (
          <View style={styles.dataCard}>
            <View style={styles.dataCardHeader}>
              <Text style={styles.microLabel}>RECENT BANK ACTIVITY</Text>
              <Text style={styles.microLabel}>{bankFeedResult.total_processed} SYNCED</Text>
            </View>

            {bankFeedResult.data.map((txn, index) => {
              const isIncome = txn.type === "INCOME";
              const badgeColors = isIncome
                ? theme.colors.belowAverage
                : theme.colors.aboveAverage;

              return (
                <View key={txn.id}>
                  <View style={styles.benchmarkRow}>
                    <View style={styles.benchmarkItem}>
                      <Text style={styles.contextText}>{formatDate(txn.date)}</Text>
                      <Text style={styles.microLabel}>{txn.category.replace(/_/g, " ")}</Text>
                    </View>
                    <View style={[styles.avgBadge, { backgroundColor: badgeColors.background }]}>
                      <Text
                        style={[
                          styles.avgBadgeText,
                          { color: badgeColors.text },
                        ]}
                      >
                        {isIncome ? "+" : "-"}
                        {formatCurrency(txn.amount)}
                      </Text>
                    </View>
                  </View>
                  {index < bankFeedResult.data.length - 1 && <View style={styles.dashedDivider} />}
                </View>
              );
            })}
          </View>
        ) : null}
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
});
