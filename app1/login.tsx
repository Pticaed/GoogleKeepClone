import React, { useState } from "react";
import { Image, StyleSheet, View, useWindowDimensions } from "react-native";
import { Button, Surface, Text, TextInput } from "react-native-paper";
import { useAuth } from "../src/context/AuthContext";
import { useRouter } from "expo-router";
import { mockApi } from "../src/api/mockApi";
import { Link } from "expo-router";

export default function LoginScreen() {
  const { login } = useAuth();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(true);

  const handleLogin = async () => {
    if (email.length > 3 && pass.length > 3) {
      try {
        const users = await mockApi.getUsers();
        const user = users.find(u => u.email === email);
        if (user) { login(user); router.replace("/"); } 
        else alert("Користувача не знайдено");
      } catch (e) { alert("Помилка мережі"); }
    } else alert("Введіть коректні дані");
  };

  return (
    <View style={styles.container}>
      <Surface style={[styles.card, { width: width > 500 ? 450 : "90%" }]} elevation={1}>
        <Image source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png" }} style={styles.logo} />
        <Text variant="headlineSmall" style={styles.title}>Вхід</Text>
        <Text style={styles.subtitle}>Використовуйте акаунт Google</Text>
        <View style={{width: "100%"}}>
          <TextInput label="Електронна пошта" mode="outlined" value={email} onChangeText={setEmail} style={styles.input} outlineColor="#dadce0" activeOutlineColor="#1a73e8" />
          <TextInput label="Пароль" mode="outlined" value={pass} onChangeText={setPass} secureTextEntry={show} style={styles.input} outlineColor="#dadce0" activeOutlineColor="#1a73e8" right={<TextInput.Icon icon={show ? "eye" : "eye-off"} onPress={() => setShow(!show)} />} />
          <Text style={styles.linkText}>Забули пароль?</Text>
        </View>
        <Text style={styles.infoText}>Не ваш комп'ютер? Використовуйте режим інкогніто для входу. <Link href="https://support.google.com/accounts/answer/2917834" style={styles.linkText}>Докладніше...</Link></Text>
        <View style={styles.footer}>
          <Button mode="text" onPress={() => router.push("/register")}>Створити акаунт</Button>
          <Button mode="contained" onPress={handleLogin} style={styles.nextButton}>Далі</Button>
        </View>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", justifyContent: "center", alignItems: "center" },
  card: { padding: 40, borderRadius: 8, alignItems: "center", backgroundColor: "#fff", borderWidth: 1, borderColor: "#dadce0" },
  logo: { width: 75, height: 24, marginBottom: 10, resizeMode: 'contain' },
  title: { fontSize: 24, marginBottom: 8 },
  subtitle: { fontSize: 16, marginBottom: 35 },
  input: { marginBottom: 10, backgroundColor: "#fff" },
  linkText: { color: "#1a73e8", fontWeight: "600", fontSize: 14 },
  infoText: { fontSize: 14, color: "#5f6368", lineHeight: 20, marginVertical: 30 },
  footer: { flexDirection: "row", justifyContent: "space-between", width: "100%", alignItems: 'center' },
  nextButton: { backgroundColor: "#1a73e8", borderRadius: 4 }
});