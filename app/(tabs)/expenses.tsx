import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  ImageSourcePropType,
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  UIManager,
  View,
} from "react-native";
import { Dimensions } from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronDown,
  Info,
  ReceiptText,
  RefreshCw,
  ShieldCheck,
  Trophy,
} from "lucide-react-native";

import { Header } from "@/components/Header";
import { theme } from "@/constants/theme";
import { supabase } from "@/lib/supabase";

// Enable LayoutAnimation for Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const MOCK_USER_ID = "97fc9b68-f8b6-497f-8dc4-a6829af235f7";

type TransactionType = "INCOME" | "EXPENSE";

type TransactionCategory =
  | "PERSONAL_TRANSFERS"
  | "FOOD_AND_DINING"
  | "SHOPPING"
  | "TRAVEL_AND_TRANSPORT"
  | "UTILITIES_TELECOM"
  | "PROFESSIONAL_SERVICES"
  | "SOFTWARE_SUBSCRIPTIONS"
  | "OFFICE_BUSINESS_SUPPLIES"
  | "RENT_WORKSPACE"
  | "EDUCATION_TRAINING"
  | "MARKETING_ADVERTISING"
  | "BANKING_FINANCIAL_CHARGES"
  | "INSURANCE"
  | "HEALTHCARE_MEDICAL"
  | "OTHER";

type TaxMetadata = {
  amount?: number;
  source?: string;
  category?: string;
  conditions?: string;
  tax_regime?: string;
  explanation?: string;
  [key: string]: unknown;
};

type Transaction = {
  id: string;
  user_id: string | null;
  type: TransactionType;
  amount: number;
  date: string | null;
  category: TransactionCategory;
  is_tax_deductible: boolean | null;
  source_type: string;
  source_ref: string | null;
  tax_rule_applied: string | null;
  created_at: string | null;
  tax_metadata: TaxMetadata | null;
};

// ---------------------------------------------------------------------------
// Gig Platform Icons & Matcher Map
// ---------------------------------------------------------------------------

const PLATFORM_ICONS: Record<string, ImageSourcePropType> = {
  SWIGGY: require("@/assets/SWIGGY.jpeg"),
  ZOMATO: require("@/assets/ZOMATO.jpeg"),
  UBER: require("@/assets/UBER.jpeg"),
  OLA: require("@/assets/OLA.jpeg"),
  BLINKIT: require("@/assets/BLINKIT.jpeg"),
  ZEPTO: require("@/assets/ZEPTO.jpeg"),
  FIVERR: require("@/assets/FIVERR.jpeg"),
  HDFC: require("@/assets/HDFC.jpeg"),
  ICICI: require("@/assets/ICICI.jpeg"),
  SBI: require("@/assets/SBI.jpeg"),
  AXIS: require("@/assets/AXIS.jpeg"),
  BOB: require("@/assets/BOB.jpeg"),
  OTHER: require("@/assets/OTHER.png")
};

// Returns matching asset icon key based on transaction text or source
const identifyPlatform = (transaction: Transaction): string => {
  const searchable = `${transaction.source_ref || ""} ${transaction.source_type || ""} ${transaction.tax_metadata?.source || ""}`.toUpperCase();

  if (searchable.includes("SWIGGY")) return "SWIGGY";
  if (searchable.includes("ZOMATO")) return "ZOMATO";
  if (searchable.includes("UBER")) return "UBER";
  if (searchable.includes("OLA")) return "OLA";
  if (searchable.includes("BLINKIT")) return "BLINKIT";
  if (searchable.includes("ZEPTO")) return "ZEPTO";
  if (searchable.includes("FIVERR")) return "FIVERR";
  if (searchable.includes("HDFC")) return "HDFC";
  if (searchable.includes("ICICI")) return "ICICI";
  if (searchable.includes("SBI")) return "SBI";
  if (searchable.includes("AXIS")) return "AXIS";
  if (searchable.includes("BOB")) return "BOB";

  return "OTHER";
};

