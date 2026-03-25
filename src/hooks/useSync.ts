import { useState } from "react";
import { mockApi } from "../api/mockApi";
import { db } from "../db/client";
import { notes } from "../db/schema";

export const useSync = () => {
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncProblem, setSyncProblem] = useState(false);

    const syncData = async () => {
        try {
            setIsSyncing(true);

            const localNotes = await db.select().from(notes);
            const remoteNotes = await mockApi.getNotes();

            for (const localNote of localNotes) {
                const existsOnServer = remoteNotes.find((r) => r.id === localNote.id);

                if (existsOnServer) {
                    await mockApi.syncNote(localNote);
                } else {
                    await mockApi.createNote(localNote);
                }
            }

            console.log("sync completed");
        }
        catch (error) {
            setSyncProblem(true);
            console.log("error during sync:", error);
        }
        finally {
            setIsSyncing(false);
        }
    };

    return { syncData, isSyncing, syncProblem };
};