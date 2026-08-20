import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Bell,
  LogOut,
  X,
} from "lucide-react-native";

import { theme } from "@/constants/theme";

type HamburgerMenuProps = {
  visible: boolean;
  onClose: () => void;
  onSignOut?: () => void | Promise<void>;
  isSigningOut?: boolean;
};

export function HamburgerMenu({
  visible,
  onClose,
  onSignOut,
  isSigningOut = false,
}: HamburgerMenuProps) {
  const insets = useSafeAreaInsets();

  if (!visible) return null;

  const handleSignOut = async () => {
    if (isSigningOut) return;

    if (onSignOut) {
      await onSignOut();
      return;
    }
  };

  return (
    <View style={styles.overlay}>
      {/* Tap outside drawer to close */}
      <Pressable
        style={styles.backdrop}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Close menu"
      />

      {/* 75% width drawer */}
      <View
        style={[
          styles.drawer,
          {
            paddingTop: insets.top + theme.spacing.sm,
            paddingBottom: insets.bottom + theme.spacing.md,
          },
        ]}
      >
        {/* Header */}
        <View style={styles.drawerHeader}>
          <Text style={styles.brand}>GigLedger</Text>

          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close menu"
            style={({ pressed }) => [
              styles.closeButton,
              pressed && styles.closeButtonPressed,
            ]}
          >
            <X
              size={24}
              strokeWidth={2.2}
              color={theme.colors.ink}
            />
          </Pressable>
        </View>

        {/* Menu content */}
        <View style={styles.menuContent}>
          <Text style={styles.menuEyebrow}>ACCOUNT</Text>

          <Text style={styles.menuTitle}>
            Your GigLedger
          </Text>

          <View style={styles.divider} />

          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="View notifications"
            style={({ pressed }) => [
              styles.menuItem,
              pressed && styles.menuItemPressed,
            ]}
          >
            <Bell
              size={20}
              strokeWidth={2.2}
              color={theme.colors.ink}
            />

            <Text style={styles.menuItemText}>
              Notifications
            </Text>
          </Pressable>
        </View>

        {/* ALWAYS pinned to bottom */}
        <View style={styles.signOutContainer}>
          <View style={styles.divider} />

          <Pressable
            onPress={handleSignOut}
            disabled={isSigningOut}
            accessibilityRole="button"
            accessibilityLabel="Sign out and start over"
            accessibilityState={{
              disabled: isSigningOut,
              busy: isSigningOut,
            }}
            style={({ pressed }) => [
              styles.signOutButton,
              pressed &&
                !isSigningOut &&
                styles.signOutButtonPressed,
            ]}
          >
            {isSigningOut ? (
              <ActivityIndicator
                color={
                  theme.colors.onboarding.feedback.errorText
                }
              />
            ) : (
              <>
                <LogOut
                  size={19}
                  strokeWidth={2.2}
                  color={
                    theme.colors.onboarding.feedback.errorText
                  }
                />

                <Text style={styles.signOutText}>
                  Sign out / Start over
                </Text>
              </>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    zIndex: 1000,
  },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
  },

  drawer: {
    width: "75%",
    height: "100%",
    backgroundColor: theme.colors.pageBg,

    paddingHorizontal: theme.spacing.md,

    // Shadow
    shadowColor: theme.colors.ink,
    shadowOffset: {
      width: -8,
      height: 0,
    },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
  },

  drawerHeader: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  brand: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.typography.fontWeights.black,
    color: theme.colors.ink,
    letterSpacing: -1.1,
  },

  closeButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
  },

  closeButtonPressed: {
    backgroundColor: theme.colors.border,
  },

  menuContent: {
    flex: 1,
    paddingTop: theme.spacing.lg,
  },

  menuEyebrow: {
    fontSize: theme.typography.eyebrow.fontSize,
    fontWeight: theme.typography.eyebrow.fontWeight,
    letterSpacing: theme.typography.eyebrow.letterSpacing,
    color: theme.colors.mutedSage.muted1,
  },

  menuTitle: {
    marginTop: theme.spacing.xs,
    fontSize: theme.fontSize.lg,
    fontWeight: theme.typography.fontWeights.black,
    color: theme.colors.ink,
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },

  menuItem: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: 14,
  },

  menuItemPressed: {
    backgroundColor: theme.colors.border,
  },

  menuItemText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.typography.fontWeights.black,
    color: theme.colors.ink,
  },

  signOutContainer: {
    marginTop: "auto",
  },

  signOutButton: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: 16,
    backgroundColor:
      theme.colors.onboarding.feedback.errorBackground,
  },

  signOutButtonPressed: {
    opacity: 0.75,
  },

  signOutText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.typography.fontWeights.black,
    color:
      theme.colors.onboarding.feedback.errorText,
  },
});