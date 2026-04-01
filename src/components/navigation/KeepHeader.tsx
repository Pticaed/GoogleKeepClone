import { useGlobal } from "@/context/GlobalContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "react-native-paper";

export default function KeepHeader({ onSettingsPress }: { onSettingsPress: () => void }) {
    const { colors } = useTheme();
    const { sync, isAuthLoading, user } = useGlobal();

    return (
        <View style={[styles.wrapper, { backgroundColor: colors.background, borderColor: colors.surface }]}>
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
                    <Text style={[styles.logoText, { color: colors.onSurface }]}>Keep</Text>
                </View>
            </View>

            <View style={styles.rightSection}>
                <Pressable onPress={sync} disabled={isAuthLoading} style={styles.iconButton}>
                    {isAuthLoading ? (
                        <ActivityIndicator size="small" color={colors.onSurface} />
                    ) : (
                        <Ionicons name="refresh" size={24} color={colors.onSurface} />
                    )}
                </Pressable>

                <Pressable onPress={onSettingsPress} style={styles.iconButton}>
                    <Ionicons name="settings-outline" size={22} color={colors.onSurface} />
                </Pressable>

                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {user?.username?.charAt(0).toUpperCase() || "U"}
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: "row",
        borderBottomWidth: 1,
        height: 64,
        paddingHorizontal: 8,
        alignItems: "center",
        justifyContent: "space-between",
    },
    leftSection: { flexDirection: "row", alignItems: "center" },
    logoContainer: { flexDirection: "row", alignItems: "center", marginLeft: 4 },
    logoIcon: { width: 40, height: 40 },
    logoText: { fontSize: 22, marginLeft: 4 },
    rightSection: { flexDirection: "row", alignItems: "center" },
    iconButton: { padding: 10 },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#888",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 10,
    },
    avatarText: { color: "#fff", fontSize: 12 },
});