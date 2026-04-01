import { useGlobal } from "@/context/GlobalContext";
import { Href, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Keyboard,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";

export default function LoginScreen() {
    const { login, isAuthLoading } = useGlobal();
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleInputChange = (text: string, type: 'user' | 'pass') => {
        if (error) setError("");
        if (type === 'user') setUsername(text);
        else setPassword(text);
    };

    const validate = () => {
        if (!username.trim() || !password) {
            setError("Всі поля обов'язкові");
            return false;
        }
        return true;
    };

    const handleLogin = async () => {
        Keyboard.dismiss();

        if (!validate()) return;
        
        const res = await login(username.trim(), password);
        
        if (!res || !res.success) {
            setError(res?.error || "Невірний логін або пароль");
            return;
        } 

        router.replace("/" as Href);
    };

    const navigateToRegister = () => {
        Keyboard.dismiss();

        // используем replace вместо push
        router.replace("/register" as Href);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Увійти</Text>
            <Text style={styles.subtitle}>Введіть ваші дані для входу</Text>

            <View style={styles.form}>
                <TextInput
                    placeholder="Username"
                    placeholderTextColor="#5f6368"
                    value={username}
                    onChangeText={(t) => handleInputChange(t, 'user')}
                    style={[styles.input, error ? { borderColor: '#d93025' } : null]}
                    autoCapitalize="none"
                />

                <TextInput
                    placeholder="Password"
                    placeholderTextColor="#5f6368"
                    secureTextEntry
                    value={password}
                    onChangeText={(t) => handleInputChange(t, 'pass')}
                    style={[styles.input, error ? { borderColor: '#d93025' } : null]}
                />

                {error ? <Text style={styles.error}>{error}</Text> : null}

                <Pressable 
                    style={[styles.button, isAuthLoading && { opacity: 0.7 }]} 
                    onPress={handleLogin}
                    disabled={isAuthLoading}
                >
                    {isAuthLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Увійти</Text>
                    )}
                </Pressable>

                <Pressable onPress={navigateToRegister} style={styles.linkButton}>
                    <Text style={styles.linkText}>Немає аккаунту? Зареєструватися</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: "#fff", 
        justifyContent: "center", 
        alignItems: "center", 
        paddingHorizontal: 24 
    },
    title: { fontSize: 24, fontWeight: "500", color: "#202124" },
    subtitle: { fontSize: 14, color: "#5f6368", marginBottom: 32, marginTop: 4 },
    form: { width: "100%", maxWidth: 360 },
    input: { 
        height: 52, 
        borderWidth: 1, 
        borderColor: "#dadce0", 
        borderRadius: 8, 
        paddingHorizontal: 14, 
        fontSize: 16, 
        color: "#202124", 
        marginBottom: 14, 
        backgroundColor: "#fff" 
    },
    button: { 
        height: 44, 
        backgroundColor: "#1a73e8", 
        borderRadius: 6, 
        justifyContent: "center", 
        alignItems: "center", 
        marginTop: 10 
    },
    buttonText: { color: "#fff", fontSize: 14, fontWeight: "500" },
    linkButton: { marginTop: 14, alignItems: "center" },
    linkText: { color: "#1a73e8", fontSize: 14, fontWeight: "500" },
    error: { 
        color: "#d93025", 
        fontSize: 13, 
        marginBottom: 10, 
        textAlign: "center",
        fontWeight: '500'
    },
});
