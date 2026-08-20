import { Tabs } from "expo-router";
import { Activity, Compass, Home, ScanLine, User } from "lucide-react-native";

import { theme } from "@/constants/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.ink,
        tabBarInactiveTintColor: theme.colors.mutedSage.muted1,
        tabBarStyle: {
          backgroundColor: theme.colors.pageBg,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: theme.fontSize.micro,
          fontWeight: theme.typography.fontWeights.black,
          letterSpacing: 0.5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      {/* <Tabs.Screen
        name="scan"
        options={{
          title: "Scan",
          tabBarIcon: ({ color, size }) => <ScanLine color={color} size={size} />,
        }}
      /> */}
      <Tabs.Screen
        name="tax"
        options={{
          title: "Tax",
          tabBarIcon: ({ color, size }) => <Compass color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="advisory"
        options={{
          title: "Advisory",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: "Expenses",
          tabBarIcon: ({ color, size }) => <Activity color={color} size={size} />,
        }}
      />
      
    </Tabs>
  );
}
