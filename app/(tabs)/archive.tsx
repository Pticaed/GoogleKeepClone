// app/(tabs)/archive.tsx
import NoteCard from "@/components/NoteCard";
import { useGlobal } from "@/context/GlobalContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function ArchiveScreen() {
  const { theme, notes, addNote, removeNote } = useGlobal();
  const isDark = theme === "dark";
  
  const colors = isDark
    ? { bg: "#121212", surface: "#1e1e1e", text: "#fff", border: "#555" } 
    : { bg: "#fff", surface: "#f5f5f5", text: "#202124", border: "#ddd" };
  
  const [selected, setSelected] = useState<any>(null);

  // Фильтруем: только архивированные заметки
  const archivedNotes = notes.filter((note: any) => 
    note.is_archived && !note.is_deleted
  );

  // Восстановление из архива
  const handleUnarchive = async (id: string) => {
    const note = notes.find((n: any) => n.id === id);
    if (note) await addNote({ ...note, is_archived: false, updated_at: new Date().toISOString() });
  };

  const handleDelete = async (id: string) => {
    Alert.alert("Удалить навсегда?", "Это действие нельзя отменить", [
      { text: "Отмена", style: "cancel" },
      { text: "Удалить", style: "destructive", onPress: async () => await removeNote(id) },
    ]);
  };

  const handlePin = async (id: string) => {
    const note = notes.find((n: any) => n.id === id);
    if (note) await addNote({ ...note, is_pinned: !note.is_pinned, updated_at: new Date().toISOString() });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Заголовок */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Ionicons name="archive-outline" size={24} color={isDark ? "#8ab4f8" : "#1a73e8"} />
        <Text style={[styles.headerTitle, { color: colors.text }]}>Архив</Text>
        <Text style={[styles.headerCount, { color: isDark ? "#9aa0a6" : "#5f6368" }]}>
          {archivedNotes.length} {archivedNotes.length === 1 ? "заметка" : "заметок"}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {archivedNotes.map((note: any) => (
          <View key={note.id} style={styles.noteWrapper}>
            <NoteCard 
              note={note}
              onPress={() => setSelected(note)}
              onArchive={handleUnarchive} // В архиве кнопка "Архив" = "Восстановить"
              onDelete={handleDelete}
              onPin={handlePin}
            />
          </View>
        ))}
        
        {archivedNotes.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="archive-outline" size={48} color={isDark ? "#5f6368" : "#9aa0a6"} />
            <Text style={[styles.emptyText, { color: colors.text }]}>Архив пуст</Text>
            <Text style={[styles.emptySubtext, { color: isDark ? "#9aa0a6" : "#5f6368" }]}>
              Архивированные заметки появятся здесь
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Модальное окно просмотра */}
      {selected && (
        <View style={[styles.overlay, { backgroundColor: isDark ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.4)" }]}>
          <View style={[styles.modal, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{selected.title || "Без названия"}</Text>
            <Text style={[styles.modalText, { color: colors.text }]}>{selected.text}</Text>
            <View style={styles.modalActions}>
              <Pressable style={[styles.modalButton, styles.unarchiveButton]} onPress={() => { handleUnarchive(selected.id); setSelected(null); }}>
                <Ionicons name="archive-outline" size={18} color="#1a73e8" />
                <Text style={styles.unarchiveButtonText}>Восстановить</Text>
              </Pressable>
              <Pressable style={[styles.modalButton, styles.deleteButton]} onPress={() => { handleDelete(selected.id); setSelected(null); }}>
                <Ionicons name="trash-outline" size={18} color="#ea4335" />
                <Text style={styles.deleteButtonText}>Удалить</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, gap: 12 },
  headerTitle: { fontSize: 20, fontWeight: "600" },
  headerCount: { fontSize: 14, marginLeft: "auto" },
  container: { padding: 20, paddingBottom: 40 },
  noteWrapper: { marginBottom: 8 },
  emptyState: { width: "100%", alignItems: "center", justifyContent: "center", padding: 60, gap: 16 },
  emptyText: { fontSize: 18, fontWeight: "500" },
  emptySubtext: { fontSize: 14, textAlign: "center", maxWidth: 280 },
  overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center", zIndex: 100 },
  modal: { width: "90%", maxWidth: 400, borderRadius: 16, padding: 24, borderWidth: 1, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
  modalTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  modalText: { fontSize: 14, lineHeight: 20, marginBottom: 20 },
  modalActions: { flexDirection: "row", gap: 12 },
  modalButton: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, gap: 8 },
  unarchiveButton: { backgroundColor: "#e8f0fe" },
  unarchiveButtonText: { color: "#1a73e8", fontWeight: "600", fontSize: 14 },
  deleteButton: { backgroundColor: "#fce8e6" },
  deleteButtonText: { color: "#ea4335", fontWeight: "600", fontSize: 14 },
});