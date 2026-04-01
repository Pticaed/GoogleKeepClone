// app/(tabs)/labels.tsx
import NoteCard from "@/components/NoteCard";
import { useGlobal } from "@/context/GlobalContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

// Цвета для ярлыков
const LABEL_COLORS = ["#f28b82", "#fbbc04", "#ccff90", "#a7ffeb", "#cbf0f8", "#aecbfa", "#d7aefb", "#fdcfe8", "#e6c9a8", "#e8eaed"];

export default function LabelsScreen() {
  const { theme, notes, addNote, removeNote, user } = useGlobal();
  const isDark = theme === "dark";
  
  const colors = isDark
    ? { bg: "#121212", surface: "#1e1e1e", text: "#fff", inputBg: "#2a2a2a", border: "#555" } 
    : { bg: "#fff", surface: "#f5f5f5", text: "#202124", inputBg: "#fff", border: "#ddd" };
  
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [showCreateLabel, setShowCreateLabel] = useState(false);
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState(LABEL_COLORS[0]);
  const [selectedNote, setSelectedNote] = useState<any>(null);

  // Парсим ярлыки пользователя
  const userLabels = user?.label_definitions ? JSON.parse(user.label_definitions) : [];
  
  // Фильтруем заметки по выбранному ярлыку
  const filteredNotes = notes.filter((note: any) => {
    if (note.is_archived || note.is_deleted) return false;
    if (!selectedLabel) return true;
    const noteLabels = note.labels ? JSON.parse(note.labels) : [];
    return noteLabels.includes(selectedLabel);
  });

  const handleArchive = async (id: string) => {
    const note = notes.find((n: any) => n.id === id);
    if (note) await addNote({ ...note, is_archived: true, updated_at: new Date().toISOString() });
  };

  const handleDelete = async (id: string) => {
    Alert.alert("Удалить заметку?", "Заметка будет перемещена в корзину", [
      { text: "Отмена", style: "cancel" },
      { text: "Удалить", style: "destructive", onPress: async () => await removeNote(id) },
    ]);
  };

  const handlePin = async (id: string) => {
    const note = notes.find((n: any) => n.id === id);
    if (note) await addNote({ ...note, is_pinned: !note.is_pinned, updated_at: new Date().toISOString() });
  };

  const handleCreateLabel = async () => {
    if (!newLabelName.trim() || !user) return;
    
    const newLabels = [...userLabels, { name: newLabelName.trim(), color: newLabelColor }];
    await addNote({ 
      title: "", text: "", 
      user_id: user.id, 
      labels: JSON.stringify(newLabels),
      _updateUserLabels: true // Флаг для обновления профиля
    });
    
    setNewLabelName("");
    setShowCreateLabel(false);
  };

  const handleAddLabelToNote = async (noteId: string, labelName: string) => {
    const note = notes.find((n: any) => n.id === noteId);
    if (!note) return;
    
    const noteLabels = note.labels ? JSON.parse(note.labels) : [];
    if (!noteLabels.includes(labelName)) {
      noteLabels.push(labelName);
      await addNote({ ...note, labels: JSON.stringify(noteLabels), updated_at: new Date().toISOString() });
    }
  };

  const handleRemoveLabelFromNote = async (noteId: string, labelName: string) => {
    const note = notes.find((n: any) => n.id === noteId);
    if (!note) return;
    
    const noteLabels = note.labels ? JSON.parse(note.labels) : [];
    const updatedLabels = noteLabels.filter((l: string) => l !== labelName);
    await addNote({ ...note, labels: JSON.stringify(updatedLabels), updated_at: new Date().toISOString() });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, flexDirection: "row" }}>
      {/* Боковая панель ярлыков */}
      <View style={[styles.sidebar, { backgroundColor: colors.surface, borderRightColor: colors.border }]}>
        <View style={styles.sidebarHeader}>
          <Text style={[styles.sidebarTitle, { color: colors.text }]}>Ярлыки</Text>
          <Pressable onPress={() => setShowCreateLabel(!showCreateLabel)}>
            <Ionicons name="add" size={20} color={isDark ? "#8ab4f8" : "#1a73e8"} />
          </Pressable>
        </View>

        {/* Кнопка "Все заметки" */}
        <Pressable 
          style={[styles.labelItem, selectedLabel === null && styles.labelItemSelected, { backgroundColor: selectedLabel === null ? (isDark ? "#3c4043" : "#e8eaed") : "transparent" }]}
          onPress={() => setSelectedLabel(null)}
        >
          <Ionicons name="bookmark-outline" size={18} color={selectedLabel === null ? (isDark ? "#8ab4f8" : "#1a73e8") : (isDark ? "#9aa0a6" : "#5f6368")} />
          <Text style={[styles.labelItemText, { color: selectedLabel === null ? (isDark ? "#8ab4f8" : "#1a73e8") : colors.text }]}>Все заметки</Text>
        </Pressable>

        {/* Список ярлыков */}
        {userLabels.map((label: any, index: number) => (
          <Pressable 
            key={index}
            style={[styles.labelItem, selectedLabel === label.name && styles.labelItemSelected, { backgroundColor: selectedLabel === label.name ? (isDark ? "#3c4043" : "#e8eaed") : "transparent" }]}
            onPress={() => setSelectedLabel(label.name)}
          >
            <View style={[styles.labelColorDot, { backgroundColor: label.color }]} />
            <Text style={[styles.labelItemText, { color: selectedLabel === label.name ? (isDark ? "#8ab4f8" : "#1a73e8") : colors.text }]}>{label.name}</Text>
          </Pressable>
        ))}

        {/* Форма создания ярлыка */}
        {showCreateLabel && (
          <View style={styles.createLabelForm}>
            <TextInput 
              placeholder="Название ярлыка" 
              placeholderTextColor={isDark ? "#9aa0a6" : "#757575"}
              value={newLabelName} 
              onChangeText={setNewLabelName}
              style={[styles.labelInput, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
            />
            <View style={styles.colorPicker}>
              {LABEL_COLORS.map((color, i) => (
                <Pressable 
                  key={i}
                  style={[styles.colorOption, { backgroundColor: color, borderColor: newLabelColor === color ? "#202124" : "transparent", borderWidth: newLabelColor === color ? 2 : 0 }]}
                  onPress={() => setNewLabelColor(color)}
                />
              ))}
            </View>
            <View style={styles.formActions}>
              <Pressable onPress={() => setShowCreateLabel(false)}><Text style={[styles.formButton, { color: isDark ? "#9aa0a6" : "#5f6368" }]}>Отмена</Text></Pressable>
              <Pressable onPress={handleCreateLabel}><Text style={[styles.formButton, { color: "#1a73e8", fontWeight: "600" }]}>Создать</Text></Pressable>
            </View>
          </View>
        )}
      </View>

      {/* Основная область с заметками */}
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {filteredNotes.map((note: any) => {
          const noteLabels = note.labels ? JSON.parse(note.labels) : [];
          return (
            <View key={note.id} style={styles.noteWrapper}>
              <NoteCard 
                note={note}
                onPress={() => setSelectedNote(note)}
                onArchive={handleArchive}
                onDelete={handleDelete}
                onPin={handlePin}
              />
              {/* Ярлыки заметки */}
              {noteLabels.length > 0 && (
                <View style={styles.noteLabels}>
                  {noteLabels.map((label: string, i: number) => {
                    const labelDef = userLabels.find((l: any) => l.name === label);
                    return (
                      <Pressable 
                        key={i}
                        style={[styles.labelChip, { backgroundColor: labelDef?.color || "#e8eaed" }]}
                        onPress={() => setSelectedLabel(label)}
                      >
                        <Text style={styles.labelChipText}>{label}</Text>
                        <Ionicons 
                          name="close" 
                          size={12} 
                          color="#202124"
                          onPress={(e) => { e.stopPropagation(); handleRemoveLabelFromNote(note.id, label); }}
                        />
                      </Pressable>
                    );
                  })}
                  {/* Добавить ярлык */}
                  <Pressable style={styles.addLabelChip} onPress={() => { /* показать селект ярлыков */ }}>
                    <Ionicons name="add" size={14} color={isDark ? "#9aa0a6" : "#5f6368"} />
                  </Pressable>
                </View>
              )}
            </View>
          );
        })}
        
        {filteredNotes.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="bookmark-outline" size={48} color={isDark ? "#5f6368" : "#9aa0a6"} />
            <Text style={[styles.emptyText, { color: colors.text }]}>Нет заметок с этим ярлыком</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: { width: 200, borderRightWidth: 1, padding: 16 },
  sidebarHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  sidebarTitle: { fontSize: 16, fontWeight: "600" },
  labelItem: { flexDirection: "row", alignItems: "center", paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, marginBottom: 4, gap: 10 },
  labelItemSelected: { borderRadius: 0 },
  labelItemText: { fontSize: 14, flex: 1 },
  labelColorDot: { width: 12, height: 12, borderRadius: 6 },
  createLabelForm: { marginTop: 12, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: "#dadce0" },
  labelInput: { borderWidth: 1, borderRadius: 6, padding: 10, fontSize: 14, marginBottom: 10 },
  colorPicker: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 10 },
  colorOption: { width: 24, height: 24, borderRadius: 12 },
  formActions: { flexDirection: "row", justifyContent: "flex-end", gap: 12 },
  formButton: { fontSize: 14 },
  container: { flex: 1, padding: 20, paddingBottom: 40 },
  noteWrapper: { marginBottom: 8 },
  noteLabels: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginLeft: 12, marginTop: -8, marginBottom: 16 },
  labelChip: { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 4 },
  labelChipText: { fontSize: 12, color: "#202124", fontWeight: "500" },
  addLabelChip: { width: 24, height: 24, borderRadius: 12, borderWidth: 1, borderColor: "#dadce0", justifyContent: "center", alignItems: "center" },
  emptyState: { width: "100%", alignItems: "center", justifyContent: "center", padding: 60, gap: 16 },
  emptyText: { fontSize: 16, opacity: 0.7 },
});