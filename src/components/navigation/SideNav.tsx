import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { Drawer } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function SideNav() {
    const [active, setActive] = useState('notes');
    const [activeLabel, setActiveLabel] = useState(true);
    const { width } = useWindowDimensions();
    const isMobile = width < 768;
    
    const router = useRouter();
    function drawerItem(label: string, iconName: string, key: string) {
        return (
            <Drawer.Item    
                label={!isMobile && activeLabel ? label : ''}
                active={active === key}
                onPress={() => {setActive(key); router.push(`/${key}`);}}
                icon={() => <Ionicons name={iconName} size={22} color="#202124" />}
                style={[styles.item, active === key && styles.activeItem, isMobile && { width: 55}]}
                theme={{ colors: { secondaryContainer: '#feefc3' } }} 
            />
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Drawer.Section showDivider={false} style={styles.section} >
                {drawerItem("Заметки", "bulb-outline", "notes")}
                {drawerItem("Напоминания", "notifications-outline", "reminders")}
                {drawerItem("Изменение ярлыков", "pencil-outline", "labels")}
                {drawerItem("Архив", "archive-outline", "archive")}
                {drawerItem("Корзина", "trash-outline", "trash")}
            </Drawer.Section>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#fff',
        
    },
    section: {
        marginTop: 12,
        alignSelf: 'flex-start',
        height: '100%',
        flexDirection: 'column',
    },
    item: {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
        marginRight: 8,
        marginLeft: 0,
        height: 50,
        justifyContent: 'center',
    },
    activeItem: {
        backgroundColor: '#feefc3',
    }
});