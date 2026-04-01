// app/(tabs)/notes.tsx

import NoteCard from "@/components/NoteCard";
import GoogleKeepNote from "@/components/notes/noteInput";
import { useGlobal } from "@/context/GlobalContext";
import React, { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

export default function NotesScreen() {
  const { theme, notes, addNote, removeNote } = useGlobal();
  const isDark = theme === "dark";
  
  const colors = isDark
    ? { bg: "#121212", surface: "#1e1e1e", text: "#fff", inputBg: "#2a2a2a", border: "#555" } 
    : { bg: "#fff", surface: "#f5f5f5", text: "#202124", inputBg: "#fff", border: "#ddd" };
  
  const [selected, setSelected] = useState<any>(null);
  const [editText, setEditText] = useState("");
  const [editTitle, setEditTitle] = useState("");

  // Фильтруем: только активные заметки (не архив, не корзина)
  const visibleNotes = notes.filter((note: any) => 
    !note.is_archived && !note.is_deleted
  );

  const handleArchive = async (id: string) => {
    const note = notes.find((n: any) => n.id === id);
    if (note) {
      await addNote({ ...note, is_archived: true, updated_at: new Date().toISOString() });
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert("Удалить заметку?", "Заметка будет перемещена в корзину", [
      { text: "Отмена", style: "cancel" },
      { text: "Удалить", style: "destructive", onPress: async () => await removeNote(id) },
    ]);
  };

  const handlePin = async (id: string) => {
    const note = notes.find((n: any) => n.id === id);
    if (note) {
      await addNote({ ...note, is_pinned: !note.is_pinned, updated_at: new Date().toISOString() });
    }
  };

  const handleSaveEdit = async () => {
    if (selected) {
      await addNote({ ...selected, title: editTitle, text: editText, updated_at: new Date().toISOString() });
      setSelected(null); setEditText(""); setEditTitle("");
    }
  };

  const handleOpenEdit = (note: any) => {
    setSelected(note); setEditTitle(note.title || ""); setEditText(note.text || "");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <GoogleKeepNote />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {[...visibleNotes]
          .sort((a, b) => {
            if (a.is_pinned && !b.is_pinned) return -1;
            if (!a.is_pinned && b.is_pinned) return 1;
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          })
          .map((note: any) => (
            <NoteCard 
              key={note.id} 
              note={note}
              onPress={() => handleOpenEdit(note)}
              onArchive={handleArchive}
              onDelete={handleDelete}
              onPin={handlePin}
            />
          ))}
        {visibleNotes.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.text }]}>Нет заметок. Создайте первую! ✨</Text>
          </View>
        )}
      </ScrollView>

      {selected && (
        <View style={[styles.overlay, { backgroundColor: isDark ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.4)" }]}>
          <View style={[styles.modal, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Редактировать заметку</Text>
            <TextInput placeholder="Заголовок" placeholderTextColor={isDark ? "#9aa0a6" : "#757575"}
              value={editTitle} onChangeText={setEditTitle}
              style={[styles.input, styles.titleInput, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]} />
            <TextInput placeholder="Текст заметки" placeholderTextColor={isDark ? "#9aa0a6" : "#757575"}
              value={editText} onChangeText={setEditText} multiline numberOfLines={6}
              style={[styles.input, styles.textInput, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border, textAlignVertical: "top" }]} />
            <View style={styles.modalActions}>
              <Pressable style={[styles.modalButton, styles.cancelButton]} onPress={() => { setSelected(null); setEditText(""); setEditTitle(""); }}>
                <Text style={styles.cancelButtonText}>Отмена</Text>
              </Pressable>
              <Pressable style={[styles.modalButton, styles.saveButton]} onPress={handleSaveEdit}>
                <Text style={styles.saveButtonText}>Сохранить</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", flexWrap: "wrap", padding: 20, paddingBottom: 40 },
  emptyState: { width: "100%", alignItems: "center", justifyContent: "center", padding: 40 },
  emptyText: { fontSize: 16, opacity: 0.7 },
  overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center", zIndex: 100 },
  modal: { width: "90%", maxWidth: 500, borderRadius: 16, padding: 24, borderWidth: 1, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
  modalTitle: { fontSize: 20, fontWeight: "600", marginBottom: 20 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 16 },
  titleInput: { fontWeight: "600", fontSize: 18 },
  textInput: { minHeight: 120 },
  modalActions: { flexDirection: "row", justifyContent: "flex-end", gap: 12, marginTop: 8 },
  modalButton: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, minWidth: 100, alignItems: "center" },
  cancelButton: { backgroundColor: "transparent", borderWidth: 1, borderColor: "#dadce0" },
  cancelButtonText: { color: "#5f6368", fontWeight: "600", fontSize: 14 },
  saveButton: { backgroundColor: "#1a73e8" },
  saveButtonText: { color: "#fff", fontWeight: "600", fontSize: 14 },
});