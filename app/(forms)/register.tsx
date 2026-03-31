import { useGlobal } from "@/context/GlobalContext";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

export default function RegisterScreen() {
  const { register, isLoading } = useGlobal();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validate = () => {
    if (!email.trim() || !username.trim() || !password) {
      setError("Всі поля обов'язкові");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Некоректний email");
      return false;
    }

    if (username.trim().length < 3) {
      setError("Ім'я користувача має бути мінімум 3 символи");
      return false;
    }

    if (password.length < 6) {
      setError("Пароль має бути мінімум 6 символів");
      return false;
    }

    setError("");
    return true;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    const res = await register(email.trim(), username.trim(), password);

    if (!res.success) {
      setError(res.error || "Реєстрація не вдалася");
    } else {
      // После успешной регистрации → переходим на Login
      router.push("/login");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Створити акаунт</Text>
      <Text style={styles.subtitle}>Зареєструйтесь у Google Keep</Text>

      <View style={styles.form}>
        <TextInput
          placeholder="Email"
          placeholderTextColor="#5f6368"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Username"
          placeholderTextColor="#5f6368"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#5f6368"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable style={styles.button} onPress={handleRegister}>
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Зареєструватися</Text>}
        </Pressable>

        {/* Переход на логин */}
        <Pressable onPress={() => router.push("/login")} style={styles.linkButton}>
          <Text style={styles.linkText}>Є аккаунт? Увійти</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", paddingHorizontal: 24 },
  title: { fontSize: 24, fontWeight: "500", color: "#202124" },
  subtitle: { fontSize: 14, color: "#5f6368", marginBottom: 32, marginTop: 4 },
  form: { width: "100%", maxWidth: 360 },
  input: { height: 52, borderWidth: 1, borderColor: "#dadce0", borderRadius: 8, paddingHorizontal: 14, fontSize: 16, color: "#202124", marginBottom: 14, backgroundColor: "#fff" },
  button: { height: 44, backgroundColor: "#1a73e8", borderRadius: 6, justifyContent: "center", alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontSize: 14, fontWeight: "500" },
  linkButton: { marginTop: 14, alignItems: "center" },
  linkText: { color: "#1a73e8", fontSize: 14, fontWeight: "500" },
  error: { color: "#d93025", fontSize: 13, marginBottom: 10, textAlign: "center" },
});