import NoteCard from "@/components/NoteCard";
import { useGlobal } from "@/context/GlobalContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function RemindersScreen() {
  const { theme, notes, removeNote, updateNote } = useGlobal();
  const isDark = theme === "dark";
  
  const colors = isDark
    ? { bg: "#121212", text: "#fff", border: "#555" } 
    : { bg: "#fff", text: "#202124", border: "#ddd" };
  
  const reminderNotes = notes.filter((note: any) => 
    note.reminder_at && !note.is_archived && !note.is_deleted
  );

  const handleArchive = async (id: string) => {
    await updateNote(id, { is_archived: true });
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Ionicons name="notifications-outline" size={24} color={colors.text} />
        <Text style={[styles.headerTitle, { color: colors.text }]}>Нагадування</Text>
      </View>

      <View style={styles.container}>
        {reminderNotes.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-outline" size={80} color={isDark ? "#333" : "#e0e0e0"} />
            <Text style={[styles.emptyText, { color: colors.text }]}>Замітки з нагадуваннями з'являться тут</Text>
          </View>
        ) : (
          reminderNotes.map((note: any) => (
            <NoteCard 
              key={note.id} 
              note={note} 
              onArchive={handleArchive}
              onDelete={removeNote}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, gap: 12 },
  headerTitle: { fontSize: 20, fontWeight: "600" },
  container: { flexDirection: "row", flexWrap: "wrap", padding: 20, paddingBottom: 40 },
  emptyState: { width: "100%", alignItems: "center", justifyContent: "center", padding: 60, gap: 16 },
  emptyText: { fontSize: 16, fontWeight: "500", textAlign: 'center' }
});