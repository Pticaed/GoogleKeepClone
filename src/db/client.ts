import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import { Platform } from "react-native";
import * as schema from "./schema";

const expoDb = Platform.OS !== "web" ? openDatabaseSync("db.db") : null;

export const db = expoDb ? drizzle(expoDb, { schema }) : null;
export { expoDb };
