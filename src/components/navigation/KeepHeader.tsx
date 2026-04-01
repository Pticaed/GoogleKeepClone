// KeepHeader.tsx
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useTheme } from "react-native-paper"; // <-- важно!

export default function KeepHeader({ onSettingsPress }: { onSettingsPress: () => void }) {
  const { colors } = useTheme(); // берем цвета из темы
  const [searchText, setSearchText] = useState("");

  const styles = StyleSheet.create({
    wrapper: {
      flexDirection: "row",
      backgroundColor: colors.background,
      borderColor: colors.surface,
      borderBottomWidth: 1,
      height: 64,
      paddingHorizontal: 8,
      alignItems: "center",
      justifyContent: "space-between",
    },
    leftSection: { flexDirection: "row", alignItems: "center" },
    logoContainer: { flexDirection: "row", alignItems: "center", marginLeft: 4 },
    logoIcon: { width: 40, height: 40, resizeMode: "contain" },
    logoText: { fontSize: 22, color: colors.onSurface, marginLeft: 4 },
    searchContainer: { flex: 1, marginHorizontal: 20 },
    searchBar: {  
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderRadius: 8,
      height: 48,
      paddingHorizontal: 12,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: colors.onSurface,
      ...Platform.select({ web: { outlineStyle: "none" } }),
    },
    rightSection: { flexDirection: "row", alignItems: "center" },
    sideIcon: { marginHorizontal: 10 },
    iconButton: { padding: 10 },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      marginLeft: 10,
    },
  });

  return (
    <View style={styles.wrapper}>
      <View style={styles.leftSection}>
        <Pressable style={styles.iconButton}>
          <Ionicons name="menu" size={24} color={colors.onSurface} />
        </Pressable>

        <View style={styles.logoContainer}>
          <Image
            source={{
              uri: "https://www.gstatic.com/images/branding/product/1x/keep_2020q4_48dp.png",
            }}
            style={styles.logoIcon}
          />
          <Text style={styles.logoText}>Keep</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={colors.onSurface} />
          <TextInput
            style={styles.input}
            placeholder="Поиск"
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <Ionicons
              name="close"
              size={22}
              color={colors.onSurface}
              onPress={() => setSearchText("")}
            />
          )}
        </View>
      </View>

      <View style={styles.rightSection}>
        <Ionicons name="refresh" size={24} color={colors.onSurface} style={styles.sideIcon} />
        <Ionicons
          name="settings-outline"
          size={22}
          color={colors.onSurface}
          style={styles.sideIcon}
          onPress={onSettingsPress}
        />
        <MaterialCommunityIcons name="apps" size={24} color={colors.onSurface} style={styles.sideIcon} />
        <Pressable style={styles.avatar}>
          <Text style={{ color: "#fff", fontSize: 12 }}>U</Text>
        </Pressable>
      </View>
    </View>
  );
}