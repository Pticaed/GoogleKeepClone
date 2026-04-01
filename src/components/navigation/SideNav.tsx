// components/navigation/SideNav.tsx
import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router'; // ✅ импортируем оба хука
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Drawer, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SideNav() {
  const [active, setActive] = useState('notes');
  const [activeLabel, setActiveLabel] = useState(true);
  const { width } = useWindowDimensions();
  const { colors } = useTheme();
  const isMobile = width < 768;
  
  // ✅ Безопасное получение router
  const router = useRouter();
  const pathname = usePathname(); // ✅ отслеживаем текущий путь

  // ✅ Синхронизируем active с текущим pathname
  useEffect(() => {
    if (pathname) {
      const current = pathname.replace('/', '') || 'notes';
      setActive(current);
    }
  }, [pathname]);

  // ✅ Защита: если роутер ещё не готов — показываем лоадер
  if (!router || !pathname) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  function drawerItem(label: string, iconName: string, key: string) {
    const isActive = active === key;
    
    return (
      <Drawer.Item
        label={!isMobile && activeLabel ? label : ''}
        active={isActive}
        onPress={() => {
          setActive(key);
          // ✅ Безопасная навигация
          try {
            router.push(`/${key}`);
          } catch (e) {
            console.warn(`Navigation to /${key} failed:`, e);
          }
        }}
        icon={() => <Ionicons name={iconName} size={22} color={colors.onSurface} />}
        style={[
          styles.item,
          { backgroundColor: isActive ? colors.secondaryContainer : 'transparent' },
          isMobile && { width: 55 },
        ]}
        labelStyle={{ color: colors.onSurface }}
      />
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Drawer.Section showDivider={false} style={styles.section}>
        {drawerItem("Заметки", "bulb-outline", "notes")}
        {drawerItem("Напоминания", "notifications-outline", "reminders")}
        {drawerItem("Ярлыки", "bookmark-outline", "labels")}
        {drawerItem("Архив", "archive-outline", "archive")}
        {drawerItem("Корзина", "trash-outline", "trash")}
      </Drawer.Section>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    height: "100%",
    justifyContent: "center", // ✅ центрируем лоадер
  },
  section: {
    marginTop: 12,
    alignSelf: "flex-start",
    height: "100%",
    flexDirection: "column",
  },
  item: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    marginRight: 8,
    marginLeft: 0,
    height: 50,
    justifyContent: "center",
  },
});