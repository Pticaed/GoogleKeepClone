import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import { mockApi } from "../api/mockApi";
import { Note, User } from "../db/schema";
import { PendingDel, useSync } from "../hooks/useSync";
import { DbService } from "../services/DbService";
import { SecureStore } from "../services/secureStore";

const isWeb = Platform.OS === "web";

const ls = {
  get:    (k: string) => JSON.parse(localStorage.getItem(k) || "null"),
  set:    (k: string, v: any) => localStorage.setItem(k, JSON.stringify(v)),
  del:    (k: string) => localStorage.removeItem(k),
};

const Storage = {
  getNotes: async (uid: string) => {
    const all = isWeb ? (ls.get("notes") ?? []) : await DbService.getNotes();
    return all.filter((n: any) => String(n.user_id) === String(uid));
  },
  saveNote: async (n: Note) => isWeb
    ? ls.set("notes", [...(ls.get("notes") ?? []), n])
    : DbService.insNote(n),
  updNote: async (id: string, n: Note) => {
    if (isWeb) {
      const all = ls.get("notes") ?? [];
      const i = all.findIndex((x: any) => String(x.id) === String(id));
      if (i !== -1) { all[i] = n; ls.set("notes", all); }
    } else await DbService.updNote(id, n);
  },
  delNote: async (id: string) => isWeb
    ? ls.set("notes", (ls.get("notes") ?? []).filter((x: any) => String(x.id) !== String(id)))
    : DbService.delNote(id),
};

const Auth = {
  get:   async () => isWeb ? ls.get("user") : (await SecureStore.get("user_pass") ? (await DbService.getUsers())[0] : null),
  save:  async (u: User, p: string) => isWeb ? ls.set("user", u) : (await SecureStore.save("user_pass", p), await DbService.insUser(u)),
  clear: async () => isWeb ? ls.del("user") : SecureStore.remove("user_pass"),
};

export const GlobalContext = createContext<any>(undefined);

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [notes, setNotes]       = useState<Note[]>([]);
  const [user,  setUser]        = useState<User | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [isAuthLoading, setAuthLoading] = useState(false);
  const { syncData, isSyncing, forceOff, setforceOff } = useSync();
  const syncRef = useRef(false);
  const [isSettingsModal, setSettingsModal] = useState(false);

  const theme: "light" | "dark" = user?.theme ?? "light";

  useEffect(() => {
    (async () => {
      const u = await Auth.get();
      if (u) { setUser(u); setNotes(await Storage.getNotes(u.id)); }
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
    const tid  = `temp-${Date.now()}`;
    const note = { ...data, user_id: user.id, id: tid, created_at: new Date().toISOString() };
    setNotes(p => [...p, note]);
    await Storage.saveNote(note);
    if (!forceOff) {
      try {
        const sn = await mockApi.createNote({ ...note, id: undefined });
        if (sn?.id) {
          const synced = { ...sn, user_id: user.id };
          setNotes(p => p.map(n => n.id === tid ? synced : n));
          await Storage.delNote(tid);
          await Storage.saveNote(synced);
        }
      } catch (e) { console.error(e); }
    }
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    if (!user) return;
    setNotes(p => p.map(n => String(n.id) === String(id) ? { ...n, ...updates } : n));
    const cur = notes.find(n => String(n.id) === String(id));
    if (cur) await Storage.updNote(id, { ...cur, ...updates });
    if (!forceOff) try { await mockApi.updNote(id, updates); } catch (e) { console.error(e); }
  };

  const removeNote = async (id: string) => {
    if (!user) return;
    setNotes(p => p.filter(n => String(n.id) !== String(id)));
    await Storage.delNote(id);
    !forceOff ? await mockApi.delNote(id) : PendingDel.add(String(user.id), id);
  };

  const archiveNote = (id: string) => {
    const n = notes.find(n => String(n.id) === String(id));
    if (n) updateNote(id, { is_archived: !n.is_archived });
  };

  const pinNote = (id: string) => {
    const n = notes.find(n => String(n.id) === String(id));
    if (n) updateNote(id, { is_pinned: !n.is_pinned });
  };

  const toggleTheme = async () => {
    if (!user) return;
    const newTheme = user.theme === "light" ? "dark" : "light";
    const updated  = await mockApi.updateUser(user.id, { theme: newTheme });
    await Auth.save(updated, user.password);
    setUser(updated);
  };

  const login = async (username: string, pass: string) => {
    setAuthLoading(true);
    try {
      const found = (await mockApi.getUsers()).find(u => u.username === username && u.password === pass);
      if (!found) return { success: false, error: "Неправильний логін або пароль" };
      await Auth.save(found, pass);
      setUser(found);
      setNotes(await Storage.getNotes(found.id));
      return { success: true };
    } catch { return { success: false, error: "Помилка сервера" }; }
    finally { setAuthLoading(false); }
  };

  const register = async (email: string, username: string, password: string) => {
    setAuthLoading(true);
    try {
      const users = await mockApi.getUsers();
      if (users.find(u => u.username === username || u.email === email))
        return { success: false, error: "Користувач вже існує" };
      const nextId = users.length ? Math.max(...users.map(u => parseInt(u.id) || 0)) + 1 : 1;
      const newUser: User = { id: nextId.toString(), email, username, password, avatar_url: null, theme: "light", label_definitions: null, created_at: new Date().toISOString() };
      await mockApi.createUser?.(newUser);
      await Auth.save(newUser, password);
      setUser(newUser);
      setNotes([]);
      return { success: true };
    } catch { return { success: false }; }
    finally { setAuthLoading(false); }
  };

  return (
    <GlobalContext.Provider value={{
      notes, user, isLoading, isAuthLoading: isAuthLoading || isSyncing,
      isOnline: !forceOff, forceOff, setforceOff,
      addNote, updateNote, removeNote, archiveNote, pinNote,
      login, register,
      logout: async () => { await Auth.clear(); if (isWeb) ls.del("notes"); setUser(null); setNotes([]); },
      isSettingsModal, setSettingsModal, theme, toggleTheme,
      sync: async () => {
        if (!user || syncRef.current) return;
        syncRef.current = true;
        await syncData(user.id);
        setNotes(await Storage.getNotes(user.id));
        syncRef.current = false;
      },
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => useContext(GlobalContext);