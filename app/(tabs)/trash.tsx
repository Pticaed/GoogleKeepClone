// app/(tabs)/trash.tsx
import NoteCard from "@/components/NoteCard";
import { useGlobal } from "@/context/GlobalContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function TrashScreen() {
  const { theme, notes, addNote } = useGlobal();
  const isDark = theme === "dark";
  
  const colors = isDark
    ? { bg: "#121212", surface: "#1e1e1e", text: "#fff", border: "#555" } 
    : { bg: "#fff", surface: "#f5f5f5", text: "#202124", border: "#ddd" };
  
  const [selected, setSelected] = useState<any>(null);

  // Фильтруем: только удалённые заметки
  const trashedNotes = notes.filter((note: any) => note.is_deleted);

  // Восстановление из корзины
  const handleRestore = async (id: string) => {
    const note = notes.find((n: any) => n.id === id);
    if (note) await addNote({ ...note, is_deleted: false, is_archived: false, updated_at: new Date().toISOString() });
  };

  // Полное удаление
  const handlePermanentDelete = async (id: string) => {
    Alert.alert("Удалить навсегда?", "Это действие нельзя отменить", [
      { text: "Отмена", style: "cancel" },
      { 
        text: "Удалить", 
        style: "destructive",
        onPress: async () => {
          // Здесь можно вызвать API для полного удаления
          await addNote({ id, is_deleted: true, _permanentDelete: true });
        }
      },
    ]);
  };

  // Очистить всю корзину
  const handleEmptyTrash = async () => {
    if (trashedNotes.length === 0) return;
    Alert.alert("Очистить корзину?", "Все заметки будут удалены навсегда", [
      { text: "Отмена", style: "cancel" },
      { 
        text: "Очистить", 
        style: "destructive",
        onPress: async () => {
          for (const note of trashedNotes) {
            await addNote({ id: note.id, is_deleted: true, _permanentDelete: true });
          }
        }
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Заголовок */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Ionicons name="trash-outline" size={24} color={isDark ? "#f28b82" : "#ea4335"} />
        <Text style={[styles.headerTitle, { color: colors.text }]}>Корзина</Text>
        <Text style={[styles.headerCount, { color: isDark ? "#9aa0a6" : "#5f6368" }]}>
          {trashedNotes.length} {trashedNotes.length === 1 ? "заметка" : "заметок"}
        </Text>
        {trashedNotes.length > 0 && (
          <Pressable onPress={handleEmptyTrash} style={styles.emptyTrashButton}>
            <Text style={styles.emptyTrashText}>Очистить</Text>
          </Pressable>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {trashedNotes.map((note: any) => (
          <View key={note.id} style={styles.noteWrapper}>
            <NoteCard 
              note={{ ...note, is_deleted: true }}
              onPress={() => setSelected(note)}
              onArchive={() => {}} // В корзине архив неактивен
              onDelete={() => handlePermanentDelete(note.id)}
              onPin={() => {}} // В корзине закрепление неактивно
            />
          </View>
        ))}
        
        {trashedNotes.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="trash-outline" size={48} color={isDark ? "#5f6368" : "#9aa0a6"} />
            <Text style={[styles.emptyText, { color: colors.text }]}>Корзина пуста</Text>
            <Text style={[styles.emptySubtext, { color: isDark ? "#9aa0a6" : "#5f6368" }]}>
              Удалённые заметки хранятся здесь 7 дней
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
              <Pressable style={[styles.modalButton, styles.restoreButton]} onPress={() => { handleRestore(selected.id); setSelected(null); }}>
                <Ionicons name="arrow-undo-outline" size={18} color="#1a73e8" />
                <Text style={styles.restoreButtonText}>Восстановить</Text>
              </Pressable>
              <Pressable style={[styles.modalButton, styles.deleteButton]} onPress={() => { handlePermanentDelete(selected.id); setSelected(null); }}>
                <Ionicons name="trash-outline" size={18} color="#ea4335" />
                <Text style={styles.deleteButtonText}>Удалить навсегда</Text>
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
  emptyTrashButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6, backgroundColor: "#fce8e6" },
  emptyTrashText: { color: "#ea4335", fontWeight: "600", fontSize: 14 },
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
  restoreButton: { backgroundColor: "#e8f0fe" },
  restoreButtonText: { color: "#1a73e8", fontWeight: "600", fontSize: 14 },
  deleteButton: { backgroundColor: "#fce8e6" },
  deleteButtonText: { color: "#ea4335", fontWeight: "600", fontSize: 14 },
});