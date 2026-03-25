import { Note, User } from "../db/schema";

const BASE_URL = "https://69bd6d002bc2a25b22ae8c67.mockapi.io/api/v1";

export const mockApi = {
    getUsers: async (): Promise<User[]> => {
        const res = await fetch(`${BASE_URL}/users`);
        if (!res.ok) console.log("failed to fetch users");
        return await res.json();
    },

    createUser: async (user: Partial<User>): Promise<User> => {
        const res = await fetch(`${BASE_URL}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        });
        if (!res.ok) console.log("failed to create user");
        return await res.json();
    },

    updateUser: async (id: string, updates: Partial<User>): Promise<User> => {
        const res = await fetch(`${BASE_URL}/users/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates)
        });
        if (!res.ok) console.log("failed to update user");
        return await res.json();
    },

    deleteUser: async (id: string): Promise<void> => {
        const res = await fetch(`${BASE_URL}/users/${id}`, {
            method: "DELETE"
        });
        if (!res.ok) console.log("failed to delete user");
    },

    getNotes: async (): Promise<Note[]> => {
        const res = await fetch(`${BASE_URL}/notes`);
        if (!res.ok) console.log("failed to fetch notes");
        return await res.json();
    },

    syncNote: async (note: Note): Promise<Note> => {
        const res = await fetch(`${BASE_URL}/notes/${note.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(note)
        });
        if (!res.ok) console.log("failed to sync note");
        return await res.json();
    },

    updateNote: async (id: string, updates: Partial<Note>): Promise<Note> => {
        const res = await fetch(`${BASE_URL}/notes/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates)
        });
        if (!res.ok) console.log("failed to update note");
        return await res.json();
    },

    deleteNote: async (id: string): Promise<void> => {
        const res = await fetch(`${BASE_URL}/notes/${id}`, {
            method: "DELETE"
        });
        if (!res.ok) console.log("failed to delete note");
    },

    createNote: async (note: Partial<Note>): Promise<Note> => {
        const res = await fetch(`${BASE_URL}/notes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(note)
        });
        if (!res.ok) console.log("failed to create note");
        return await res.json();
    }
};