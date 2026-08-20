import React from "react";
import { StyleSheet, View } from "react-native";

import { SelectionCard } from "@/components/onboarding/SelectionCard";
import { theme } from "@/constants/theme";
import { BANKS } from "@/data/banks";
import type { BankId } from "@/types/onboarding";

interface BankSelectorProps {
  selectedBank: BankId | null;
  onSelect: (bank: BankId) => void;
}

export function BankSelector({ selectedBank, onSelect }: BankSelectorProps) {
  return (
    <View style={styles.list}>
      {BANKS.map((bank) => (
        <SelectionCard
          key={bank.id}
          label={bank.name}
          logoUri={bank.logoUri}
          fallbackAsset={bank.fallbackAsset}
          fallbackInitial={bank.shortName.slice(0, 2)}
          selected={selectedBank === bank.id}
          onPress={() => onSelect(bank.id)}
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
