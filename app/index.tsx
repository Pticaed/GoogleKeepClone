import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import NoteCard from "../components/NoteCard";
import { IconButton, Text } from "react-native-paper";

export default function Home() {
  const [selected, setSelected] = useState<string | null>(null);
  const [text, setText] = useState("");
  const notes = ["pppp", "лллллл"];
  const [forceOff, setForceOff] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isOnline = !forceOff;
  const canEdit = true;

  function sync() {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      alert("Synced");
    }, 1500);
  }

  return (
    <>
      <ScrollView style={{ backgroundColor: "#f5f5f5" }}>
        <View style={styles.container}>
          <View style={styles.systemCard}>
            <View style={styles.row}>
              <Text style={styles.rowText}>online</Text>

              <TouchableOpacity
                style={[
                  styles.customSwitch,
                  isOnline ? styles.switchOn : styles.switchOff,
                ]}
                onPress={() => setForceOff(!forceOff)}
              >
                <View
                  style={[
                    styles.switchThumb,
                    isOnline ? styles.thumbOn : styles.thumbOff,
                  ]}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.syncBtn,
                { opacity: isOnline && canEdit ? 1 : 0.5 },
              ]}
              onPress={sync}
              disabled={!isOnline || isLoading || !canEdit}
            >
              {isLoading ? (
                <ActivityIndicator color="#202124" />
              ) : (
                <Text style={styles.btnText}>sync</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.notesWrapper}>
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
        </View>
      </ScrollView>

      {selected && (
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <TextInput placeholder="Название" style={styles.titleInput} />
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Заметка..."
              multiline
              style={styles.noteInput}
            />

            <View style={styles.bottomRow}>
              <View style={styles.icons}>
                <IconButton icon="format-font" />
                <IconButton icon="palette-outline" />
                <IconButton icon="bell-outline" />
                <IconButton icon="account-plus-outline" />
                <IconButton icon="image-outline" />
                <IconButton icon="archive-outline" />
                <IconButton icon="dots-vertical" />
              </View>

              <TouchableOpacity onPress={() => setSelected(null)}>
                <Text style={styles.close}>Закрыть</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },

  notesWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
    marginTop: 20,
  },

  systemCard: {
    width: 180,
    minHeight: 95,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  rowText: {
    color: "#202124",
    fontSize: 16,
    textTransform: "lowercase",
  },

  customSwitch: {
    width: 46,
    height: 26,
    borderRadius: 20,
    padding: 3,
    justifyContent: "center",
  },

  switchOn: {
    backgroundColor: "grey",
  },

  switchOff: {
    backgroundColor: "#d0d0d0",
  },

  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "white",
  },

  thumbOn: {
    alignSelf: "flex-end",
  },

  thumbOff: {
    alignSelf: "flex-start",
  },

  syncBtn: {
    backgroundColor: "#f1f3f4",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },

  btnText: {
    color: "#202124",
    fontSize: 14,
    fontWeight: "600",
    textTransform: "lowercase",
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
    width: 600,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },

  titleInput: {
    fontSize: 22,
    marginBottom: 10,
    borderWidth: 0,
    outlineStyle: "none",
  },

  noteInput: {
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
    borderWidth: 0,
    outlineStyle: "none",
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },

  icons: {
    flexDirection: "row",
  },

  close: {
    fontSize: 16,
  },
});