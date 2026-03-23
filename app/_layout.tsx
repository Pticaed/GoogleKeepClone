import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { Stack } from 'expo-router';
import { Text, View } from "react-native";
import migrations from "../drizzle/migrations";
import { db } from "../src/db/client";

export default function RootLayout() {
    const { success, error } = useMigrations(db, migrations);

    if (error) return <View><Text>migration error: {error.message}</Text></View>;
    if (!success) return <View><Text>migration in progress...</Text></View>;

    return (
        <Stack />
    );
}