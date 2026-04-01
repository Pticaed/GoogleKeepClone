import { useGlobal } from '@/context/GlobalContext';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';

export default function NotFound({ onGoHome, onSearch }: { 
  onGoHome?: () => void;
  onSearch?: (query: string) => void;
}) {
  const { theme } = useGlobal();
  const isDark = theme === 'dark';
  
  const bg = isDark ? '#202124' : '#ffffff';
  const textColor = isDark ? '#e8eaed' : '#202124';
  const subText = isDark ? '#9aa0a6' : '#5f6368';
  const inputBg = isDark ? '#303134' : '#f1f3f4';
  
  // Google colors for subtle accents
  const googleColors = {
    blue: '#4285f4',
    red: '#ea4335',
    yellow: '#fbbc04',
    green: '#34a853',
  };

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      {/* Google-style "404" з кольоровими літерами */}
      <View style={styles.logoContainer}>
        <Text style={[styles.logo, { color: googleColors.blue }]}>G</Text>
        <Text style={[styles.logo, { color: googleColors.red }]}>o</Text>
        <Text style={[styles.logo, { color: googleColors.yellow }]}>o</Text>
        <Text style={[styles.logo, { color: googleColors.blue }]}>g</Text>
        <Text style={[styles.logo, { color: googleColors.green }]}>l</Text>
        <Text style={[styles.logo, { color: googleColors.red }]}>e</Text>
      </View>
      
      <Text style={[styles.errorCode, { color: textColor }]}>404</Text>
      
      <Text style={[styles.title, { color: textColor }]}>
        Сторінку не знайдено
      </Text>
      <Pressable 
        style={styles.textButton} 
        onPress={onGoHome}
      >
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logoContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  logo: {
    fontSize: 32,
    fontWeight: '400',
    letterSpacing: -1,
  },
  errorCode: {
    fontSize: 64,
    fontWeight: '400',
    marginBottom: 8,
    letterSpacing: -3,
  },
  title: {
    fontSize: 20,
    fontWeight: '400',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 20,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: '100%',
    maxWidth: 500,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  textButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  textButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});