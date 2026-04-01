import { useGlobal } from "@/context/GlobalContext";
import React, { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { IconButton, Surface } from "react-native-paper";

const COLORS: Record<string, any> = {
    default: { bg: '#fff', b: '#e0e0e0', dbg: '#202124', db: '#3c4043' },
    red: { bg: '#f28b82', b: '#d66c64', dbg: '#5c2b29', db: '#5f3535' },
    orange: { bg: '#fbbc04', b: '#e0a800', dbg: '#614a19', db: '#5f4a19' },
    yellow: { bg: '#fff475', b: '#e6dc5e', dbg: '#635d19', db: '#5f5d19' },
    green: { bg: '#ccff90', b: '#b3e87d', dbg: '#345920', db: '#345920' },
    blue: { bg: '#cbf0f8', b: '#b3e0f0', dbg: '#2d555e', db: '#2d555e' },
    purple: { bg: '#d7aefb', b: '#c496e8', dbg: '#42275e', db: '#42275e' },
};

// Допоміжна функція форматування (дублюємо для автономності компонента)
const formatReminder = (iso: string | null) => {
    if (!iso) return '';
    const d = new Date(iso);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const isTomorrow = d.toDateString() === new Date(now.getTime() + 86400000).toDateString();
    const time = d.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
    if (isToday) return `Сьогодні, ${time}`;
    if (isTomorrow) return `Завтра, ${time}`;
    return d.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' }) + `, ${time}`;
};

export default function NoteCard({ note, onPress, onArchive, onDelete, onPin, onRemoveReminder }: any) {
    const { theme, updateNote } = useGlobal();
    const [hover, setHover] = useState(false);
    const [showColors, setShowColors] = useState(false);

    const isD = theme === 'dark';
    const isWeb = Platform.OS === 'web';
    const c = COLORS[note?.color] || COLORS.default;
    const tc = isD ? '#e8eaed' : '#202124';

    const stop = (fn: () => void) => (e: any) => {
        if (e) { e.stopPropagation?.(); e.preventDefault?.(); }
        fn();
    };

    const actionsOpacity = isWeb ? (hover ? 1 : 0) : 1;

    return (
        <View 
            style={s.wrap} 
            onPointerEnter={() => isWeb && setHover(true)} 
            onPointerLeave={() => { if(isWeb) { setHover(false); setShowColors(false); } }}
        >
            <Pressable onPress={onPress}>
                <Surface style={[s.card, { backgroundColor: isD ? c.dbg : c.bg, borderColor: isD ? c.db : c.b }]} elevation={hover ? 4 : 1}>
                    
                    {/* Іконки статусу у кутку */}
                    <View style={s.statusIcons}>
                        {note.is_pinned && <IconButton icon="pin" size={14} iconColor="#1a73e8" style={s.iconBtn} />}
                        {note.reminder_at && <IconButton icon="bell-ring" size={14} iconColor="#1a73e8" style={s.iconBtn} />}
                    </View>

                    {note.title && <Text style={[s.title, { color: tc }]} numberOfLines={1}>{note.title}</Text>}
                    
                    {/* Чіп нагадування під заголовком */}
                    {note.reminder_at && (
                        <View style={s.reminderRow}>
                            <IconButton icon="bell-ring" size={12} iconColor="#1a73e8" style={{ margin: 0 }} />
                            <Text style={[s.reminderText, { color: '#1a73e8' }]} numberOfLines={1}>
                                {formatReminder(note.reminder_at)}
                            </Text>
                            {/* Кнопка видалення нагадування (тільки на вебі при наведенні) */}
                            {isWeb && hover && (
                                <Pressable onPress={stop(() => onRemoveReminder?.(note.id))}>
                                    <Text style={{ color: '#ea4335', fontSize: 14, marginLeft: 4 }}>✕</Text>
                                </Pressable>
                            )}
                        </View>
                    )}
                    
                    <Text style={[s.text, { color: tc }]} numberOfLines={6}>{note.content || note.text || ""}</Text>

                    <View style={[s.actions, { opacity: actionsOpacity }]}>
                        {[
                            { icon: "palette-outline", fn: () => setShowColors(v => !v) },
                            { icon: note.is_pinned ? "pin-off" : "pin-outline", fn: stop(() => onPin?.(note.id)), color: note.is_pinned ? "#1a73e8" : undefined },
                            { icon: note.reminder_at ? "bell-off" : "bell-outline", fn: stop(() => onRemoveReminder?.(note.id)), color: note.reminder_at ? "#1a73e8" : undefined },
                            { icon: note.is_archived ? "archive-arrow-up-outline" : "archive-arrow-down-outline", fn: stop(() => onArchive?.(note.id)), color: note.is_archived ? "#1a73e8" : undefined },
                            { icon: "delete-outline", fn: stop(() => onDelete?.(note.id)), color: "#ea4335" },
                        ].map(({ icon, fn, color }) => (
                            <IconButton key={icon} icon={icon} size={18} onPress={fn} iconColor={color} style={{ margin: 0, zIndex: 20 }} />
                        ))}
                    </View>

                    {showColors && (
                        <View style={[s.pop, { backgroundColor: isD ? '#2c2c2c' : '#fff' }]}>
                            {Object.entries(COLORS).map(([k, col]: any) => (
                                <Pressable key={k} onPress={() => { updateNote(note.id, { color: k }); setShowColors(false); }}
                                    style={[s.dot, { backgroundColor: isD ? col.dbg : col.bg, borderColor: note.color === k ? '#1a73e8' : (isD ? col.db : col.b), borderWidth: note.color === k ? 2 : 1 }]} />
                            ))}
                        </View>
                    )}
                </Surface>
            </Pressable>
        </View>
    );
}

const s = StyleSheet.create({
    wrap: { margin: 8, width: 240 },
    card: { padding: 12, borderRadius: 8, borderWidth: 1, minHeight: 100, overflow: 'visible' },
    statusIcons: { position: 'absolute', top: -4, right: -4, zIndex: 1, flexDirection: 'row' },
    iconBtn: { margin: 0 },
    title: { fontSize: 16, fontWeight: '700', marginBottom: 4, paddingRight: 20 },
    reminderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, paddingHorizontal: 2 },
    reminderText: { fontSize: 12, fontWeight: '500', flex: 1 },
    text: { fontSize: 14, lineHeight: 20 },
    actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8, height: 36 },
    pop: { position: 'absolute', bottom: 44, left: 10, flexDirection: 'row', flexWrap: 'wrap', padding: 6, borderRadius: 8, elevation: 10, zIndex: 100, width: 160, borderWidth: 1, borderColor: '#ccc' },
    dot: { width: 24, height: 24, borderRadius: 12, margin: 3 },
});