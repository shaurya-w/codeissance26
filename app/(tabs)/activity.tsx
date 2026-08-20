import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Header } from "@/components/Header";
import { theme } from "@/constants/theme";

export default function ActivityScreen() {
  return (
    <View style={styles.container}>
      <Header title="Activity" />
      <View style={styles.content}>
        <Text style={styles.heading}>Activity</Text>
        <Text style={styles.body}>Your activity will appear here.</Text>
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
});
