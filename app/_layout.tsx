<<<<<<< HEAD

import SideNav from "@/src/components/navigation/SideNav";
=======
import SideNav from "@/components/SideNav";
>>>>>>> 5af5ac84af1e5a0d4fa99c27afbe7d7860892eed
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
<<<<<<< HEAD
}
=======
}

const styles = StyleSheet.create({
});
>>>>>>> 5af5ac84af1e5a0d4fa99c27afbe7d7860892eed