const CATEGORY_LABELS: Record<TransactionCategory, string> = {
  PERSONAL_TRANSFERS: "Personal Transfers",
  FOOD_AND_DINING: "Food & Dining",
  SHOPPING: "Shopping",
  TRAVEL_AND_TRANSPORT: "Travel & Transport",
  UTILITIES_TELECOM: "Utilities & Telecom",
  PROFESSIONAL_SERVICES: "Professional Services",
  SOFTWARE_SUBSCRIPTIONS: "Software Subscriptions",
  OFFICE_BUSINESS_SUPPLIES: "Office & Business Supplies",
  RENT_WORKSPACE: "Rent & Workspace",
  EDUCATION_TRAINING: "Education & Training",
  MARKETING_ADVERTISING: "Marketing & Advertising",
  BANKING_FINANCIAL_CHARGES: "Banking & Financial Charges",
  INSURANCE: "Insurance",
  HEALTHCARE_MEDICAL: "Healthcare & Medical",
  OTHER: "Other",
};

const CATEGORY_COLOR_MAP: Record<TransactionCategory, string> = {
  FOOD_AND_DINING: "#FF8A3D",
  RENT_WORKSPACE: "#2FAE60",
  PERSONAL_TRANSFERS: "#8B5CF6",
  SHOPPING: "#F2B85C",
  TRAVEL_AND_TRANSPORT: "#3E9CFF",
  UTILITIES_TELECOM: "#22C1B5",
  PROFESSIONAL_SERVICES: "#5B6FE0",
  SOFTWARE_SUBSCRIPTIONS: "#37C6E8",
  OFFICE_BUSINESS_SUPPLIES: "#E0A63E",
  EDUCATION_TRAINING: "#F4D35E",
  MARKETING_ADVERTISING: "#F2545B",
  BANKING_FINANCIAL_CHARGES: "#7C8798",
  INSURANCE: "#3DBE8B",
  HEALTHCARE_MEDICAL: "#F26E9E",
  OTHER: "#B7B7AE",
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (date: string | null) => {
  if (!date) return "No date";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

const formatCategory = (category: TransactionCategory) => {
  return CATEGORY_LABELS[category] ?? category;
};

const categoryColor = (category: TransactionCategory) => {
  return CATEGORY_COLOR_MAP[category] ?? CATEGORY_COLOR_MAP.OTHER;
};

// ---------------------------------------------------------------------------
// Date range filters
// ---------------------------------------------------------------------------

type FilterKey = "15d" | "30d" | "month" | "3m" | "all";

const FILTER_OPTIONS: { key: FilterKey; label: string }[] = [
  { key: "15d", label: "15 Days" },
  { key: "30d", label: "30 Days" },
  { key: "month", label: "This Month" },
  { key: "3m", label: "3 Months" },
  { key: "all", label: "All Time" },
];

const isWithinFilter = (dateStr: string | null, filter: FilterKey) => {
  if (filter === "all") return true;
  if (!dateStr) return false;

  const date = new Date(dateStr);
  const now = new Date();

  if (filter === "month") {
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth()
    );
  }

  const daysMap: Record<Exclude<FilterKey, "all" | "month">, number> = {
    "15d": 15,
    "30d": 30,
    "3m": 90,
  };

  const days = daysMap[filter as "15d" | "30d" | "3m"];
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  return date >= cutoff;
};

// ---------------------------------------------------------------------------
// Donut chart geometry helpers
// ---------------------------------------------------------------------------

const polarToCartesian = (
  cx: number,
  cy: number,
  r: number,
  angleDeg: number
) => {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};

const describeArc = (
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
) => {
  const clampedEnd = Math.min(endAngle, startAngle + 359.9);
  const start = polarToCartesian(cx, cy, r, clampedEnd);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = clampedEnd - startAngle <= 180 ? "0" : "1";

  return [
    "M",
    start.x,
    start.y,
    "A",
    r,
    r,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(" ");
};

type DonutDatum = {
  name: string;
  amount: number;
  color: string;
};

type DonutChartProps = {
  data: DonutDatum[];
  total: number;
  size?: number;
  strokeWidth?: number;
};

const GAP_DEGREES = 3;

function DonutChart({
  data,
  total,
  size = 232,
  strokeWidth = 30,
}: DonutChartProps) {
  const progress = useRef(new Animated.Value(0)).current;
  const [renderedProgress, setRenderedProgress] = useState(0);
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    progress.setValue(0);
    fade.setValue(0);

    const listenerId = progress.addListener(({ value }) => {
      setRenderedProgress(value);
    });

    Animated.sequence([
      Animated.timing(fade, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(progress, {
        toValue: 1,
        duration: 950,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start();

    return () => {
      progress.removeListener(listenerId);
    };
  }, [data.map((d) => `${d.name}:${d.amount}`).join("|")]);

  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;

  const segments = useMemo(() => {
    let cursor = 0;

    return data.map((item) => {
      const sweep = total > 0 ? (item.amount / total) * 360 : 0;
      const startAngle = cursor + GAP_DEGREES / 2;
      const endAngle = cursor + sweep - GAP_DEGREES / 2;
      cursor += sweep;

      return {
        ...item,
        startAngle,
        endAngle: Math.max(endAngle, startAngle),
        pct: total > 0 ? item.amount / total : 0,
      };
    });
  }, [data, total]);

  const unlockedAngle = 360 * renderedProgress;

  return (
    <Animated.View style={{ opacity: fade, alignItems: "center" }}>
      <View style={[styles.donutShadowWrap, { width: size, height: size }]}>
        <Svg width={size} height={size}>
          <Circle
            cx={cx}
            cy={cy}
            r={radius}
            stroke={theme.colors.border}
            strokeWidth={strokeWidth}
            fill="none"
            opacity={0.5}
          />

          {segments.map((segment, index) => {
            const start = Math.min(segment.startAngle, unlockedAngle);
            const end = Math.min(segment.endAngle, unlockedAngle);

            if (end - start < 0.6) return null;

            return (
              <Path
                key={`${segment.name}-${index}`}
                d={describeArc(cx, cy, radius, start, end)}
                stroke={segment.color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                fill="none"
              />
            );
          })}
        </Svg>

        <View style={styles.donutCenter} pointerEvents="none">
          <Text style={styles.donutCenterLabel}>Total Spends</Text>
          <Text style={styles.donutCenterValue}>
            {formatCurrency(total)}
          </Text>
        </View>
      </View>

      <View style={styles.legendWrap}>
        {segments.map((segment, index) => (
          <View key={`${segment.name}-legend-${index}`} style={styles.legendItem}>
            <View
              style={[styles.legendDot, { backgroundColor: segment.color }]}
            />
            <Text style={styles.legendLabel} numberOfLines={1}>
              {segment.name}
            </Text>
            <Text style={styles.legendPct}>
              {Math.round(segment.pct * 100)}%
            </Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// Playful loading state
// ---------------------------------------------------------------------------

const LOADING_MESSAGES = [
  "Counting your coins...",
  "Chasing down receipts...",
  "Sorting the spends...",
  "Untangling your wallet...",
];

function DonutLoader() {
  const spin = useRef(new Animated.Value(0)).current;
  const [messageIndex, setMessageIndex] = useState(0);
  const messageFade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1100,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(messageFade, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(messageFade, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 1400);

    return () => clearInterval(interval);
  }, []);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.loadingContainer}>
      <Animated.View style={{ transform: [{ rotate }] }}>
        <Svg width={72} height={72}>
          <Circle
            cx={36}
            cy={36}
            r={30}
            stroke={theme.colors.border}
            strokeWidth={8}
            fill="none"
          />
          <Path
            d={describeArc(36, 36, 30, 0, 110)}
            stroke="#FF8A3D"
            strokeWidth={8}
            strokeLinecap="round"
            fill="none"
          />
        </Svg>
      </Animated.View>

      <Animated.Text style={[styles.loadingText, { opacity: messageFade }]}>
        {LOADING_MESSAGES[messageIndex]}
      </Animated.Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Single Transaction Item Component
// ---------------------------------------------------------------------------

function TransactionCardItem({ transaction }: { transaction: Transaction }) {
  const [expanded, setExpanded] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const isExpense = transaction.type === "EXPENSE";
  const badgeColor = categoryColor(transaction.category);
  const title =
    transaction.source_ref?.trim() || formatCategory(transaction.category);

  const isDeductible = transaction.is_tax_deductible === true;
  const explanation = transaction.tax_metadata?.explanation;

  const toggleExpand = () => {
    if (!isDeductible) return;

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);

    Animated.timing(rotateAnim, {
      toValue: expanded ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const chevronRotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <Pressable
      onPress={toggleExpand}
      disabled={!isDeductible}
      style={({ pressed }) => [
        styles.transactionCard,
        isDeductible && styles.transactionCardDeductible,
        expanded && styles.transactionCardExpanded,
        pressed && isDeductible && styles.transactionCardPressed,
      ]}
    >
      <View style={styles.transactionHeaderRow}>
        <View
          style={[
            styles.transactionIcon,
            isExpense ? styles.expenseIcon : styles.incomeIcon,
          ]}
        >
          {isExpense ? (
            <ArrowDownLeft
              size={18}
              color={theme.colors.onboarding.feedback.errorText}
            />
          ) : (
            <ArrowUpRight size={18} color={theme.colors.ink} />
          )}
        </View>

        <View style={styles.transactionMain}>
          <Text style={styles.transactionTitle} numberOfLines={1}>
            {title}
          </Text>

          <View style={styles.transactionMetaRow}>
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: `${badgeColor}22` },
              ]}
            >
              <View
                style={[
                  styles.categoryBadgeDot,
                  { backgroundColor: badgeColor },
                ]}
              />
              <Text
                style={[
                  styles.categoryBadgeText,
                  { color: badgeColor },
                ]}
                numberOfLines={1}
              >
                {formatCategory(transaction.category)}
              </Text>
            </View>

            <Text style={styles.transactionMeta}>
              {formatDate(transaction.date)}
            </Text>
          </View>
        </View>

        <View style={styles.transactionAmountContainer}>
          <Text
            style={[
              styles.transactionAmount,
              isExpense ? styles.expenseAmount : styles.incomeAmount,
            ]}
          >
            {isExpense ? "-" : "+"}
            {formatCurrency(Number(transaction.amount))}
          </Text>

          {isDeductible && (
            <View style={styles.taxBadgeContainer}>
              <View style={styles.taxPill}>
                <ShieldCheck size={10} color="#2FAE60" style={styles.taxPillIcon} />
                <Text style={styles.taxLabel}>Tax deductible</Text>
              </View>
              <Animated.View style={{ transform: [{ rotate: chevronRotate }] }}>
                <ChevronDown size={12} color={theme.colors.mutedSage.muted1} />
              </Animated.View>
            </View>
          )}
        </View>
      </View>

      {/* Expanded Tax Explanation Card */}
      {isDeductible && expanded && (
        <View style={styles.explanationCard}>
          <View style={styles.explanationHeader}>
            <View style={styles.explanationTitleRow}>
              <Info size={14} color="#2FAE60" />
              <Text style={styles.explanationTitle}>Tax Savings Breakdown</Text>
            </View>
            {transaction.tax_rule_applied ? (
              <View style={styles.ruleBadge}>
                <Text style={styles.ruleBadgeText}>
                  {transaction.tax_rule_applied}
                </Text>
              </View>
            ) : null}
          </View>

          <Text style={styles.explanationText}>
            {explanation || "This transaction is eligible for a tax deduction."}
          </Text>

          {transaction.tax_metadata?.tax_regime && (
            <View style={styles.metadataFooterRow}>
              <Text style={styles.metadataFooterTag}>
                Regime:{" "}
                <Text style={styles.metadataFooterValue}>
                  {String(transaction.tax_metadata.tax_regime)}
                </Text>
              </Text>
              {transaction.tax_metadata?.source && (
                <Text style={styles.metadataFooterTag}>
                  Source:{" "}
                  <Text style={styles.metadataFooterValue}>
                    {String(transaction.tax_metadata.source)}
                  </Text>
                </Text>
              )}
            </View>
          )}
        </View>
      )}
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Expandable Platform Accordion Component
// ---------------------------------------------------------------------------

type PlatformGroup = {
  platformKey: string;
  transactions: Transaction[];
  income: number;
  expenses: number;
  netProfit: number;
};

function PlatformAccordionGroup({ group }: { group: PlatformGroup }) {
  const [isOpen, setIsOpen] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const toggleGroup = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen((prev) => !prev);

    Animated.timing(rotateAnim, {
      toValue: isOpen ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const chevronRotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const iconSource = PLATFORM_ICONS[group.platformKey];

  return (
    <View style={styles.platformCardGroup}>
      <Pressable onPress={toggleGroup} style={styles.platformHeader}>
        <View style={styles.platformIconWrap}>
          {iconSource ? (
            <Image source={iconSource} style={styles.platformLogo} />
          ) : (
            <View style={styles.fallbackIcon}>
              <Text style={styles.fallbackIconText}>
                {group.platformKey.substring(0, 2)}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.platformMeta}>
          <Text style={styles.platformTitle}>{group.platformKey}</Text>
          <Text style={styles.platformSubtext}>
            {group.transactions.length} transaction{group.transactions.length > 1 ? "s" : ""}
          </Text>
        </View>

        <View style={styles.platformProfitCol}>
          <Text
            style={[
              styles.platformProfitVal,
              group.netProfit >= 0 ? styles.positiveNet : styles.negativeNet,
            ]}
          >
            {group.netProfit >= 0 ? "+" : ""}
            {formatCurrency(group.netProfit)}
          </Text>
          <Text style={styles.platformProfitLabel}>Net Earnings</Text>
        </View>

        <Animated.View style={{ transform: [{ rotate: chevronRotate }], marginLeft: 8 }}>
          <ChevronDown size={18} color={theme.colors.mutedSage.muted1} />
        </Animated.View>
      </Pressable>

      {isOpen && (
        <View style={styles.platformBody}>
          {group.transactions.map((t) => (
            <TransactionCardItem key={t.id} transaction={t} />
          ))}
        </View>
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Main Screen
// ---------------------------------------------------------------------------

export default function ExpensesScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterKey>("30d");

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: queryError } = await supabase
        .from("transactions")
        .select(`
          id,
          user_id,
          type,
          amount,
          date,
          category,
          is_tax_deductible,
          source_type,
          source_ref,
          tax_rule_applied,
          created_at,
          tax_metadata
        `)
        .eq("user_id", MOCK_USER_ID)
        .order("date", { ascending: false })
        .limit(50);

      if (queryError) {
        throw queryError;
      }

      setTransactions((data ?? []) as Transaction[]);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);

      setError(
        err instanceof Error ? err.message : "Unable to load transactions."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTransactions();
  };

  const filteredTransactions = useMemo(
    () =>
      transactions.filter((transaction) =>
        isWithinFilter(transaction.date, activeFilter)
      ),
    [transactions, activeFilter]
  );

  const expenseTransactions = useMemo(
    () =>
      filteredTransactions.filter(
        (transaction) => transaction.type === "EXPENSE"
      ),
    [filteredTransactions]
  );

  const totalExpenses = useMemo(
    () =>
      expenseTransactions.reduce(
        (total, transaction) => total + Number(transaction.amount),
        0
      ),
    [expenseTransactions]
  );

  const totalIncome = useMemo(
    () =>
      filteredTransactions
        .filter((transaction) => transaction.type === "INCOME")
        .reduce(
          (total, transaction) => total + Number(transaction.amount),
          0
        ),
    [filteredTransactions]
  );

  // Group transactions by platform/gig source
  const platformGroups = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};

    filteredTransactions.forEach((t) => {
      const platform = identifyPlatform(t);
      if (!groups[platform]) groups[platform] = [];
      groups[platform].push(t);
    });

    return Object.entries(groups).map(([platformKey, txList]) => {
      let income = 0;
      let expenses = 0;

      txList.forEach((t) => {
        if (t.type === "INCOME") income += Number(t.amount);
        else expenses += Number(t.amount);
      });

      return {
        platformKey,
        transactions: txList,
        income,
        expenses,
        netProfit: income - expenses,
      };
    }).sort((a, b) => b.netProfit - a.netProfit);
  }, [filteredTransactions]);

  // Identify highest profit platform
  const maxProfitPlatform = useMemo(() => {
    if (platformGroups.length === 0) return null;
    const top = platformGroups[0];
    return top.netProfit > 0 ? top : null;
  }, [platformGroups]);

  const categoryTotals = useMemo(() => {
    const totals = new Map<TransactionCategory, number>();

    expenseTransactions.forEach((transaction) => {
      const current = totals.get(transaction.category) ?? 0;
      totals.set(transaction.category, current + Number(transaction.amount));
    });

    return Array.from(totals.entries())
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenseTransactions]);

  const donutData: DonutDatum[] = useMemo(() => {
    if (categoryTotals.length === 0) return [];

    const topCategories = categoryTotals.slice(0, 6);
    const remaining = categoryTotals
      .slice(6)
      .reduce((sum, item) => sum + item.amount, 0);

    const data = topCategories.map((item) => ({
      name: formatCategory(item.category),
      amount: item.amount,
      color: categoryColor(item.category),
    }));

    if (remaining > 0) {
      data.push({
        name: "Other",
        amount: remaining,
        color: CATEGORY_COLOR_MAP.OTHER,
      });
    }

    return data;
  }, [categoryTotals]);

  return (
    <View style={styles.screen}>
      <Header
        eyebrow="Money Intelligence"
        title="Expenses"
        subtitle="Track where your money is going"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <DonutLoader />
        ) : error ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>Couldn't load expenses</Text>
            <Text style={styles.errorText}>{error}</Text>

            <Pressable onPress={fetchTransactions} style={styles.retryButton}>
              <RefreshCw size={17} color={theme.colors.pageBg} />
              <Text style={styles.retryText}>Try again</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {/* Top Earner / Max Profit Banner */}
            {maxProfitPlatform && (
              <View style={styles.topPlatformCard}>
                <View style={styles.topPlatformHeader}>
                  <View style={styles.trophyIconWrap}>
                    <Trophy size={16} color="#E5A93C" />
                  </View>
                  <Text style={styles.topPlatformBadge}>HIGHEST PROFIT PLATFORM</Text>
                </View>

                <View style={styles.topPlatformContent}>
                  <View style={styles.topPlatformMeta}>
                    {PLATFORM_ICONS[maxProfitPlatform.platformKey] ? (
                      <Image
                        source={PLATFORM_ICONS[maxProfitPlatform.platformKey]}
                        style={styles.topPlatformLogo}
                      />
                    ) : null}
                    <Text style={styles.topPlatformName}>
                      {maxProfitPlatform.platformKey}
                    </Text>
                  </View>

                  <View style={styles.topPlatformValCol}>
                    <Text style={styles.topPlatformValue}>
                      +{formatCurrency(maxProfitPlatform.netProfit)}
                    </Text>
                    <Text style={styles.topPlatformSub}>Net Income</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Summary */}
            <View style={styles.summaryRow}>
              <View style={styles.summaryCard}>
                <View style={styles.summaryIcon}>
                  <ArrowDownLeft
                    size={18}
                    color={theme.colors.onboarding.feedback.errorText}
                  />
                </View>
                <Text style={styles.summaryLabel}>Total expenses</Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(totalExpenses)}
                </Text>
              </View>

              <View style={styles.summaryCard}>
                <View style={styles.summaryIconIncome}>
                  <ArrowUpRight size={18} color={theme.colors.ink} />
                </View>
                <Text style={styles.summaryLabel}>Total income</Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(totalIncome)}
                </Text>
              </View>
            </View>

            {/* Expense breakdown */}
            <View style={styles.chartCard}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionEyebrow}>SPENDING BREAKDOWN</Text>
                  <Text style={styles.sectionTitle}>Where your money goes</Text>
                </View>

                <View style={styles.expenseCount}>
                  <Text style={styles.expenseCountText}>
                    {expenseTransactions.length}
                  </Text>
                  <Text style={styles.expenseCountLabel}>expenses</Text>
                </View>
              </View>

              {donutData.length > 0 ? (
                <DonutChart data={donutData} total={totalExpenses} />
              ) : (
                <View style={styles.emptyChart}>
                  <ReceiptText size={34} color={theme.colors.mutedSage.muted1} />
                  <Text style={styles.emptyChartTitle}>No expenses yet</Text>
                  <Text style={styles.emptyChartText}>
                    Expense categories will appear here once transactions are added.
                  </Text>
                </View>
              )}
            </View>

            {/* Filters */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterRow}
            >
              {FILTER_OPTIONS.map((option) => {
                const isActive = option.key === activeFilter;

                return (
                  <Pressable
                    key={option.key}
                    onPress={() => setActiveFilter(option.key)}
                    style={[
                      styles.filterChip,
                      isActive && styles.filterChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        isActive && styles.filterChipTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Gig Platforms & Activity */}
            <View style={styles.transactionsSection}>
              <View style={styles.transactionsHeader}>
                <View>
                  <Text style={styles.sectionEyebrow}>PLATFORMS & ACTIVITY</Text>
                  <Text style={styles.sectionTitle}>Transactions by Platform</Text>
                </View>

                <Pressable
                  onPress={handleRefresh}
                  disabled={refreshing}
                  style={({ pressed }) => [
                    styles.refreshButton,
                    pressed && styles.refreshButtonPressed,
                  ]}
                >
                  {refreshing ? (
                    <ReceiptText size={17} color={theme.colors.ink} />
                  ) : (
                    <RefreshCw size={17} color={theme.colors.ink} />
                  )}
                </Pressable>
              </View>

              {platformGroups.length === 0 ? (
                <View style={styles.emptyTransactions}>
                  <ReceiptText size={34} color={theme.colors.mutedSage.muted1} />
                  <Text style={styles.emptyTransactionsTitle}>
                    No transactions
                  </Text>
                  <Text style={styles.emptyTransactionsText}>
                    Nothing in this date range yet — try a wider filter.
                  </Text>
                </View>
              ) : (
                <View style={styles.platformListContainer}>
                  {platformGroups.map((group) => (
                    <PlatformAccordionGroup
                      key={group.platformKey}
                      group={group}
                    />
                  ))}
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.pageBg,
  },

  content: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: 40,
  },

  // Loading & Error States
  loadingContainer: {
    minHeight: 300,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.mutedSage.muted1,
  },
  errorCard: {
    padding: theme.spacing.lg,
    borderRadius: 22,
    backgroundColor: theme.colors.pageBg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: theme.colors.ink,
  },
  errorText: {
    marginTop: 6,
    fontSize: 12,
    color: theme.colors.mutedSage.muted1,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: theme.colors.ink,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  retryText: {
    color: theme.colors.pageBg,
    fontSize: 12,
    fontWeight: "800",
  },

  // Top Platform Highlight Card
  topPlatformCard: {
    padding: theme.spacing.md,
    borderRadius: 20,
    backgroundColor: "#FEF8EC",
    borderWidth: 1,
    borderColor: "#F3E2C4",
    marginBottom: theme.spacing.md,
  },
  topPlatformHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  trophyIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFF2D6",
    alignItems: "center",
    justifyContent: "center",
  },
  topPlatformBadge: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
    color: "#B67B16",
  },
  topPlatformContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topPlatformMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  topPlatformLogo: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  topPlatformName: {
    fontSize: 16,
    fontWeight: "900",
    color: theme.colors.ink,
  },
  topPlatformValCol: {
    alignItems: "flex-end",
  },
  topPlatformValue: {
    fontSize: 16,
    fontWeight: "900",
    color: "#2FAE60",
  },
  topPlatformSub: {
    fontSize: 10,
    color: theme.colors.mutedSage.muted1,
  },

  // Filters
  filterRow: {
    gap: theme.spacing.xs,
    paddingBottom: theme.spacing.md,
  },

  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: theme.colors.pageBg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  filterChipActive: {
    backgroundColor: theme.colors.ink,
    borderColor: theme.colors.ink,
  },

  filterChipText: {
    fontSize: 12,
    fontWeight: "800",
    color: theme.colors.mutedSage.muted1,
  },

  filterChipTextActive: {
    color: theme.colors.pageBg,
  },

  summaryRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },

  summaryCard: {
    flex: 1,
    minHeight: 110,
    padding: theme.spacing.md,
    borderRadius: 22,
    backgroundColor: theme.colors.pageBg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  summaryIcon: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 17,
    backgroundColor: theme.colors.onboarding.feedback.errorBackground,
    marginBottom: theme.spacing.xs,
  },

  summaryIconIncome: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 17,
    backgroundColor: theme.colors.border,
    marginBottom: theme.spacing.xs,
  },

  summaryLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: theme.colors.mutedSage.muted1,
  },

  summaryValue: {
    marginTop: 3,
    fontSize: 17,
    fontWeight: "900",
    color: theme.colors.ink,
  },

  chartCard: {
    borderRadius: 26,
    paddingVertical: theme.spacing.lg,
    backgroundColor: theme.colors.pageBg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
    marginBottom: theme.spacing.lg,
  },

  sectionHeader: {
    paddingHorizontal: theme.spacing.md,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
  },

  sectionEyebrow: {
    fontSize: theme.typography.eyebrow.fontSize,
    fontWeight: theme.typography.eyebrow.fontWeight,
    letterSpacing: theme.typography.eyebrow.letterSpacing,
    color: theme.colors.mutedSage.muted1,
  },

  sectionTitle: {
    marginTop: 3,
    fontSize: theme.fontSize.lg,
    fontWeight: "900",
    color: theme.colors.ink,
    letterSpacing: -0.5,
  },

  expenseCount: {
    alignItems: "flex-end",
  },

  expenseCountText: {
    fontSize: 18,
    fontWeight: "900",
    color: theme.colors.ink,
  },

  expenseCountLabel: {
    marginTop: 1,
    fontSize: 10,
    color: theme.colors.mutedSage.muted1,
  },

  // Donut chart
  donutShadowWrap: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },

  donutCenter: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },

  donutCenterLabel: {
    fontSize: 11,
    color: theme.colors.mutedSage.muted1,
    fontWeight: "600",
  },

  donutCenterValue: {
    fontSize: 18,
    fontWeight: "900",
    color: theme.colors.ink,
    marginTop: 2,
  },

  legendWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    marginTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  legendLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.ink,
  },

  legendPct: {
    fontSize: 11,
    color: theme.colors.mutedSage.muted1,
  },

  emptyChart: {
    padding: theme.spacing.lg,
    alignItems: "center",
  },

  emptyChartTitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "800",
    color: theme.colors.ink,
  },

  emptyChartText: {
    marginTop: 4,
    fontSize: 12,
    color: theme.colors.mutedSage.muted1,
    textAlign: "center",
  },

  // Platform Accordion Section
  transactionsSection: {
    marginTop: theme.spacing.xs,
  },

  transactionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },

  refreshButton: {
    padding: 8,
    borderRadius: 999,
    backgroundColor: theme.colors.border,
  },

  refreshButtonPressed: {
    opacity: 0.7,
  },

  platformListContainer: {
    gap: theme.spacing.sm,
  },

  platformCardGroup: {
    borderRadius: 18,
    backgroundColor: theme.colors.pageBg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
  },

  platformHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
  },

  platformIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 12,
  },

  platformLogo: {
    width: "100%",
    height: "100%",
  },

  fallbackIcon: {
    width: "100%",
    height: "100%",
    backgroundColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  fallbackIconText: {
    fontSize: 14,
    fontWeight: "800",
    color: theme.colors.ink,
  },

  platformMeta: {
    flex: 1,
  },

  platformTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: theme.colors.ink,
  },

  platformSubtext: {
    fontSize: 11,
    color: theme.colors.mutedSage.muted1,
    marginTop: 2,
  },

  platformProfitCol: {
    alignItems: "flex-end",
  },

  platformProfitVal: {
    fontSize: 14,
    fontWeight: "900",
  },

  platformProfitLabel: {
    fontSize: 10,
    color: theme.colors.mutedSage.muted1,
  },

  positiveNet: {
    color: "#2FAE60",
  },

  negativeNet: {
    color: theme.colors.onboarding.feedback.errorText,
  },

  platformBody: {
    paddingHorizontal: theme.spacing.xs,
    paddingBottom: theme.spacing.xs,
    gap: 8,
  },

  emptyTransactions: {
    padding: theme.spacing.lg,
    alignItems: "center",
  },

  emptyTransactionsTitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "800",
    color: theme.colors.ink,
  },

  emptyTransactionsText: {
    marginTop: 4,
    fontSize: 12,
    color: theme.colors.mutedSage.muted1,
    textAlign: "center",
  },

  // Transaction Cards
  transactionCard: {
    padding: theme.spacing.sm,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.pageBg,
  },

  transactionCardDeductible: {
    borderColor: "#2FAE6033",
  },

  transactionCardExpanded: {
    backgroundColor: "#F8FAF8",
  },

  transactionCardPressed: {
    opacity: 0.8,
  },

  transactionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  expenseIcon: {
    backgroundColor: theme.colors.onboarding.feedback.errorBackground,
  },

  incomeIcon: {
    backgroundColor: theme.colors.border,
  },

  transactionMain: {
    flex: 1,
  },

  transactionTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: theme.colors.ink,
  },

  transactionMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },

  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
  },

  categoryBadgeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },

  categoryBadgeText: {
    fontSize: 9,
    fontWeight: "700",
  },

  transactionMeta: {
    fontSize: 10,
    color: theme.colors.mutedSage.muted1,
  },

  transactionAmountContainer: {
    alignItems: "flex-end",
  },

  transactionAmount: {
    fontSize: 13,
    fontWeight: "900",
  },

  expenseAmount: {
    color: theme.colors.onboarding.feedback.errorText,
  },

  incomeAmount: {
    color: theme.colors.ink,
  },

  taxBadgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },

  taxPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2FAE6015",
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },

  taxPillIcon: {
    marginRight: 2,
  },

  taxLabel: {
    fontSize: 8,
    fontWeight: "800",
    color: "#2FAE60",
  },

  explanationCard: {
    marginTop: 8,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#F2F9F4",
    borderWidth: 1,
    borderColor: "#2FAE6022",
  },

  explanationHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  explanationTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  explanationTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#2FAE60",
  },

  ruleBadge: {
    backgroundColor: "#2FAE6022",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },

  ruleBadgeText: {
    fontSize: 8,
    fontWeight: "800",
    color: "#2FAE60",
  },

  explanationText: {
    fontSize: 11,
    color: theme.colors.ink,
    lineHeight: 15,
  },

  metadataFooterRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },

  metadataFooterTag: {
    fontSize: 9,
    color: theme.colors.mutedSage.muted1,
  },

  metadataFooterValue: {
    fontWeight: "700",
    color: theme.colors.ink,
  },
});