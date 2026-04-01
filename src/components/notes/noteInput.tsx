import { useGlobal } from '@/context/GlobalContext';
import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { IconButton, Surface } from 'react-native-paper';

const COLORS: any = {
    default: { bg: '#fff', b: '#e0e0e0', dbg: '#202124', db: '#3c4043' },
    red: { bg: '#f28b82', b: '#d66c64', dbg: '#5c2b29', db: '#5f3535' },
    orange: { bg: '#fbbc04', b: '#e0a800', dbg: '#614a19', db: '#5f4a19' },
    yellow: { bg: '#fff475', b: '#e6dc5e', dbg: '#635d19', db: '#5f5d19' },
    green: { bg: '#ccff90', b: '#b3e87d', dbg: '#345920', db: '#345920' },
    blue: { bg: '#cbf0f8', b: '#b3e0f0', dbg: '#2d555e', db: '#2d555e' },
    purple: { bg: '#d7aefb', b: '#c496e8', dbg: '#42275e', db: '#42275e' },
};

const EMPTY = { title: '', content: '', color: 'default', is_pinned: false, is_archived: false, reminder_at: null, labels: null, checklist: null };

interface Props { existingNote?: any; onClose?: () => void; }

export default function GoogleKeepNote({ existingNote, onClose }: Props) {
    const { theme, addNote, updateNote, removeNote, user } = useGlobal();
    const isDark = theme === 'dark';
    const isEditing = Boolean(existingNote);

    const [note, setNote] = useState(existingNote ?? { ...EMPTY });
    const [expanded, setExpanded] = useState(isEditing);
    const [colorMenu, setColorMenu] = useState(false);
    const [history, setHistory] = useState({ items: [{ title: note.title, content: note.content }], index: 0 });

    useEffect(() => {
        if (!expanded) return;
        const t = setTimeout(() => setHistory(p => {
            const next = [...p.items.slice(0, p.index + 1), { title: note.title, content: note.content }];
            return { items: next.slice(-30), index: next.length - 1 };
        }), 1000);
        return () => clearTimeout(t);
    }, [note.title, note.content]);

    const c = COLORS[note.color] || COLORS.default;
    const tc = isDark ? '#e8eaed' : '#202124';
    const bg = isDark ? (c.dbg ?? '#202124') : c.bg;
    const bc = isDark ? '#5f6368' : c.b;

    const save = async () => {
        if (isEditing) { await updateNote(existingNote.id, note); onClose?.(); return; }
        if (user && (note.content.trim() || note.title.trim())) await addNote({ ...note });
        reset();
    };

    const reset = () => { setNote({ ...EMPTY }); setExpanded(false); setColorMenu(false); onClose?.(); };

    const setFlag = (key: string, val: boolean) => {
        const updated = { ...note, [key]: val };
        setNote(updated);
        if (isEditing) updateNote(existingNote.id, { [key]: val });
    };

    const Btn = ({ icon, onPress, active = false, disabled = false, color }: any) => (
        <IconButton icon={icon} size={20} onPress={onPress} disabled={disabled} style={{ margin: 0 }}
            iconColor={color ?? (active ? '#1a73e8' : disabled ? '#5f6368' : isDark ? '#e8eaed' : '#5f6368')} />
    );

    const ColorPicker = () => (
        <Modal transparent visible={colorMenu} animationType="fade">
            <Pressable style={s.overlay} onPress={() => setColorMenu(false)}>
                <View style={[s.popup, { backgroundColor: isDark ? '#2c2c2c' : '#fff' }]}>
                    {Object.entries(COLORS).map(([k, v]: any) => (
                        <Pressable key={k} onPress={() => { setNote({ ...note, color: k }); setColorMenu(false); }}
                            style={[s.dot, { backgroundColor: isDark ? (v.dbg ?? v.bg) : v.bg, borderColor: note.color === k ? '#1a73e8' : v.b, borderWidth: note.color === k ? 2 : 1 }]} />
                    ))}
                </View>
            </Pressable>
        </Modal>
    );

    if (!expanded && !isEditing) return (
        <Surface style={[s.card, { height: 48, flexDirection: 'row', backgroundColor: bg, borderColor: bc }]} elevation={2}>
            <Pressable style={{ flex: 1 }} onPress={() => setExpanded(true)}>
                <View style={{ flex: 1, justifyContent: 'center', paddingLeft: 8 }}>
                    <Text style={{ color: '#9aa0a6' }}>Замітка...</Text>
                </View>
            </Pressable>
            <Btn icon={note.is_pinned ? 'pin' : 'pin-outline'} active={note.is_pinned} onPress={() => setFlag('is_pinned', !note.is_pinned)} />
            <Btn icon="palette-outline" onPress={() => setColorMenu(true)} />
            <ColorPicker />
        </Surface>
    );

    return (
        <Surface style={[s.card, { backgroundColor: bg, borderColor: bc }]} elevation={4}>
            <View style={s.row}>
                <TextInput placeholder="Назва" placeholderTextColor="#9aa0a6" style={[s.titleInput, { color: tc }]}
                    value={note.title} onChangeText={v => setNote({ ...note, title: v })} />
                <Btn icon={note.is_pinned ? 'pin' : 'pin-outline'} active={note.is_pinned} onPress={() => setFlag('is_pinned', !note.is_pinned)} />
            </View>

            <TextInput placeholder="Замітка..." placeholderTextColor="#9aa0a6" multiline
                style={[s.contentInput, { color: tc }]} value={note.content} onChangeText={v => setNote({ ...note, content: v })} />

            <View style={s.footer}>
                <View style={s.tools}>
                    <Btn icon="palette-outline" onPress={() => setColorMenu(true)} />
                    <Btn icon="undo" disabled={history.index <= 0} onPress={() => {
                        const item = history.items[history.index - 1];
                        if (item) { setNote({ ...note, ...item }); setHistory({ ...history, index: history.index - 1 }); }
                    }} />
                    {isEditing && <Btn icon="delete-outline" color="#ea4335" onPress={async () => { await removeNote(existingNote.id); onClose?.(); }} />}
                </View>
                <Pressable onPress={save}><Text style={[s.closeBtn, { color: tc }]}>ЗАКРИТИ</Text></Pressable>
            </View>

            <ColorPicker />
        </Surface>
    );
}

const s = StyleSheet.create({
    card: { margin: 16, padding: 8, borderRadius: 8, borderWidth: 1 },
    row: { flexDirection: 'row', alignItems: 'center' },
    titleInput: { flex: 1, fontSize: 18, fontWeight: '700', padding: 8 },
    contentInput: { fontSize: 15, padding: 8, minHeight: 80, textAlignVertical: 'top' },
    footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
    tools: { flexDirection: 'row', gap: 4 },
    closeBtn: { padding: 8, fontWeight: 'bold' },
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
    popup: { padding: 16, borderRadius: 12, flexDirection: 'row', flexWrap: 'wrap', width: 280, gap: 12 },
    dot: { width: 40, height: 40, borderRadius: 20 },
});