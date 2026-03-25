import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { IconButton } from "react-native-paper";
import NoteCard from "../components/NoteCard";

export default function Home() {
  const [selected, setSelected] = useState(null);
  const [text, setText] = useState("");
  const notes = ["pppp", "лллллл"];

  return (
    <>
      <ScrollView style={{ backgroundColor: "#f5f5f5" }}>
        <View style={styles.container}>
          {notes.map((note, index) => (
            <NoteCard
              key={index}
              title={note}
              onPress={() => {
                setSelected(note);
                setText(note);
              }}
            />
          ))}
        </View>
      </ScrollView>
      {selected && (
        <View style={styles.overlay}>
          <View style={styles.modal}>
            
            <Text style={styles.title}>Название</Text>
            <TextInput
              value={text}
              onChangeText={setText}
              style={styles.input}
            />
            <View style={styles.icons}>
              <IconButton icon="format-font" />
              <IconButton icon="palette-outline" />
              <IconButton icon="bell-outline" />
              <IconButton icon="account-plus-outline" />
              <IconButton icon="image-outline" />
              <IconButton icon="archive-outline" />
              <IconButton icon="dots-vertical" />
            </View>
            <Text style={styles.close} onPress={() => setSelected(null)}>
              Закрыть
            </Text>

          </View>
        </View>
      )}
    </>
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