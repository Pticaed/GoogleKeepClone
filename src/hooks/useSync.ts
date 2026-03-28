import { useState } from "react";
import { mockApi } from "../api/mockApi";
import { db } from "../db/client";
import { notes as notesTable } from "../db/schema";

export const useSync = () => {
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncProblem, setSyncProblem] = useState(false);

    const syncData = async () => {
        if (!db) return;
        try {
            setIsSyncing(true);
            const localNotes = await db.select().from(notesTable);
            const remoteNotes = await mockApi.getNotes();

            for (const localNote of localNotes) {
                const exists = remoteNotes.find((r: any) => r.id === localNote.id);
                if (exists) {
                    await mockApi.syncNote(localNote as any);
                } else {
                    await mockApi.createNote(localNote as any);
                }
            }
            for (const remoteNote of remoteNotes) {
                const existsLocally = localNotes.find((l) => l.id === remoteNote.id);
                if (!existsLocally) {
                    await db.insert(notesTable).values(remoteNote);
                }
            }
            console.log("sync completed");
        } catch (error) {
            setSyncProblem(true);
            console.error("error during sync:", error);
        } finally {
            setIsSyncing(false);
        }
    };
    return { syncData, isSyncing, syncProblem };
};