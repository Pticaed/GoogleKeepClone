import { ScrollView, View } from "react-native";
import NoteCard from "../components/NoteCard";

export default function Home() {
  return (
    <ScrollView style={{ backgroundColor: "#ffffff" }}>
      <View
        style={{
          flexDirection: "row",  
          flexWrap: "wrap",       
          padding: 20,
        }}
      >
        <NoteCard title="pppp" />
        <NoteCard title="ллллллл" />
      </View>

    </ScrollView>
  );
}