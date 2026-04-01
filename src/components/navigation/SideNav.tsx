import { Ionicons } from '@expo/vector-icons';
import { Href, usePathname, useRouter } from 'expo-router';
import React, { ComponentProps, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Drawer, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SideNav() {
    const [active, setActive] = useState('notes');
    const { width } = useWindowDimensions();
    const { colors } = useTheme();
    const isMobile = width < 768;

    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (pathname) {
            const current = pathname.replace('/', '') || 'notes';
            setActive(current);
        }
    }, [pathname]);

    if (!router || !pathname) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <ActivityIndicator color={colors.primary} />
            </View>
        );
    }

    function drawerItem(
        label: string,
        iconName: ComponentProps<typeof Ionicons>['name'],
        key: string
    ) {
        const isActive = active === key;

        return (
            <Drawer.Item
                label={!isMobile ? label : ''}
                active={isActive}
                onPress={() => {
                    setActive(key);
                    try {
                        router.push(`/${key}` as Href);
                    } catch (e) {
                        console.warn(e);
                    }
                }}
                icon={({ size, color }) => (
                    <Ionicons name={iconName} size={size || 22} color={color} />
                )}
                style={[
                    styles.item,
                    { backgroundColor: isActive ? colors.secondaryContainer : 'transparent' },
                    isMobile && { width: 55 },
                ]}
            />
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <Drawer.Section showDivider={false} style={styles.section}>
                {drawerItem("Заметки", "bulb-outline", "")}
                {drawerItem("Напоминания", "notifications-outline", "reminders")}
                {drawerItem("Архив", "archive-outline", "archive")}
            </Drawer.Section>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        height: "100%",
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