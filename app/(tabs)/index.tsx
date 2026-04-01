import NoteCard from "@/components/NoteCard";
import EditNoteModal from "@/components/notes/EditNoteModal";
import GoogleKeepNote from "@/components/notes/noteInput";
import { useGlobal } from "@/context/GlobalContext";
import React, { useState } from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";

const { width } = Dimensions.get('window');

export default function NotesScreen() {
  const { notes, removeNote, updateNote, theme } = useGlobal();
  const [selected, setSelected] = useState<any>(null);

  const isDark = theme === 'dark';
  const visibleNotes = notes.filter((n: any) => !n.is_archived && !n.is_deleted);

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#121212' : '#fff' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Поле вводу нової замітки */}
        <GoogleKeepNote />

        {/* Сітка заміток */}
        <View style={styles.grid}>
          {visibleNotes.map((note: any) => (
            <View key={note.id} style={styles.cardWrapper}>
              <NoteCard 
                note={note} 
                onPress={() => setSelected(note)} 
                onArchive={(id: string) => updateNote(id, { is_archived: true })}
                onDelete={(id: string) => removeNote(id)}
                onPin={(id: string) => updateNote(id, { is_pinned: !note.is_pinned })}
              />
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Модалка для редагування */}
      <EditNoteModal 
        note={selected} 
        isVisible={!!selected} 
        onClose={() => setSelected(null)} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    justifyContent: 'flex-start',
  },
  cardWrapper: {
    // 2 колонки на мобах, 3+ на планшетах
    width: width > 700 ? '31.3%' : '48%', 
    margin: '1%',
  },
});