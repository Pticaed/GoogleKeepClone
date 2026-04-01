import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";
import { useAuth } from "../src/context/AuthContext";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function Home() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user]);

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Аккаунт: {user?.email || "Вошли!"}</Text>
      <Button 
        mode="contained" 
        onPress={() => logout()} 
        style={styles.button}
      >
        ВЫЙТИ ИЗ СИСТЕМЫ
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  button: { marginTop: 20, backgroundColor: "#d93025" }
});