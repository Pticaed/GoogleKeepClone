import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import { mockApi } from "../api/mockApi";
import { Note, User } from "../db/schema";
import { PendingDel, useSync } from "../hooks/useSync";
import { DbService } from "../services/DbService";
import { SecureStore } from "../services/secureStore";

const isWeb = Platform.OS === "web";
const makeId = () => (typeof crypto !== "undefined" && crypto.randomUUID)
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const Storage = {
    getNotes: async (uid: any) => {
        if (isWeb) {
            const raw = localStorage.getItem("notes");
            return JSON.parse(raw || "[]").filter((n: any) => String(n.user_id) === String(uid));
        }
        return (await DbService.getNotes()).filter(n => String(n.user_id) === String(uid));
    },
    saveNote: async (n: Note) => {
        if (isWeb) {
            const all = JSON.parse(localStorage.getItem("notes") || "[]");
            localStorage.setItem("notes", JSON.stringify([...all, n]));
        } else await DbService.insNote(n);
    },
    updNote: async (tid: string, n: Note) => {
        if (isWeb) {
            const all = JSON.parse(localStorage.getItem("notes") || "[]");
            const idx = all.findIndex((x: any) => x.id === tid);
            idx !== -1 ? all[idx] = n : all.push(n);
            localStorage.setItem("notes", JSON.stringify(all));
        } else {
            await DbService.delNote(tid);
            await DbService.insNote(n);
        }
    },
    delNote: async (id: string) => {
        if (isWeb) {
            const all = JSON.parse(localStorage.getItem("notes") || "[]");
            localStorage.setItem("notes", JSON.stringify(all.filter((x: any) => x.id !== id)));
        } else await DbService.delNote(id);
    }
};

const Auth = {
    get: async () => {
        if (isWeb) return JSON.parse(localStorage.getItem("user") || "null");
        const pass = await SecureStore.get("user_pass");
        return pass ? (await DbService.getUsers())[0] : null;
    },
    save: async (u: User, p: string) => {
        if (isWeb) localStorage.setItem("user", JSON.stringify(u));
        else {
            await SecureStore.save("user_pass", p);
            await DbService.insUser(u);
        }
    },
    clear: async (uid?: string) => {
        isWeb ? localStorage.removeItem("user") : await SecureStore.remove("user_pass");
    }
};

export const GlobalContext = createContext<any>(undefined);

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setLoading] = useState(true);
    const { syncData, isSyncing, forceOff, setforceOff } = useSync();
    const syncRef = useRef(false);

    useEffect(() => {
        (async () => {
            const savedUser = await Auth.get();
            if (savedUser) {
                setUser(savedUser);
                setNotes(await Storage.getNotes(savedUser.id));
            }
            setLoading(false);
        })();
    }, []);

    useEffect(() => {
        if (!user || forceOff || syncRef.current) return;
        (async () => {
            syncRef.current = true;
            await syncData(user.id);
            setNotes(await Storage.getNotes(user.id));
            syncRef.current = false;
        })();
    }, [user?.id, forceOff]);

    const addNote = async (data: any) => {
        if (!user) return;
        const tid = `temp-${makeId()}`;
        const note = { ...data, user_id: user.id, id: tid, created_at: new Date().toISOString() };

        setNotes(prev => [...prev, note]);
        await Storage.saveNote(note);

        if (!forceOff) {
            try {
                const sn = await mockApi.createNote(note);
                if (sn?.id) {
                    setNotes(prev => prev.map(n => n.id === tid ? sn : n));
                    await Storage.updNote(tid, sn);
                }
            } catch (e) { console.error("Sync error:", e); }
        }
    };

    const removeNote = async (id: string) => {
        if (!user) return;
        setNotes(prev => prev.filter(n => n.id !== id));
        await Storage.delNote(id);
        if (id.startsWith("temp-")) return;
        !forceOff ? await mockApi.delNote(id) : PendingDel.add(String(user.id), id);
    };

    const login = async (u: string, p: string) => {
        setLoading(true);
        try {
            const users = await mockApi.getUsers();
            const found = users.find(x => x.username === u && x.password === p);
            if (!found) return { success: false, error: "Wrong credentials" };

            await Auth.save(found, p);
            const ns = (await mockApi.getNotes()).filter(n => String(n.user_id) === String(found.id));

            if (isWeb) localStorage.setItem("notes", JSON.stringify(ns));
            else {
                for (const n of await DbService.getNotes()) await DbService.delNote(n.id);
                for (const n of ns) await DbService.insNote(n);
            }

            setUser(found);
            setNotes(ns);
            return { success: true };
        } catch (e) { return { success: false }; }
        finally { setLoading(false); }
    };

    const register = async (
    email: string,
    username: string,
    password: string
    ) => {
        setLoading(true);

        try {
            const users = await mockApi.getUsers();

            const exists = users.find(
            u => u.username === username || u.email === email
            );

            if (exists) {
            return { success: false, error: "User already exists" };
            }

            const newUser: User = {
            id: makeId(),
            email,
            username,
            password,
            avatar_url: null,
            theme: "light",
            label_definitions: null,
            created_at: new Date().toISOString(),
            };

            // mock backend
            await mockApi.createUser?.(newUser);

            await Auth.save(newUser, password);

            setUser(newUser);
            setNotes([]);

            return { success: true };
        } catch (e) {
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    return (
        <GlobalContext.Provider value={{
            notes, user, isLoading: isLoading || isSyncing, isOnline: !forceOff,
            forceOff, setforceOff, addNote, removeNote, login, register,
            sync: () => syncData(user?.id),
            logout: async () => {
                await Auth.clear();
                if (isWeb) localStorage.removeItem("notes");
                setUser(null);
                setNotes([]);
            }
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobal = () => useContext(GlobalContext);