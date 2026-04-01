import { GlobalProvider, useGlobal } from "@/context/GlobalContext";
import { Href, Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { MD3LightTheme, PaperProvider } from "react-native-paper";

export default function RootLayout() {
    return (
        <GlobalProvider>
            <InnerLayout />
        </GlobalProvider>
    );
}

function InnerLayout() {
    const { user, isLoading } = useGlobal();
    const segments = useSegments();
    const router = useRouter();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (isLoading) return;
        const segs = segments as string[];
        const inAuthGroup = segs.includes("login") || segs.includes("register");
        
        if (!user && !inAuthGroup) {
            router.replace("/login" as Href);
        } else if (user && inAuthGroup) {
            router.replace("/" as Href);
        }

        setIsReady(true);
    }, [user, segments, isLoading]);

    // Поки йде перевірка або завантаження, не рендеримо нічого, щоб не було "блимання"
    if (isLoading || (!isReady && !user)) return null;

    return (
        <PaperProvider theme={MD3LightTheme}>
            <StatusBar style="dark" />
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="login" />
                <Stack.Screen name="register" />
                <Stack.Screen name="(tabs)" />
            </Stack>
        </PaperProvider>
    );
}