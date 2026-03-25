
import SideNav from "@/src/components/navigation/SideNav";
import { Stack } from "expo-router";
import { View } from "react-native";
import KeepHeader from "../src/components/navigation/KeepHeader";

export default function RootLayout() {
  return (
    <View style={{ flex: 1, flexDirection: "column" }}>
      {/* Header */}
      <KeepHeader />

      {/* Main area: SideNav + Stack */}
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <SideNav  />

        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </View>
  );
}