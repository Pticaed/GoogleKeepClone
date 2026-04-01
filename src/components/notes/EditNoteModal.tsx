import { useGlobal } from "@/context/GlobalContext";
import React, { useEffect, useState } from 'react';
import { Dimensions, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { IconButton } from 'react-native-paper';

const { width } = Dimensions.get('window');

const COLORS: Record<string, any> = {
    default: { bg: '#fff', b: '#e0e0e0', dbg: '#202124', db: '#3c4043' },
    red: { bg: '#f28b82', b: '#d66c64', dbg: '#5c2b29', db: '#5f3535' },
    orange: { bg: '#fbbc04', b: '#e0a800', dbg: '#614a19', db: '#5f4a19' },
    yellow: { bg: '#fff475', b: '#e6dc5e', dbg: '#635d19', db: '#5f5d19' },
    green: { bg: '#ccff90', b: '#b3e87d', dbg: '#345920', db: '#345920' },
    blue: { bg: '#cbf0f8', b: '#b3e0f0', dbg: '#2d555e', db: '#2d555e' },
    purple: { bg: '#d7aefb', b: '#c496e8', dbg: '#42275e', db: '#42275e' },
};

export default function EditNoteModal({ note, isVisible, onClose }: any) {
    const { theme, updateNote } = useGlobal();
    const isDark = theme === "dark";

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [showColors, setShowColors] = useState(false);

    useEffect(() => {
        if (note) {
            setTitle(note.title || "");
            setContent(note.content || "");
        }
    }, [note]);

    if (!note) return null;

    const currentNoteColor = COLORS[note.color] || COLORS.default;
    const colors = isDark 
        ? { text: "#e8eaed", overlay: "rgba(0,0,0,0.8)" } 
        : { text: "#202124", overlay: "rgba(0,0,0,0.5)" };

    const handleSave = () => {
        updateNote(note.id, { title, content });
        onClose();
    };

    return (
        <Modal visible={isVisible} transparent animationType="fade" onRequestClose={handleSave}>
            <Pressable style={[s.overlay, { backgroundColor: colors.overlay }]} onPress={handleSave}>
                <Pressable 
                    style={[s.modal, { 
                        backgroundColor: isDark ? currentNoteColor.dbg : currentNoteColor.bg,
                        borderColor: isDark ? currentNoteColor.db : currentNoteColor.b 
                    }]} 
                    onPress={e => e.stopPropagation()}
                >
                    <View style={s.header}>
                        <TextInput
                            style={[s.tIn, { color: colors.text }]}
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Назва"
                            placeholderTextColor="#9aa0a6"
                        />
                        <IconButton 
                            icon={note.is_pinned ? "pin" : "pin-outline"} 
                            iconColor={note.is_pinned ? "#1a73e8" : colors.text}
                            onPress={() => updateNote(note.id, { is_pinned: !note.is_pinned })}
                        />
                    </View>

                    <TextInput
                        style={[s.cIn, { color: colors.text }]}
                        value={content}
                        onChangeText={setContent}
                        placeholder="Замітка..."
                        placeholderTextColor="#9aa0a6"
                        multiline
                    />

                    <View style={s.footer}>
                        <View style={s.tools}>
                            <IconButton icon="palette-outline" size={20} iconColor={colors.text} onPress={() => setShowColors(!showColors)} />
                            <IconButton icon="bell-outline" size={20} iconColor={colors.text} onPress={() => {
                                const tomorrow = new Date();
                                tomorrow.setDate(tomorrow.getDate() + 1);
                                updateNote(note.id, { reminder_at: tomorrow.toISOString() });
                            }} />
                            <IconButton icon="archive-arrow-down-outline" size={20} iconColor={colors.text} onPress={() => { updateNote(note.id, { is_archived: true }); onClose(); }} />
                        </View>
                        <Pressable onPress={handleSave}><Text style={[s.close, { color: colors.text }]}>Закрити</Text></Pressable>
                    </View>

                    {showColors && (
                        <View style={[s.colorPop, { backgroundColor: isDark ? '#2c2c2c' : '#fff' }]}>
                            {Object.entries(COLORS).map(([k, c]: any) => (
                                <Pressable key={k} onPress={() => updateNote(note.id, { color: k })}
                                    style={[s.dot, { backgroundColor: isDark ? c.dbg : c.bg, borderColor: note.color === k ? '#1a73e8' : (isDark ? c.db : c.b) }]} />
                            ))}
                        </View>
                    )}
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const s = StyleSheet.create({
    overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    modal: { width: '90%', maxWidth: 500, borderRadius: 8, padding: 16, borderWidth: 1, elevation: 10 },
    header: { flexDirection: 'row', alignItems: 'center' },
    tIn: { flex: 1, fontSize: 20, fontWeight: '500' },
    cIn: { fontSize: 16, minHeight: 150, textAlignVertical: 'top', marginTop: 10 },
    footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 },
    tools: { flexDirection: 'row' },
    close: { fontWeight: '600', padding: 8 },
    colorPop: { flexDirection: 'row', flexWrap: 'wrap', padding: 8, marginTop: 10, borderRadius: 8, gap: 8 },
    dot: { width: 30, height: 30, borderRadius: 15, borderWidth: 1 }
});