import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import { Platform } from "react-native";
import * as schema from "./schema";

const createDb = () => {
    if (Platform.OS === "web") {
        return { db: null as any, expoDb: null as any };
    }
    const expoDb = openDatabaseSync("db.db");
    const db = drizzle(expoDb, { schema });
    return { db, expoDb };
};

export const { db, expoDb } = createDb();