import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    password: text("password").notNull(),
    username: text("username").notNull(),
    avatar_url: text("avatar_url"),
    theme: text("theme").default("light"),
    label_definitions: text("label_definitions"),
    created_at: text("created_at").notNull(),
});

export const notes = sqliteTable("notes", {
    id: text("id").primaryKey(),
    user_id: text("user_id").references(() => users.id),
    title: text("title").notNull(),
    content: text("content").notNull(),
    color: text("color").default("#ffffff"),
    is_pinned: integer("is_pinned", { mode: "boolean" }).default(false),
    is_archived: integer("is_archived", { mode: "boolean" }).default(false),
    reminder_at: text("reminder_at"),
    labels: text("labels"),
    checklist: text("checklist"),
    created_at: text("created_at").notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;