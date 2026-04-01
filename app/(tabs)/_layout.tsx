// app/(tabs)/_layout.tsx
import KeepHeader from "@/components/navigation/KeepHeader";
import SideNav from "@/components/navigation/SideNav";
import { useGlobal } from "@/context/GlobalContext";
import { Tabs } from "expo-router";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { MD3DarkTheme, MD3LightTheme, Provider as PaperProvider } from "react-native-paper";

export default function TabsLayout() {
  const { theme, toggleTheme, logout } = useGlobal();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const paperTheme = theme === "light" ? MD3LightTheme : MD3DarkTheme;

  return (
    <PaperProvider theme={paperTheme} >
      <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
        {/* HEADER с кнопкой настроек */}
        <KeepHeader onSettingsPress={() => setDropdownVisible(true)} />

        {/* MAIN: SideNav + контент экранов */}
        <View style={{ flex: 1, flexDirection: "row" }}>
          <SideNav />
          <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen name="notes" />
            <Tabs.Screen name="reminders" />
            <Tabs.Screen name="labels" />
            <Tabs.Screen name="archive" />
            <Tabs.Screen name="trash" />
          </Tabs>
        </View>

        {/* DROPDOWN MODAL (тема / выход) */}
        <Modal
          transparent
          visible={dropdownVisible}
          animationType="fade"
          onRequestClose={() => setDropdownVisible(false)}
        >
          <Pressable
            style={[styles.modalOverlay, { backgroundColor: theme === "light" ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.6)" }]}
            onPress={() => setDropdownVisible(false)}
          >
            <View style={[styles.dropdown, { backgroundColor: paperTheme.colors.surface }]}>
              <Pressable style={styles.dropdownButton} onPress={() => { toggleTheme(); setDropdownVisible(false); }}>
                <Text style={[styles.dropdownText, { color: paperTheme.colors.onSurface }]}>Сменить тему</Text>
              </Pressable>
              <Pressable style={styles.dropdownButton} onPress={() => { logout(); setDropdownVisible(false); }}>
                <Text style={[styles.dropdownText, { color: paperTheme.colors.onSurface }]}>Выйти</Text>
              </Pressable>
            </View>
          </Pressable>
        </Modal>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  modalOverlay: { flex: 1, justifyContent: "flex-end" },
  dropdown: { paddingVertical: 12, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  dropdownButton: { paddingVertical: 14, paddingHorizontal: 20 },
  dropdownText: { fontSize: 16 },
});