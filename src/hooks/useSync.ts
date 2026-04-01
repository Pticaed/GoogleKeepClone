import { useCallback, useState } from "react";
import { Platform } from "react-native";
import { mockApi } from "../api/mockApi";
import { DbService } from "../services/DbService";

const isWeb = Platform.OS === "web";

const LocalStore = {
    getNotes: async () => {
        if (isWeb) {
            const raw = localStorage.getItem("notes");
            return raw ? JSON.parse(raw) : [];
        }
        return await DbService.getNotes();
    },
    insNote: async (note: any) => {
        if (isWeb) {
            const notes = JSON.parse(localStorage.getItem("notes") || "[]");
            notes.push(note);
            localStorage.setItem("notes", JSON.stringify(notes));
            return note;
        }
        return await DbService.insNote(note);
    },
    updNote: async (id: string, updates: any) => {
        if (isWeb) {
            const notes = JSON.parse(localStorage.getItem("notes") || "[]");
            const idx = notes.findIndex((n: any) => String(n.id) === String(id));
            if (idx !== -1) notes[idx] = { ...notes[idx], ...updates };
            localStorage.setItem("notes", JSON.stringify(notes));
            return notes[idx] ?? null;
        }
        return await DbService.updNote(id, updates);
    },
    delNote: async (id: string) => {
        if (isWeb) {
            const notes = JSON.parse(localStorage.getItem("notes") || "[]");
            localStorage.setItem("notes", JSON.stringify(
                notes.filter((n: any) => String(n.id) !== String(id))
            ));
            return;
        }
        return await DbService.delNote(id);
    },
};

const mobileQueue: Record<string, string[]> = {};
const PENDING_KEY = (userId: string) => `pending_deletions:${userId}`;

export const PendingDel = {
    get: (userId: string): string[] => {
        if (isWeb) {
            const raw = localStorage.getItem(PENDING_KEY(userId));
            return raw ? JSON.parse(raw) : [];
        }
        return mobileQueue[userId] ?? [];
    },
    add: (userId: string, noteId: string) => {
        const queue = PendingDel.get(userId);
        if (!queue.includes(noteId)) {
            queue.push(noteId);
            if (isWeb) localStorage.setItem(PENDING_KEY(userId), JSON.stringify(queue));
            else mobileQueue[userId] = queue;
        }
    },
    remove: (userId: string, noteId: string) => {
        const queue = PendingDel.get(userId).filter((id) => String(id) !== String(noteId));
        if (isWeb) localStorage.setItem(PENDING_KEY(userId), JSON.stringify(queue));
        else mobileQueue[userId] = queue;
    },
    clear: (userId: string) => {
        if (isWeb) localStorage.removeItem(PENDING_KEY(userId));
        else delete mobileQueue[userId];
    },
};

export const useSync = () => {
    const [isSyncing, setIsSyncing] = useState(false);
    const [forceOff, setforceOff] = useState(false);

    const syncData = useCallback(async (userId?: string | number): Promise<void> => {
        if (forceOff || !userId) return;
        setIsSyncing(true);
        try {
            const currentUserId = String(userId);
            const localNotes = await LocalStore.getNotes();
            const userLocal = localNotes.filter(
                (n: any) => String(n.user_id) === currentUserId
            );

            for (const temp of userLocal.filter((n: any) => String(n.id).startsWith("temp-"))) {
                const { id: tempId, ...payload } = temp;
                try {
                    const serverNote = await mockApi.createNote({
                        ...payload,
                        id: undefined,
                        user_id: currentUserId,
                    });
                    await LocalStore.delNote(tempId);
                    await LocalStore.insNote({ ...serverNote, user_id: currentUserId });
                } catch (e) { console.error(e); }
            }

            for (const id of PendingDel.get(currentUserId)) {
                try {
                    await mockApi.delNote(id);
                    PendingDel.remove(currentUserId, id);
                } catch (e) { console.error(e); }
            }

            const allRemote = await mockApi.getNotes();
            const userRemote = allRemote.filter(
                (n) => String(n.user_id) === currentUserId
            );
            const remoteIds = new Set(userRemote.map((rn) => String(rn.id)));
            const freshLocal = await LocalStore.getNotes();

            for (const ln of freshLocal) {
                const lid = String(ln.id);
                if (
                    String(ln.user_id) === currentUserId &&
                    !lid.startsWith("temp-") &&
                    !remoteIds.has(lid)
                ) {
                    await LocalStore.delNote(lid);
                }
            }

            for (const rn of userRemote) {
                const noteToSave = { ...rn, user_id: currentUserId };
                const existing = freshLocal.find(
                    (ln: any) => String(ln.id) === String(rn.id)
                );
                if (!existing) await LocalStore.insNote(noteToSave);
                else await LocalStore.updNote(String(rn.id), noteToSave);
            }
        } catch (error) {
            console.error("sync failed:", error);
        } finally {
            setIsSyncing(false);
        }
    }, [forceOff]);

    return { syncData, isSyncing, forceOff, setforceOff };
};  