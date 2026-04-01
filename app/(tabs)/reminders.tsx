// app/(tabs)/reminders.tsx
import NoteCard from "@/components/NoteCard";
import { useGlobal } from "@/context/GlobalContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function RemindersScreen() {
  const { theme, notes, addNote, removeNote } = useGlobal();
  const isDark = theme === "dark";
  
  const colors = isDark
    ? { bg: "#121212", surface: "#1e1e1e", text: "#fff", border: "#555" } 
    : { bg: "#fff", surface: "#f5f5f5", text: "#202124", border: "#ddd" };
  
  const [selected, setSelected] = useState<any>(null);

  // Фильтруем: только заметки с напоминаниями
  const reminderNotes = notes.filter((note: any) => 
    note.has_reminder && !note.is_archived && !note.is_deleted
  );

  const handleArchive = async (id: string) => {
    const note = notes.find((n: any) => n.id === id);
    if (note) await addNote({ ...note, is_archived: true, updated_at: new Date().toISOString() });
  };

  const handleDelete = async (id: string) => {
    Alert.alert("Удалить напоминание?", "Заметка будет перемещена в корзину", [
      { text: "Отмена", style: "cancel" },
      { text: "Удалить", style: "destructive", onPress: async () => await removeNote(id) },
    ]);
  };

  const handlePin = async (id: string) => {
    const note = notes.find((n: any) => n.id === id);
    if (note) await addNote({ ...note, is_pinned: !note.is_pinned, updated_at: new Date().toISOString() });
  };

  const formatReminderDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Заголовок */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Ionicons name="notifications-outline" size={24} color={isDark ? "#8ab4f8" : "#1a73e8"} />
        <Text style={[styles.headerTitle, { color: colors.text }]}>Напоминания</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {[...reminderNotes]
          .sort((a, b) => {
            const dateA = a.reminder_date ? new Date(a.reminder_date).getTime() : Infinity;
            const dateB = b.reminder_date ? new Date(b.reminder_date).getTime() : Infinity;
            return dateA - dateB;
          })
          .map((note: any) => (
            <View key={note.id} style={styles.noteWrapper}>
              {/* Бейдж с датой напоминания */}
              <View style={[styles.reminderBadge, { backgroundColor: isDark ? "#1e3a5f" : "#e8f0fe" }]}>
                <Ionicons name="time-outline" size={14} color={isDark ? "#8ab4f8" : "#1a73e8"} />
                <Text style={[styles.reminderDate, { color: isDark ? "#8ab4f8" : "#1a73e8" }]}>
                  {formatReminderDate(note.reminder_date)}
                </Text>
              </View>
              
              <NoteCard 
                note={note}
                onPress={() => setSelected(note)}
                onArchive={handleArchive}
                onDelete={handleDelete}
                onPin={handlePin}
              />
            </View>
          ))}
        
        {reminderNotes.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={48} color={isDark ? "#5f6368" : "#9aa0a6"} />
            <Text style={[styles.emptyText, { color: colors.text }]}>Нет напоминаний</Text>
            <Text style={[styles.emptySubtext, { color: isDark ? "#9aa0a6" : "#5f6368" }]}>
              Добавьте напоминание к заметке, и оно появится здесь
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
            {selected.reminder_date && (
              <View style={[styles.modalReminder, { backgroundColor: isDark ? "#1e3a5f" : "#e8f0fe" }]}>
                <Ionicons name="time-outline" size={16} color={isDark ? "#8ab4f8" : "#1a73e8"} />
                <Text style={[styles.modalReminderText, { color: isDark ? "#8ab4f8" : "#1a73e8" }]}>
                  {formatReminderDate(selected.reminder_date)}
                </Text>
              </View>
            )}
            <Pressable style={styles.modalClose} onPress={() => setSelected(null)}>
              <Text style={styles.modalCloseText}>Закрыть</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, gap: 12 },
  headerTitle: { fontSize: 20, fontWeight: "600" },
  container: { padding: 20, paddingBottom: 40 },
  noteWrapper: { marginBottom: 8 },
  reminderBadge: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, alignSelf: "flex-start", marginBottom: -10, marginLeft: 20, zIndex: 1, gap: 6 },
  reminderDate: { fontSize: 12, fontWeight: "500" },
  emptyState: { width: "100%", alignItems: "center", justifyContent: "center", padding: 60, gap: 16 },
  emptyText: { fontSize: 18, fontWeight: "500" },
  emptySubtext: { fontSize: 14, textAlign: "center", maxWidth: 280 },
  overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center", zIndex: 100 },
  modal: { width: "90%", maxWidth: 400, borderRadius: 16, padding: 24, borderWidth: 1, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
  modalTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  modalText: { fontSize: 14, lineHeight: 20, marginBottom: 16 },
  modalReminder: { flexDirection: "row", alignItems: "center", padding: 12, borderRadius: 8, marginBottom: 16, gap: 8 },
  modalReminderText: { fontSize: 13, fontWeight: "500" },
  modalClose: { alignSelf: "flex-end", paddingVertical: 8, paddingHorizontal: 16 },
  modalCloseText: { color: "#1a73e8", fontWeight: "600", fontSize: 14, textTransform: "uppercase" },
});