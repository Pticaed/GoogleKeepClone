import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { notes, users } from "../db/schema";

export const DbService = {
    getNotes: async () => {
        if (!db) return [];
        return await db.query.notes.findMany() || [];
    },
    insNote: async (note: any) => {
        if (!db) return null;
        return await db.insert(notes).values(note).returning();
    },
    updNote: async (id: string, updates: any) => {
        if (!db) return null;
        return await db.update(notes)
            .set(updates)
            .where(eq(notes.id, id))
            .returning();
    },
    delNote: async (id: string) => {
        if (!db) return;
        await db.delete(notes).where(eq(notes.id, id));
    },

    getUsers: async () => {
        if (!db) return [];
        return await db.query.users.findMany() || [];
    },
    insUser: async (user: any) => {
        if (!db) return null;
        return await db.insert(users).values(user).returning();
    },
    delUser: async (id: string) => {
        if (!db) return;
        await db.delete(users).where(eq(users.id, id));
    }
};