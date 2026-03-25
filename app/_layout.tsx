
import SideNav from "@/src/components/SideNav";
import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import KeepHeader from "../src/components/KeepHeader";

export default function RootLayout() {
  return (
    <View>
      <KeepHeader />
      <SideNav />
      
      <View>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
});