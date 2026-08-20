import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { theme } from "@/constants/theme";

type HeaderProps = {
  /** Screen title shown on the left. */
  title: string;
  /** Optional eyebrow text shown above the title. */
  eyebrow?: string;
  /** Optional subtitle shown below the title. */
  subtitle?: string;
  /** Optional element rendered on the right (e.g. an icon button). */
  rightAction?: React.ReactNode;
};

export function Header({ title, eyebrow, subtitle, rightAction }: HeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + theme.spacing.sm }]}>
      <View style={styles.titleContainer}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {rightAction ? <View style={styles.rightAction}>{rightAction}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.pageBg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  titleContainer: {
    flex: 1,
    gap: theme.spacing.xxs,
  },
  eyebrow: {
    fontSize: theme.typography.eyebrow.fontSize,
    fontWeight: theme.typography.eyebrow.fontWeight,
    letterSpacing: theme.typography.eyebrow.letterSpacing,
    textTransform: theme.typography.eyebrow.textTransform,
    color: theme.colors.mutedSage.muted1,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.typography.fontWeights.black,
    color: theme.colors.ink,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedSage.muted1,
  },
  rightAction: {
    alignItems: "center",
    justifyContent: "center",
  },
});

