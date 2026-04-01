// app/_layout.tsx
import { GlobalProvider } from "@/context/GlobalContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MD3LightTheme, PaperProvider } from "react-native-paper";

export default function RootLayout() {
  return (
    <GlobalProvider>
      <InnerLayout />
    </GlobalProvider>
  );
}

function InnerLayout() {
  // Здесь можно использовать useGlobal() если нужно
  const theme = MD3LightTheme; // или получайте из контекста

  return (
    <PaperProvider theme={theme}>
      <StatusBar style={theme.dark ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </PaperProvider>
  );
}