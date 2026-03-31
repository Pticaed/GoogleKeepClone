
 import SideNav from "@/components/navigation/SideNav";
import { GlobalProvider } from "@/context/GlobalContext";
import { Stack } from "expo-router";
import { View } from "react-native";
import KeepHeader from "../src/components/navigation/KeepHeader";
export default function RootLayout() {
  return (
    <GlobalProvider>
      <View style={{ flex: 1, flexDirection: "column" }}>
        {/* Header */}
        <KeepHeader />

        {/* Main area: SideNav + Stack */}
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <SideNav  />

          <Stack screenOptions={{ headerShown: false,  }} />
        </View>
      </View>
    </GlobalProvider>
  );
}