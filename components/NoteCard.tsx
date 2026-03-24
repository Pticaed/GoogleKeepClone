import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { IconButton } from "react-native-paper";

export default function NoteCard({ title }) {
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(title);

  return (
    <>
      {/* КАРТОЧКА */}
      <View
        style={styles.card}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => setOpen(true)}
      >
        {/* галочка */}
        {hover && (
          <View style={styles.check}>
            <IconButton icon="check" size={14} iconColor="white" />
          </View>
        )}

        {/* pin */}
        {hover && (
          <View style={styles.pin}>
            <IconButton icon="pin-outline" size={18} />
          </View>
        )}

        <Text style={styles.text}>{text}</Text>

        {/* нижние иконки */}
        {hover && (
          <View style={styles.icons}>
            <IconButton icon="palette-outline" size={18} />
            <IconButton icon="bell-outline" size={18} />
            <IconButton icon="account-plus-outline" size={18} />
            <IconButton icon="image-outline" size={18} />
            <IconButton icon="archive-outline" size={18} />
            <IconButton icon="dots-vertical" size={18} />
          </View>
        )}
      </View>

      {/* МОДАЛКА */}
      {open && (
        <View style={styles.overlay}>
          <View style={styles.modal}>
            
            <Text style={styles.modalTitle}>Название</Text>

            {/* РЕДАКТИРОВАНИЕ */}
            <TextInput
              value={text}
              onChangeText={setText}
              style={styles.input}
              multiline
            />

            {/* иконки */}
            <View style={styles.modalIcons}>
              <IconButton icon="format-font" size={20} />
              <IconButton icon="palette-outline" size={20} />
              <IconButton icon="bell-outline" size={20} />
              <IconButton icon="account-plus-outline" size={20} />
              <IconButton icon="image-outline" size={20} />
              <IconButton icon="archive-outline" size={20} />
              <IconButton icon="dots-vertical" size={20} />
            </View>

            {/* закрыть */}
            <Text style={styles.close} onPress={() => setOpen(false)}>
              Закрыть
            </Text>

          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 320,
    minHeight: 140,
    margin: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    position: "relative",
  },

  text: {
    fontSize: 16,
    color: "#000",
  },

  check: {
    position: "absolute",
    top: -12,
    left: -12,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },

  pin: {
    position: "absolute",
    top: 0,
    right: 0,
  },

  icons: {
    flexDirection: "row",
    marginTop: "auto",
  },

  overlay: {
    position: "fixed",
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

  modalTitle: {
    fontSize: 22,
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginTop: 10,
  },

  modalIcons: {
    flexDirection: "row",
    marginTop: 20,
  },

  close: {
    marginTop: 20,
    textAlign: "right",
    fontSize: 16,
  },
});