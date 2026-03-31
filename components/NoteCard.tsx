import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { IconButton } from "react-native-paper";

export default function NoteCard({ title, onPress }: { title: string; onPress: () => void }) {
  const [hover, setHover] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setHover(true)}
      onHoverOut={() => setHover(false)}
    >
      <View style={styles.card}>
        {hover && (
          <View style={styles.check}>
            <IconButton icon="check" size={14} iconColor="white" />
          </View>
        )}
        {hover && (
          <View style={styles.pin}>
            <IconButton icon="pin-outline" size={18} />
          </View>
        )}
        <Text style={styles.text}>{title}</Text>
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
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 6, 

    elevation: 6, 
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
});