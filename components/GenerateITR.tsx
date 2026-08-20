import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const N8N_WEBHOOK_URL =
  "https://shaurya2208.app.n8n.cloud/webhook/generate-itr-report";

const MOCK_USER_ID =
  "97fc9b68-f8b6-497f-8dc4-a6829af235f7";

export default function GenerateITR() {
  const [generating, setGenerating] = useState(false);

  const generateITRReport = async () => {
    if (generating) return;

    try {
      setGenerating(true);

      console.log("Requesting ITR-3 report...");

      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          user_id: MOCK_USER_ID,
          financial_year: "2025-26",
          assessment_year: "2026-27",
        }),
      });

      const result = await response.json();

      console.log("n8n response:", result);

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            result.message ||
            `Failed to generate ITR report (${response.status})`
        );
      }

      Alert.alert(
        "ITR Report Generated",
        `Your ITR-3 report has been generated and sent to ${result.email}.`
      );

    } catch (error) {
      console.error(
        "Failed to generate ITR report:",
        error
      );

      Alert.alert(
        "ITR Report Error",
        error instanceof Error
          ? error.message
          : "Unable to generate the ITR report."
      );
    } finally {
      setGenerating(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>
        TAX FILING
      </Text>

      <Text style={styles.title}>
        Generate ITR Report
      </Text>

      <Text style={styles.subtitle}>
        Generate your tax filing report for
        FY 2025–26.
      </Text>

      <Pressable
        onPress={generateITRReport}
        disabled={generating}
        style={({ pressed }) => [
          styles.button,
          pressed &&
            !generating &&
            styles.buttonPressed,
          generating &&
            styles.buttonDisabled,
        ]}
      >
        {generating ? (
          <>
            <ActivityIndicator
              size="small"
              color="#FFFFFF"
            />

            <Text style={styles.buttonText}>
              Generating...
            </Text>
          </>
        ) : (
          <Text style={styles.buttonText}>
            Generate ITR Report
          </Text>
        )}
      </Pressable>

      {!generating && (
        <Text style={styles.success}>
          Your report will be sent to your registered email.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    color: "#68736F",
  },

  title: {
    marginTop: 6,
    fontSize: 24,
    fontWeight: "800",
    color: "#17201D",
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: "#68736F",
  },

  button: {
    marginTop: 20,
    minHeight: 52,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: "#1F6F5B",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },

  buttonPressed: {
    opacity: 0.8,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  success: {
    marginTop: 14,
    fontSize: 13,
    fontWeight: "600",
    color: "#1F6F5B",
  },
});