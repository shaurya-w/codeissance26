import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { OnboardingFooter } from "@/components/onboarding/OnboardingFooter";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { theme } from "@/constants/theme";
import { useOnboarding } from "@/context/OnboardingContext";

export default function OnboardingStep0Screen() {
  const { isSubmittingStep0, step0Error, submitStep0 } = useOnboarding();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [taxRegime, setTaxRegime] = useState<"normal" | "presumptive">("normal");
  const [presumptiveScheme, setPresumptiveScheme] = useState<"44AD" | "44ADA" | null>(null);

  const handleTaxRegimeChange = (val: "normal" | "presumptive") => {
    setTaxRegime(val);
    if (val === "normal") {
      setPresumptiveScheme(null);
    } else {
      setPresumptiveScheme("44AD");
    }
  };

  const handleCreateUser = async () => {
    if (!name.trim() || !email.trim()) return;
    const success = await submitStep0(
      name.trim(),
      email.trim(),
      taxRegime,
      presumptiveScheme
    );
    if (success) {
      router.replace("/onboarding/step-1");
    }
  };

  const isFormValid =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    (taxRegime === "normal" || presumptiveScheme !== null);

  return (
    <OnboardingLayout
      step={0}
      eyebrow="Create Profile"
      title="Onboarding"
      subtitle="Enter your details to get started with your tax and financial demo."
      footer={
        <OnboardingFooter
          ctaLabel="Create user"
          onPress={handleCreateUser}
          disabled={!isFormValid}
          loading={isSubmittingStep0}
          error={step0Error}
        />
      }
    >
      <View style={styles.formContainer}>
        {/* Name */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Jane Doe"
            placeholderTextColor={theme.colors.textMuted}
            autoCapitalize="words"
            autoCorrect={false}
          />
        </View>

        {/* Email */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="e.g. jane.doe@example.com"
            placeholderTextColor={theme.colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Tax Regime */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Tax Regime</Text>
          <View style={styles.toggleRow}>
            <Pressable
              style={[
                styles.toggleOption,
                taxRegime === "normal" && styles.toggleOptionActive,
              ]}
              onPress={() => handleTaxRegimeChange("normal")}
            >
              <Text
                style={[
                  styles.toggleText,
                  taxRegime === "normal" && styles.toggleTextActive,
                ]}
              >
                Normal
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.toggleOption,
                taxRegime === "presumptive" && styles.toggleOptionActive,
              ]}
              onPress={() => handleTaxRegimeChange("presumptive")}
            >
              <Text
                style={[
                  styles.toggleText,
                  taxRegime === "presumptive" && styles.toggleTextActive,
                ]}
              >
                Presumptive
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Presumptive Scheme (Conditional) */}
        {taxRegime === "presumptive" && (
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Presumptive Scheme</Text>
            <View style={styles.toggleRow}>
              <Pressable
                style={[
                  styles.toggleOption,
                  presumptiveScheme === "44AD" && styles.toggleOptionActive,
                ]}
                onPress={() => setPresumptiveScheme("44AD")}
              >
                <Text
                  style={[
                    styles.toggleText,
                    presumptiveScheme === "44AD" && styles.toggleTextActive,
                  ]}
                >
                  Section 44AD
                </Text>
                <Text style={styles.toggleSubtext}>Business income</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.toggleOption,
                  presumptiveScheme === "44ADA" && styles.toggleOptionActive,
                ]}
                onPress={() => setPresumptiveScheme("44ADA")}
              >
                <Text
                  style={[
                    styles.toggleText,
                    presumptiveScheme === "44ADA" && styles.toggleTextActive,
                  ]}
                >
                  Section 44ADA
                </Text>
                <Text style={styles.toggleSubtext}>Professional income</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    gap: theme.spacing.md,
    marginTop: theme.spacing.xxs,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 14,
    fontSize: theme.fontSize.md,
    color: theme.colors.ink,
  },
  toggleRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleOptionActive: {
    borderColor: theme.colors.brandGreen,
    backgroundColor: "#f4f9f6",
  },
  toggleText: {
    fontSize: theme.fontSize.md,
    fontWeight: "600",
    color: theme.colors.textMuted,
  },
  toggleTextActive: {
    color: theme.colors.ink,
    fontWeight: "700",
  },
  toggleSubtext: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSubtle,
    marginTop: 2,
  },
});
