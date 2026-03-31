import { Stack } from "expo-router";
import React from 'react';
import { View } from "react-native"; 
import { PaperProvider } from "react-native-paper";
import { AuthProvider, useAuth } from "../src/context/AuthContext";

import KeepHeader from "../src/components/navigation/KeepHeader";
import SideNav from "../src/components/navigation/SideNav";

function RootLayoutContent() {
  const { user } = useAuth();
  
  if (!user) { // Добавлено
    return (
      <Stack key="guest" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />  
      </Stack>
    );
  }

  return (
    <View style={{ flex: 1, flexDirection: 'column' }}>
      <KeepHeader /> 
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <SideNav />

        <View style={{ flex: 1 }}>
          <Stack key="auth" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
          </Stack>
        </View>
      </View>
    </View>
  ); 
} 

export default function RootLayout() { // Обертка для провайдера аутентификации 
  return (
    <AuthProvider>
      <PaperProvider>
        <RootLayoutContent />
      </PaperProvider>
    </AuthProvider>
  );
}