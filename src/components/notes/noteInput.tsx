import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { IconButton, Surface } from 'react-native-paper';

const GoogleKeepNote = (props: { newNoteMethod: (title: string, text: string) => void }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  return (
    <View style={styles.screen}>
      <View style={styles.wrapper}>
        {!isEditing ? (
          <Surface style={styles.collapsedCard} elevation={2}>
            <Pressable 
              style={styles.pressableArea} 
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.placeholder}>Заметка...</Text>
            </Pressable>
            <View style={styles.collapsedActions}>
              <IconButton icon="checkbox-outline" size={22} onPress={() => {}} />
              <IconButton icon="brush" size={22} onPress={() => {}} />
              <IconButton icon="image-outline" size={22} onPress={() => {}} />
            </View>
          </Surface>
        ) : (
          <Surface style={styles.expandedCard} elevation={4}>
            <View style={styles.header}>
              <TextInput
                placeholder="Название"
                placeholderTextColor="#757575"
                style={styles.titleInput}
                autoFocus
                value={title}
                onChangeText={setTitle}
              />
              <IconButton icon="pin-outline" size={22} />
            </View>

            <TextInput
              placeholder="Заметка..."
              placeholderTextColor="#757575"
              multiline
              style={styles.noteInput}
              value={text}
              onChangeText={setText}
            />

            <View style={styles.footer}>
              <View style={styles.toolbar}>
                <IconButton icon="bell-plus-outline" size={18}  />
                <IconButton icon="account-plus-outline" size={18}  />
                <IconButton icon="palette-outline" size={18}  />
                <IconButton icon="image-outline" size={18}  />
                <IconButton icon="archive-arrow-down-outline" size={18}  />
                <IconButton icon="dots-vertical" size={18}  />
                <IconButton icon="undo" size={18}  disabled />
                <IconButton icon="redo" size={18}  disabled />
              </View>
              
              <Pressable 
                onPress={() => setIsEditing(false)} 
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText} onPress={() => {if(!text || !title) return; props.newNoteMethod(title, text); setIsEditing(false); setText(""); setTitle(""); }}>Закрыть</Text>
              </Pressable>
            </View>
          </Surface>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#ffffff', // или #f5f5f5 как на фоне Keep
  },
  wrapper: {
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  
  // Общие стили для обеих карточек
  collapsedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    height: 46,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    // Ограничение ширины и центрирование
    maxWidth: 600, 
    width: '100%',
    alignSelf: 'center',
    paddingLeft: 16,
  },
  expandedCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    // Ограничение ширины и центрирование
    maxWidth: 600, 
    width: '100%',
    alignSelf: 'center',
    paddingTop: 8,
  },

  // Специфичные стили содержимого
  pressableArea: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
  },
  placeholder: {
    fontSize: 16,
    color: '#757575',
  },
  collapsedActions: {
    flexDirection: 'row',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  titleInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#202124',
    paddingVertical: 10,
  },
  noteInput: {
    fontSize: 14,
    color: '#202124',
    paddingHorizontal: 16,
    paddingBottom: 20,
    minHeight: 40,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 4,
  },
  toolbar: {
    flexDirection: 'row',
    flex: 1,
    opacity: 0.7,
  },
  closeButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  closeButtonText: {
    color: '#202124',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default GoogleKeepNote;