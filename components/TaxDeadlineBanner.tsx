// components/TaxDeadlineBanner.tsx
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { AlertCircle, CheckCircle2 } from "lucide-react-native";

import { theme } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { getUpcomingTaxDeadline, TaxDeadline } from "@/services/taxService";

// Visual token fallbacks matching globals.css water-high scale
const WATER_HIGH_TEXT = "#985743"; // --color-water-high-text
const WATER_HIGH_BG = "#f8e4dc";   // --color-water-high-bg

interface TaxDeadlineBannerProps {
    onPress?: () => void;
}

export function TaxDeadlineBanner({ onPress }: TaxDeadlineBannerProps) {
    const [deadline, setDeadline] = useState<TaxDeadline | null>(null);
    const [daysLeft, setDaysLeft] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        fetchDeadline();
    }, []);

    const fetchDeadline = async () => {
        const res = await getUpcomingTaxDeadline();
        setDeadline(res.deadline);
        setDaysLeft(res.daysLeft);
    };

    const handleMarkAsPaid = async () => {
        if (!deadline) return;

        Alert.alert(
            "Confirm Payment",
            `Are you sure you want to mark "${deadline.title}" as paid? This will remove the record.`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Confirm & Remove",
                    style: "destructive",
                    onPress: async () => {
                        setLoading(true);
                        try {
                            const { error } = await supabase
                                .from("tax_deadlines")
                                .delete()
                                .eq("id", deadline.id);

                            if (error) {
                                Alert.alert("Error", "Failed to update deadline. Try again.");
                            } else {
                                setDeadline(null);
                                setDaysLeft(null);
                            }
                        } catch (err: any) {
                            Alert.alert("Error", err.message || "An unexpected error occurred.");
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ]
        );
    };

    if (daysLeft === null || daysLeft > 7 || daysLeft < 0 || !deadline) {
        return null;
    }

    const getUrgencyText = () => {
        if (daysLeft === 0) return "DUE TODAY";
        if (daysLeft === 1) return "DUE TOMORROW";
        return `${daysLeft} DAYS LEFT`;
    };

    return (
        <View style={styles.dataCard}>
            {/* Urgent Header */}
            <View style={styles.dataCardHeader}>
                <View style={styles.headerLeft}>
                    <AlertCircle size={16} color={WATER_HIGH_TEXT} />
                    <Text style={styles.microLabel}>CRITICAL TAX DEADLINE</Text>
                </View>
                <View style={styles.avgBadge}>
                    <Text style={styles.avgBadgeText}>{getUrgencyText()}</Text>
                </View>
            </View>

            {/* Main Content */}
            <View style={styles.metricSection}>
                <Text style={styles.cardTitle}>{deadline.title}</Text>
                {deadline.description ? (
                    <Text style={styles.contextText}>{deadline.description}</Text>
                ) : null}
            </View>

            <View style={styles.dashedDivider} />

            {/* Action Row */}
            <View style={styles.actionRow}>
                <Pressable
                    style={({ pressed }) => [
                        styles.paidButton,
                        pressed && styles.buttonPressed,
                    ]}
                    onPress={handleMarkAsPaid}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <>
                            <CheckCircle2 size={16} color="#FFFFFF" />
                            <Text style={styles.paidButtonText}>Mark as Paid</Text>
                        </>
                    )}
                </Pressable>

                <Pressable
                    style={({ pressed }) => [
                        styles.dismissButton,
                        pressed && styles.buttonPressed,
                    ]}
                    onPress={() => {
                        setDeadline(null);
                        setDaysLeft(null);
                    }}
                >
                    <Text style={styles.dismissButtonText}>Dismiss</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    dataCard: {
        backgroundColor: WATER_HIGH_BG, // Tinted background for urgency
        borderRadius: theme.radius.card,
        padding: theme.spacing.lg,
        borderWidth: 1,
        borderColor: WATER_HIGH_TEXT,
        borderLeftWidth: 6, // Thick alert strip on the left margin
        borderLeftColor: WATER_HIGH_TEXT,
        ...theme.shadows.card,
        gap: theme.spacing.sm,
    },
    dataCardHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.xs,
    },
    microLabel: {
        fontSize: theme.typography.eyebrow.fontSize,
        fontWeight: theme.typography.fontWeights.black,
        letterSpacing: theme.typography.eyebrow.letterSpacing,
        textTransform: theme.typography.eyebrow.textTransform,
        color: WATER_HIGH_TEXT,
    },
    avgBadge: {
        backgroundColor: WATER_HIGH_TEXT,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xxs,
        borderRadius: theme.radius.full,
    },
    avgBadgeText: {
        fontSize: theme.fontSize.micro,
        fontWeight: theme.typography.fontWeights.black,
        letterSpacing: 1,
        color: "#FFFFFF",
        textTransform: "uppercase",
    },
    metricSection: {
        gap: theme.spacing.xxs,
        marginTop: theme.spacing.xs,
    },
    cardTitle: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.typography.fontWeights.black,
        color: theme.colors.ink,
    },
    contextText: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.typography.fontWeights.semibold,
        color: WATER_HIGH_TEXT,
    },
    dashedDivider: {
        height: 1,
        borderWidth: 1,
        borderColor: WATER_HIGH_TEXT,
        borderStyle: "dashed",
        opacity: 0.3,
        marginVertical: theme.spacing.xs,
    },
    actionRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.sm,
    },
    paidButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: theme.spacing.xs,
        backgroundColor: WATER_HIGH_TEXT, // High-contrast action button
        borderRadius: theme.radius.md,
        paddingVertical: theme.spacing.sm,
    },
    paidButtonText: {
        color: "#FFFFFF",
        fontSize: theme.fontSize.sm,
        fontWeight: theme.typography.fontWeights.bold,
    },
    dismissButton: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.radius.md,
    },
    dismissButtonText: {
        color: WATER_HIGH_TEXT,
        fontSize: theme.fontSize.sm,
        fontWeight: theme.typography.fontWeights.bold,
    },
    buttonPressed: {
        opacity: 0.8,
    },
});