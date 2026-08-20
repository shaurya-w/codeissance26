import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  Bell,
  ScanLine,
} from "lucide-react-native";

import { theme } from "@/constants/theme";
import { HamburgerMenu } from "@/components/HamburgerMenu";

type HeaderProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
};

export function Header({
  eyebrow,
  title,
  subtitle,
}: HeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleScan = () => {
    router.push("/scan");
  };

  return (
    <>
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top + theme.spacing.sm,
          },
        ]}
      >
        {/* Page heading */}
        <View style={styles.headingContainer}>
          {eyebrow && (
            <Text style={styles.eyebrow}>
              {eyebrow}
            </Text>
          )}

          {title && (
            <Text style={styles.title}>
              {title}
            </Text>
          )}

          {subtitle && (
            <Text style={styles.subtitle}>
              {subtitle}
            </Text>
          )}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Pressable
            onPress={handleScan}
            accessibilityRole="button"
            accessibilityLabel="Open scanner"
            style={({ pressed }) => [
              styles.iconButton,
              pressed && styles.iconButtonPressed,
            ]}
          >
            <ScanLine
              size={22}
              strokeWidth={2.2}
              color={theme.colors.ink}
            />
          </Pressable>

          <Pressable
            onPress={() => setMenuOpen(true)}
            accessibilityRole="button"
            accessibilityLabel="Open menu"
            accessibilityState={{
              expanded: menuOpen,
            }}
            style={({ pressed }) => [
              styles.iconButton,
              pressed && styles.iconButtonPressed,
            ]}
          >
            <Bell
              size={22}
              strokeWidth={2.2}
              color={theme.colors.ink}
            />
          </Pressable>
        </View>
      </View>

      <HamburgerMenu
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    backgroundColor: theme.colors.pageBg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
    zIndex: 100,
  },

  headingContainer: {
    flex: 1,
    justifyContent: "center",
  },

  eyebrow: {
    fontSize: theme.typography.eyebrow.fontSize,
    fontWeight: theme.typography.eyebrow.fontWeight,
    letterSpacing: theme.typography.eyebrow.letterSpacing,
    color: theme.colors.mutedSage.muted1,
  },

  title: {
    marginTop: 2,
    fontSize: theme.fontSize.xl,
    fontWeight: theme.typography.fontWeights.black,
    color: theme.colors.ink,
    letterSpacing: -0.8,
  },

  subtitle: {
    marginTop: 2,
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedSage.muted1,
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },

  iconButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
  },

  iconButtonPressed: {
    backgroundColor: theme.colors.border,
  },
});