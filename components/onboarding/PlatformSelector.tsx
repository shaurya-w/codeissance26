import React from "react";
import { StyleSheet, View } from "react-native";

import { SelectionCard } from "@/components/onboarding/SelectionCard";
import { theme } from "@/constants/theme";
import { GIG_PLATFORMS } from "@/data/platforms";
import type { PlatformId } from "@/types/onboarding";

interface PlatformSelectorProps {
  selectedPlatforms: PlatformId[];
  onToggle: (platform: PlatformId) => void;
}

export function PlatformSelector({ selectedPlatforms, onToggle }: PlatformSelectorProps) {
  return (
    <View style={styles.list}>
      {GIG_PLATFORMS.map((platform) => (
        <SelectionCard
          key={platform.id}
          label={platform.platformName}
          logoUri={platform.logoUri}
          fallbackAsset={platform.fallbackAsset}
          fallbackInitial={platform.platformName.slice(0, 2)}
          selected={selectedPlatforms.includes(platform.id)}
          onPress={() => onToggle(platform.id)}
          multiSelect
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: theme.spacing.sm,
  },
});
