
import { eq } from "drizzle-orm";
import { useEffect, useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Banner, Button, IconButton, useTheme } from "react-native-paper";
import NoteCard from "../components/NoteCard";
import { mockApi } from "../src/api/mockApi";
import { db } from "../src/db/client";
import { notes as notesTable } from "../src/db/schema";
import { useSync } from "../src/hooks/useSync";

export default function Home() {
    const theme = useTheme();
    const [notes, setNotes] = useState<any[]>([]);
    const [selected, setSelected] = useState<any>(null);
    const [text, setText] = useState("");
    const [banner, setBanner] = useState(false);

    useEffect(() => {
        (async () => {
            if (Platform.OS !== "web") {
                try { await useSync(); } catch { setBanner(true); }
            }
            try {
                const data = (Platform.OS !== "web" && db)
                    ? await db.query.notes.findMany()
                    : await mockApi.getNotes();
                setNotes(data);
            } catch (e) { console.log(e); }
        })();
    }, []);

    const saveNote = async () => {
        if (!selected) return;
        const updated = { ...selected, title: text };
        setNotes(notes.map(n => (n.id === selected.id ? updated : n)));
        try {
            if (Platform.OS !== "web" && db) {
                await db.update(notesTable).set({ title: text }).where(eq(notesTable.id, selected.id));
            } else {
                await mockApi.updateNote(selected.id, { title: text });
            }
        } catch (e) { console.log(e); }
        setSelected(null);
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Banner visible={banner} actions={[{ label: "OK", onPress: () => setBanner(false) }]}>
                Offline mode
            </Banner>

            <ScrollView contentContainerStyle={styles.container}>
                {notes.map((note, i) => (
                    <NoteCard
                        key={note.id || i}
                        title={note.title || note}
                        onPress={() => { setSelected(note); setText(note.title || note); }}
                    />
                ))}
            </ScrollView>

            {selected && (
                <View style={styles.overlay}>
                    <View style={[styles.modal, { backgroundColor: theme.colors.surface }]}>
                        <Text variant="titleLarge">Edit Note</Text>
                        <TextInput
                            value={text}
                            onChangeText={setText}
                            style={[styles.input, { color: theme.colors.onSurface, borderColor: theme.colors.outline }]}
                        />
                        <View style={styles.icons}>
                            <IconButton icon="palette-outline" />
                            <IconButton icon="bell-outline" />
                            <IconButton icon="label-outline" />
                            <IconButton icon="dots-vertical" />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <Button onPress={() => setSelected(null)}>Cancel</Button>
                            <Button onPress={saveNote}>Save</Button>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        padding: 20,
    },

    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },

    modal: {
        width: 500,
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
    },

    title: {
        fontSize: 22,
        marginBottom: 10,
    },

    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
    },

    icons: {
        flexDirection: "row",
        marginTop: 20,
    },

    close: {
        marginTop: 20,
        textAlign: "right",
    },
});