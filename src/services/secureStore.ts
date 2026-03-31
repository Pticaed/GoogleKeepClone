import * as ESecureStore from "expo-secure-store";
import { Platform } from "react-native";

const isWeb = Platform.OS === "web";

export const SecureStore = {
    save: async (key: string, value: string) => {
        if (isWeb) {
            localStorage.setItem(key, value);
            return;
        }
        return await ESecureStore.setItemAsync(key, value);
    },
    get: async (key: string) => {
        if (isWeb) {
            return localStorage.getItem(key);
        }
        return await ESecureStore.getItemAsync(key);
    },
    remove: async (key: string) => {
        if (isWeb) {
            localStorage.removeItem(key);
            return;
        }
        return await ESecureStore.deleteItemAsync(key);
    },
};