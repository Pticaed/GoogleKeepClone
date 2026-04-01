import React, { useState } from "react";
import { Image, StyleSheet, View, useWindowDimensions } from "react-native";
import { Button, Surface, Text, TextInput } from "react-native-paper";
import { useAuth } from "../src/context/AuthContext";
import { useRouter } from "expo-router";
import { mockApi } from "../src/api/mockApi";

export default function RegisterScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const handleRegister = async () => {
    if (email.includes("@") && pass.length > 5) {
      try {
        const newUser = await mockApi.createUser({ email, password: pass });
        // name: firstName || email.split('@')[0], - нету поля в schema
        login(newUser); 
        router.replace("/");
      } catch (e) { alert("Помилка створення акаунта"); }
    } else alert("Заповніть поля (пароль від 6 символів)");
  };

  return (
    <View style={styles.container}>
      <Surface style={[styles.card, { width: width > 500 ? 450 : "90%" }]} elevation={1}>
        <Image source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png" }} style={styles.logo} />
        <Text variant="headlineSmall" style={styles.title}>Створення акаунта Google</Text>
        <Text style={styles.subtitle}>Введіть ваші дані</Text>
        <View style={{width: "100%"}}>
          <TextInput label="Ім'я" mode="outlined" value={name} onChangeText={setName} style={styles.input} outlineColor="#dadce0" activeOutlineColor="#1a73e8" />
          <TextInput label="Електронна пошта" mode="outlined" value={email} onChangeText={setEmail} style={styles.input} outlineColor="#dadce0" activeOutlineColor="#1a73e8" />
          <TextInput label="Пароль" mode="outlined" secureTextEntry value={pass} onChangeText={setPass} style={styles.input} outlineColor="#dadce0" activeOutlineColor="#1a73e8" />
        </View>
        <View style={styles.footer}>
          <Button mode="text" onPress={() => router.push("/login")}>Увійти замість цього</Button>
          <Button mode="contained" onPress={handleRegister} style={styles.nextButton}>Готово</Button>
        </View>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", justifyContent: "center", alignItems: "center" },
  card: { padding: 40, borderRadius: 8, alignItems: "center", backgroundColor: "#fff", borderWidth: 1, borderColor: "#dadce0" },
  logo: { width: 75, height: 24, marginBottom: 10, resizeMode: 'contain' },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, marginBottom: 30 },
  input: { marginBottom: 10, backgroundColor: "#fff" },
  footer: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: 20, alignItems: 'center' },
  nextButton: { backgroundColor: "#1a73e8", borderRadius: 4 }
});