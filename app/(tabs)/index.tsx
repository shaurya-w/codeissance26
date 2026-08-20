import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Header } from "@/components/Header";
import { TaxDeadlineBanner } from "@/components/TaxDeadlineBanner";
import { theme } from "@/constants/theme";
import { supabase } from "@/lib/supabase";

export type TaxEstimate = {
  id: string;
  user_id: string | null;
  total_taxable_income: string | number;
  estimated_liability: string | number;
  tds_credits_applied: string | number;
  rag_context_used:
  | {
    regime?: string;
    standard_deduction?: number;
    agricultural_exemption?: string;
    notes?: string;
  }
  | string;
  calculated_at: string;
};

const DEFAULT_USER_ID = "97fc9b68-f8b6-497f-8dc4-a6829af235f7";

function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

// Safely parse single or double-stringified JSON objects from Supabase
const parseRagContext = (rawContext: any) => {
  if (!rawContext) return {};
  let context = rawContext;

  while (typeof context === "string") {
    try {
      context = JSON.parse(context);
    } catch {
      break;
    }
  }
  return context;
};

export default function HomeScreen() {
  const [estimate, setEstimate] = useState<TaxEstimate | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchLatestTaxEstimate();
  }, []);

  const fetchLatestTaxEstimate = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("tax_estimates")
        .select("*")
        .eq("user_id", DEFAULT_USER_ID)
        .order("calculated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Error fetching tax estimate:", error.message, error.details);
      } else {
        setEstimate(data as TaxEstimate | null);
      }
    } catch (err) {
      console.error("Failed to load tax estimate:", err);
    } finally {
      setLoading(false);
    }
  };

  // Safe number conversions for numeric database strings
  const grossIncome = estimate?.total_taxable_income
    ? parseFloat(String(estimate.total_taxable_income))
    : 0;
  const grossLiability = estimate?.estimated_liability
    ? parseFloat(String(estimate.estimated_liability))
    : 0;
  const tdsCredits = estimate?.tds_credits_applied
    ? parseFloat(String(estimate.tds_credits_applied))
    : 0;
  const netPayable = Math.max(0, grossLiability - tdsCredits);

  // Parse rag_context_used safely
  const ragContext = parseRagContext(estimate?.rag_context_used);

  const liabilityPercent =
    grossIncome > 0 ? (grossLiability / grossIncome) * 100 : 0;
  const tdsPercent =
    grossLiability > 0 ? (tdsCredits / grossLiability) * 100 : 0;

  return (
    <View style={styles.container}>
      <Header
        eyebrow="Financial Intelligence"
        title="Dashboard"
        subtitle="Tax estimates & real-time liabilities"
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <TaxDeadlineBanner />

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={theme.colors.brandGreen} />
          </View>
        ) : estimate ? (
          <>
            {/* Visual Tax Metric Bar Chart */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.eyebrow}>TAX METRICS SUMMARY</Text>
                <Text style={styles.dateLabel}>
                  {formatDate(estimate.calculated_at)}
                </Text>
              </View>

              {/* Net Tax Hero Value */}
              <View style={styles.heroRow}>
                <View>
                  <Text style={styles.subtext}>Estimated Net Payable</Text>
                  <Text style={styles.netAmount}>{formatCurrency(netPayable)}</Text>
                </View>
                <View style={styles.regimeBadge}>
                  <Text style={styles.regimeBadgeText}>
                    {ragContext?.regime || "New Tax Regime"}
                  </Text>
                </View>
              </View>

              <View style={styles.dashedDivider} />

              {/* Visual Bar Graph */}
              <Text style={styles.sectionLabel}>Liability vs. Income Scale</Text>

              {/* Taxable Income Bar */}
              <View style={styles.barContainer}>
                <View style={styles.barLabelRow}>
                  <Text style={styles.barLabel}>Taxable Income</Text>
                  <Text style={styles.barValue}>{formatCurrency(grossIncome)}</Text>
                </View>
                <View style={styles.track}>
                  <View
                    style={[
                      styles.fill,
                      { width: "100%", backgroundColor: theme.colors.brandGreen },
                    ]}
                  />
                </View>
              </View>

              {/* Estimated Liability Bar */}
              <View style={styles.barContainer}>
                <View style={styles.barLabelRow}>
                  <Text style={styles.barLabel}>Gross Liability</Text>
                  <Text style={styles.barValue}>{formatCurrency(grossLiability)}</Text>
                </View>
                <View style={styles.track}>
                  <View
                    style={[
                      styles.fill,
                      {
                        width: `${Math.min(100, Math.max(12, liabilityPercent * 2.5))}%`,
                        backgroundColor: theme.colors.danger,
                      },
                    ]}
                  />
                </View>
              </View>

              {/* TDS Credits Bar */}
              <View style={styles.barContainer}>
                <View style={styles.barLabelRow}>
                  <Text style={styles.barLabel}>TDS Credits Offset</Text>
                  <Text style={styles.barValue}>-{formatCurrency(tdsCredits)}</Text>
                </View>
                <View style={styles.track}>
                  <View
                    style={[
                      styles.fill,
                      {
                        width: `${Math.min(100, Math.max(10, tdsPercent))}%`,
                        backgroundColor: theme.colors.warning,
                      },
                    ]}
                  />
                </View>
              </View>
            </View>

            {/* Detailed Breakdown Card */}
            <View style={styles.card}>
              <Text style={styles.eyebrow}>TAX BREAKDOWN DETAILS</Text>

              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Total Taxable Income</Text>
                <Text style={styles.breakdownValue}>{formatCurrency(grossIncome)}</Text>
              </View>

              <View style={styles.dashedDivider} />

              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Estimated Tax Liability</Text>
                <Text style={[styles.breakdownValue, { color: theme.colors.danger }]}>
                  {formatCurrency(grossLiability)}
                </Text>
              </View>

              <View style={styles.dashedDivider} />

              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>TDS Credits Applied</Text>
                <Text style={[styles.breakdownValue, { color: theme.colors.warning }]}>
                  -{formatCurrency(tdsCredits)}
                </Text>
              </View>

              <View style={styles.dashedDivider} />

              <View style={styles.breakdownRow}>
                <Text style={styles.boldLabel}>Net Outstanding Liability</Text>
                <Text style={styles.boldValue}>{formatCurrency(netPayable)}</Text>
              </View>

              {ragContext?.notes && (
                <View style={styles.notesBox}>
                  <Text style={styles.notesTitle}>AI Reasoning & Context</Text>
                  <Text style={styles.notesText}>{ragContext.notes}</Text>
                </View>
              )}
            </View>
          </>
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
  loadingContainer: {
    paddingVertical: theme.spacing.xl,
    alignItems: "center",
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.card,
    padding: theme.spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
    gap: theme.spacing.sm,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  eyebrow: {
    fontSize: theme.typography.eyebrow.fontSize,
    fontWeight: theme.typography.eyebrow.fontWeight,
    letterSpacing: theme.typography.eyebrow.letterSpacing,
    color: theme.colors.mutedSage.muted1,
  },
  dateLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.mutedSage.muted3,
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: theme.spacing.xs,
  },
  subtext: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedSage.muted1,
  },
  netAmount: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.typography.fontWeights.black,
    color: theme.colors.ink,
    fontFamily: theme.typography.fontMono,
  },
  regimeBadge: {
    backgroundColor: theme.colors.surfaceSubtle,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  regimeBadgeText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.brandGreen,
  },
  dashedDivider: {
    height: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: "dashed",
    marginVertical: theme.spacing.xs,
  },
  sectionLabel: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.ink,
  },
  barContainer: {
    gap: theme.spacing.xxs,
  },
  barLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  barLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.mutedSage.muted1,
  },
  barValue: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.typography.fontWeights.bold,
    fontFamily: theme.typography.fontMono,
    color: theme.colors.ink,
  },
  track: {
    height: 8,
    width: "100%",
    backgroundColor: theme.colors.surfaceSubtle,
    borderRadius: theme.radius.full,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: theme.radius.full,
  },
  breakdownRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  breakdownLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedSage.muted1,
  },
  breakdownValue: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.typography.fontWeights.bold,
    fontFamily: theme.typography.fontMono,
    color: theme.colors.ink,
  },
  boldLabel: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.ink,
  },
  boldValue: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.typography.fontWeights.black,
    fontFamily: theme.typography.fontMono,
    color: theme.colors.ink,
  },
  notesBox: {
    marginTop: theme.spacing.xs,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.surfaceSubtle,
    borderRadius: theme.radius.sm,
    gap: theme.spacing.xxs,
  },
  notesTitle: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.brandGreen,
  },
  notesText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.mutedSage.muted1,
    lineHeight: 16,
  },
});