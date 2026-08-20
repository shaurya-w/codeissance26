import { Check } from "lucide-react-native";
import React, { useState } from "react";
import { AccessibilityState, Image, Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/constants/theme";

interface SelectionCardProps {
  label: string;
  logoUri?: string;
  fallbackAsset?: any;
  selected: boolean;
  onPress: () => void;
  /** Used for the fallback initials badge if the logo fails to load. */
  fallbackInitial: string;
  multiSelect?: boolean;
}

export function SelectionCard({
  label,
  logoUri,
  fallbackAsset,
  selected,
  onPress,
  fallbackInitial,
  multiSelect = false,
}: SelectionCardProps) {
  const [remoteImageFailed, setRemoteImageFailed] = useState(false);
  const [fallbackImageFailed, setFallbackImageFailed] = useState(false);

  const showRemote = !!logoUri && !remoteImageFailed;
  const showFallback = !showRemote && !!fallbackAsset && !fallbackImageFailed;

  const accessibilityState: AccessibilityState = { selected };

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={multiSelect ? "checkbox" : "radio"}
      accessibilityLabel={label}
      accessibilityState={accessibilityState}
      hitSlop={4}
      style={({ pressed }) => [
        styles.card,
        selected && styles.cardSelected,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.logoWrap}>
        {showRemote ? (
          <Image
            source={{ uri: logoUri }}
            style={styles.logo}
            resizeMode="contain"
            onError={() => setRemoteImageFailed(true)}
            accessibilityIgnoresInvertColors
            alt={`${label} logo`}
          />
        ) : showFallback ? (
          <Image
            source={fallbackAsset}
            style={styles.logo}
            resizeMode="contain"
            onError={() => setFallbackImageFailed(true)}
            accessibilityIgnoresInvertColors
            alt={`${label} logo`}
          />
        ) : (
          <View style={styles.logoFallback}>
            <Text style={styles.logoFallbackText}>{fallbackInitial}</Text>
          </View>
        )}
      </View>

      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>

      <View style={[styles.checkCircle, selected && styles.checkCircleActive]}>
        {selected && <Check size={12} color={theme.colors.onboarding.selection.checkIcon} strokeWidth={3} />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.radius.card,
    backgroundColor: theme.colors.onboarding.selection.background,
    borderWidth: 1.5,
    borderColor: theme.colors.onboarding.selection.border,
    minHeight: 56,
  },
  cardSelected: {
    backgroundColor: theme.colors.onboarding.selection.backgroundActive,
    borderColor: theme.colors.onboarding.selection.borderActive,
  },
  cardPressed: {
    opacity: 0.85,
  },
  logoWrap: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.sm,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
  },
  logo: {
    width: 28,
    height: 28,
  },
  logoFallback: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surfaceSubtle,
  },
  logoFallbackText: {
    fontFamily: theme.typography.fontMono,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.typography.fontWeights.black,
    color: theme.colors.onboarding.selection.label,
  },
  label: {
    flex: 1,
    fontSize: theme.fontSize.md,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.onboarding.selection.label,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: theme.radius.full,
    borderWidth: 1.5,
    borderColor: theme.colors.onboarding.selection.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
  },
  checkCircleActive: {
    borderColor: theme.colors.onboarding.selection.checkBackground,
    backgroundColor: theme.colors.onboarding.selection.checkBackground,
  },
});
