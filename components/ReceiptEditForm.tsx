/**
 * components/ReceiptEditForm.tsx
 * ------------------------------
 * Editable form for reviewing and correcting OCR-extracted receipt data.
 * Pre-populated with Gemini results; user can correct any field before
 * submitting to the /classify endpoint.
 */

import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Check, AlertTriangle } from "lucide-react-native";

import { theme } from "@/constants/theme";
import { ReceiptData, TransactionType } from "@/types/receipt";
import { sendToClassify } from "@/services/classifyApi";

// Static User ID for all submissions
const DEFAULT_USER_ID = "97fc9b68-f8b6-497f-8dc4-a6829af235f7";

interface ReceiptEditFormProps {
  /** Optional ID override; defaults to static user ID. */
  userId?: string;
  /** Initial data to populate the form (from OCR or empty for manual). */
  initialData: ReceiptData;
  /** Called after a successful classify submission. */
  onSuccess?: (response: any) => void;
  /** Called when the user wants to go back / scan another. */
  onReset?: () => void;
}

type SubmitState = "idle" | "loading" | "success" | "error";

export function ReceiptEditForm({
  userId = DEFAULT_USER_ID,
  initialData,
  onSuccess,
  onReset,
}: ReceiptEditFormProps) {
  const [amount, setAmount] = useState(
    initialData.amount ? String(initialData.amount) : ""
  );
  const [vendor, setVendor] = useState(initialData.vendor || "");
  const [date, setDate] = useState(initialData.date || "");
  const [description, setDescription] = useState(initialData.description || "");
  
  // OCR transactions default to EXPENSE
  const [transactionType, setTransactionType] = useState<TransactionType>("EXPENSE");

  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    // 1. Validate input fields
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setSubmitState("error");
      setErrorMessage("Please enter a valid amount greater than 0.");
      return;
    }

    const trimmedVendor = vendor.trim();
    if (!trimmedVendor) {
      setSubmitState("error");
      setErrorMessage("Please enter a vendor name.");
      return;
    }

    const trimmedDate = date.trim();
    if (!trimmedDate || !/^\d{4}-\d{2}-\d{2}$/.test(trimmedDate)) {
      setSubmitState("error");
      setErrorMessage("Please enter a valid date in YYYY-MM-DD format.");
      return;
    }

    setSubmitState("loading");
    setErrorMessage("");

    // 2. Construct API payload using hardcoded userId
    const payload = {
      user_id: userId || DEFAULT_USER_ID,
      amount: parsedAmount,
      vendor: trimmedVendor,
      date: trimmedDate,
      description: description.trim() || `Purchase from ${trimmedVendor}`,
      transaction_type: transactionType,
      source_type: initialData.source_type,
    };

    try {
      const response = await sendToClassify(payload);
      setSubmitState("success");
      onSuccess?.(response);
    } catch (err: any) {
      setSubmitState("error");
      setErrorMessage(err.message || "Failed to classify. Please try again.");
    }
  };

  if (submitState === "success") {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successIconWrap}>
          <Check color="#fff" size={32} />
        </View>
        <Text style={styles.successTitle}>Submitted Successfully!</Text>
        <Text style={styles.successBody}>
          Your receipt has been sent for classification.
        </Text>
        {onReset && (
          <Pressable style={styles.secondaryButton} onPress={onReset}>
            <Text style={styles.secondaryButtonText}>Scan Another Receipt</Text>
          </Pressable>
        )}
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.sectionTitle}>Review Details</Text>
      <Text style={styles.sectionSubtitle}>
        {initialData.source_type === "RECEIPT_OCR"
          ? "Extracted via AI — please verify and correct if needed."
          : "Enter the receipt details manually."}
      </Text>

      {/* Amount */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Amount (₹)</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          placeholder="e.g. 850.00"
          placeholderTextColor={theme.colors.textMuted}
        />
      </View>

      {/* Vendor */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Vendor</Text>
        <TextInput
          style={styles.input}
          value={vendor}
          onChangeText={setVendor}
          placeholder="e.g. Indian Oil"
          placeholderTextColor={theme.colors.textMuted}
        />
      </View>

      {/* Date */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="e.g. 2026-08-15"
          placeholderTextColor={theme.colors.textMuted}
        />
      </View>

      {/* Description */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          value={description}
          onChangeText={setDescription}
          placeholder="e.g. Petrol purchase from Indian Oil"
          placeholderTextColor={theme.colors.textMuted}
          multiline
          numberOfLines={2}
        />
      </View>

      {/* Transaction Type Toggle */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Transaction Type</Text>
        <View style={styles.toggleRow}>
          <Pressable
            style={[
              styles.toggleOption,
              transactionType === "EXPENSE" && styles.toggleOptionActive,
            ]}
            onPress={() => setTransactionType("EXPENSE")}
          >
            <Text
              style={[
                styles.toggleText,
                transactionType === "EXPENSE" && styles.toggleTextActive,
              ]}
            >
              Expense
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.toggleOption,
              transactionType === "INCOME" && styles.toggleOptionActiveIncome,
            ]}
            onPress={() => setTransactionType("INCOME")}
          >
            <Text
              style={[
                styles.toggleText,
                transactionType === "INCOME" && styles.toggleTextActive,
              ]}
            >
              Income
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Error Message */}
      {submitState === "error" && errorMessage ? (
        <View style={styles.errorBanner}>
          <AlertTriangle color={theme.colors.danger} size={16} />
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}

      {/* Submit Button */}
      <Pressable
        style={({ pressed }) => [
          styles.submitButton,
          pressed && styles.submitButtonPressed,
          submitState === "loading" && styles.submitButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={submitState === "loading"}
      >
        {submitState === "loading" ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.submitButtonText}>Confirm & Classify</Text>
        )}
      </Pressable>

      {/* Reset / Scan Another */}
      {onReset && (
        <Pressable style={styles.secondaryButton} onPress={onReset}>
          <Text style={styles.secondaryButtonText}>Cancel</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  sectionSubtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.lg,
  },
  fieldGroup: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 6,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 12,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  multilineInput: {
    minHeight: 60,
    textAlignVertical: "top",
  },
  toggleRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
  },
  toggleOptionActive: {
    borderColor: theme.colors.danger,
    backgroundColor: "#FEF2F2",
  },
  toggleOptionActiveIncome: {
    borderColor: theme.colors.success,
    backgroundColor: "#F0FDF4",
  },
  toggleText: {
    fontSize: theme.fontSize.md,
    fontWeight: "600",
    color: theme.colors.textMuted,
  },
  toggleTextActive: {
    color: theme.colors.text,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    backgroundColor: "#FEF2F2",
    borderRadius: theme.radius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  errorText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.danger,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: theme.spacing.sm,
  },
  submitButtonPressed: {
    opacity: 0.85,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: theme.fontSize.md,
    fontWeight: "700",
  },
  secondaryButton: {
    paddingVertical: 14,
    alignItems: "center",
    marginTop: theme.spacing.sm,
  },
  secondaryButtonText: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.md,
    fontWeight: "600",
  },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  successIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.success,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.sm,
  },
  successTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: "700",
    color: theme.colors.text,
  },
  successBody: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textMuted,
    textAlign: "center",
  },
});