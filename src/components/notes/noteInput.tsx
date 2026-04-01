// components/notes/GoogleKeepNote.tsx
import { useGlobal } from '@/context/GlobalContext';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { IconButton, Surface } from 'react-native-paper';

const NOTE_COLORS = {
  default: { background: '#ffffff', border: '#e0e0e0' },
  red: { background: '#f28b82', border: '#d66c64' },
  orange: { background: '#fbbc04', border: '#e0a800' },
  yellow: { background: '#fff475', border: '#e6dc5e' },
  green: { background: '#ccff90', border: '#b3e87d' },
  teal: { background: '#a7ffeb', border: '#80e8d6' },
  blue: { background: '#cbf0f8', border: '#b3e0f0' },
  darkBlue: { background: '#aecbfa', border: '#9ab8e8' },
  purple: { background: '#d7aefb', border: '#c496e8' },
  pink: { background: '#fdcfe8', border: '#e8b8d6' },
  brown: { background: '#e6c9a8', border: '#d6b896' },
  gray: { background: '#e8eaed', border: '#dadce0' },
};

const GoogleKeepNote = () => {
  const { theme, addNote, user } = useGlobal();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>('default'); // ИСПРАВЛЕНИЕ: явный тип string
  const [showColorMenu, setShowColorMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showCollaboratorsModal, setShowCollaboratorsModal] = useState(false);
  const [hasReminder, setHasReminder] = useState(false);
  const [reminderDate, setReminderDate] = useState<Date | null>(null);
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [newCollaborator, setNewCollaborator] = useState("");
  const [hasImage, setHasImage] = useState(false);
  const [imageName, setImageName] = useState("");
  const [labels, setLabels] = useState<string[]>([]);
  
  const [history, setHistory] = useState<{title: string, text: string}[]>([{title: "", text: ""}]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const isDark = theme === 'dark';
  const currentColor = NOTE_COLORS[selectedColor as keyof typeof NOTE_COLORS];
  
  const getAdaptiveColor = (light: string, dark: string) => isDark ? dark : light;
  const textColor = getAdaptiveColor('#202124', '#e8eaed');
  const placeholderColor = getAdaptiveColor('#757575', '#9aa0a6');

  const saveToHistory = (newTitle: string, newText: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ title: newTitle, text: newText });
    if (newHistory.length > 50) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      const prev = history[prevIndex];
      setTitle(prev.title);
      setText(prev.text);
      setHistoryIndex(prevIndex);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const next = history[nextIndex];
      setTitle(next.title);
      setText(next.text);
      setHistoryIndex(nextIndex);
    }
  };

  useEffect(() => {
    if (isEditing) {
      const timeoutId = setTimeout(() => {
        saveToHistory(title, text);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [title, text]);

  const handleAddCollaborator = () => {
    if (newCollaborator && !collaborators.includes(newCollaborator)) {
      setCollaborators([...collaborators, newCollaborator]);
      setNewCollaborator("");
    }
  };

  const handleRemoveCollaborator = (email: string) => {
    setCollaborators(collaborators.filter(c => c !== email));
  };

  const handleAddImage = () => {
    setImageName(`image_${Date.now()}.jpg`);
    setHasImage(true);
  };

  const handleRemoveImage = () => {
    setHasImage(false);
    setImageName("");
  };

  const handleSetReminder = () => {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    setReminderDate(tomorrow);
    setHasReminder(true);
  };

  const handleRemoveReminder = () => {
    setHasReminder(false);
    setReminderDate(null);
  };

  // ИСПРАВЛЕНИЕ: явная передача color в заметку
  const saveNoteToDB = async (options: {
    isArchived?: boolean;
    isDeleted?: boolean;
    isPinned?: boolean;
    color?: string;
    hasReminder?: boolean;
    reminderDate?: Date | null;
    collaborators?: string[];
    hasImage?: boolean;
    imageName?: string;
    labels?: string[];
  } = {}) => {
    if (!user) {
      Alert.alert('Ошибка', 'Пользователь не авторизован');
      return;
    }

    if (!text.trim() && !title.trim()) {
      return;
    }

    try {
      const noteData = {
        title: title.trim(),
        text: text.trim(),
        user_id: user.id,
        is_pinned: options.isPinned || false,
        color: options.color || selectedColor, // ИСПРАВЛЕНИЕ: используем selectedColor как fallback
        has_reminder: options.hasReminder || false,
        reminder_date: options.reminderDate?.toISOString() || null,
        collaborators: JSON.stringify(options.collaborators || []),
        has_image: options.hasImage || false,
        image_name: options.imageName || null,
        labels: JSON.stringify(options.labels || []),
        is_archived: options.isArchived || false,
        is_deleted: options.isDeleted || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log('Saving note with color:', noteData.color); // Для отладки
      await addNote(noteData);
      
    } catch (error) {
      console.error('Error saving note:', error);
      Alert.alert('Ошибка', 'Не удалось сохранить заметку');
    }
  };

  const handleArchive = async () => {
    await saveNoteToDB({
      isPinned,
      color: selectedColor, // ИСПРАВЛЕНИЕ: явная передача цвета
      hasReminder,
      reminderDate,
      collaborators,
      hasImage,
      imageName: hasImage ? imageName : undefined,
      labels,
      isArchived: true,
    });
    resetState();
  };

  const handleDelete = async () => {
    Alert.alert(
      "Удалить заметку?",
      "Заметка будет перемещена в корзину",
      [
        { text: "Отмена", style: "cancel" },
        { 
          text: "Удалить", 
          style: "destructive",
          onPress: async () => {
            await saveNoteToDB({
              isPinned,
              color: selectedColor,
              hasReminder,
              reminderDate,
              collaborators,
              hasImage,
              imageName: hasImage ? imageName : undefined,
              labels,
              isDeleted: true,
            });
            resetState();
          }
        },
      ]
    );
  };

  const handleMakeCopy = async () => {
    await saveNoteToDB({
      isPinned: false,
      color: selectedColor,
      hasReminder: false,
      reminderDate: null,
      collaborators: [],
      hasImage: false,
      imageName: undefined,
      labels,
    });
    setTitle(`${title} (копия)`);
    resetState(false);
  };

  const handleClose = async () => {
    await saveNoteToDB({
      isPinned,
      color: selectedColor,
      hasReminder,
      reminderDate,
      collaborators,
      hasImage,
      imageName: hasImage ? imageName : undefined,
      labels,
    });
    resetState();
  };

  const resetState = (closeEditing = true) => {
    if (closeEditing) setIsEditing(false);
    setTitle("");
    setText("");
    setIsPinned(false);
    setSelectedColor('default'); // Сброс цвета
    setHasReminder(false);
    setReminderDate(null);
    setCollaborators([]);
    setHasImage(false);
    setImageName("");
    setLabels([]);
    setHistory([{title: "", text: ""}]);
    setHistoryIndex(0);
    setShowColorMenu(false);
    setShowMoreMenu(false);
    setShowCollaboratorsModal(false);
  };

  const formatReminderDate = (date: Date) => {
    return date.toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isEditing) {
    return (
      <View style={[styles.screen, { backgroundColor: isDark ? '#202124' : '#f5f5f5' }]}>
        <View style={styles.wrapper}>
          <Surface 
            style={[
              styles.collapsedCard, 
              { 
                backgroundColor: currentColor.background, 
                borderColor: currentColor.border,
              }
            ]} 
            elevation={2}
          >
            <Pressable 
              style={styles.pressableArea} 
              onPress={() => setIsEditing(true)}
            >
              <Text style={[styles.placeholder, { color: placeholderColor }]}>Заметка...</Text>
            </Pressable>
            <View style={styles.collapsedActions}>
              <IconButton 
                icon={isPinned ? "pin" : "pin-outline"} 
                size={22} 
                onPress={() => setIsPinned(!isPinned)}
                iconColor={isDark ? '#e8eaed' : '#5f6368'}
              />
              <IconButton 
                icon="palette-outline" 
                size={22} 
                onPress={() => setShowColorMenu(true)}
                iconColor={isDark ? '#e8eaed' : '#5f6368'}
              />
              <IconButton 
                icon="image-outline" 
                size={22} 
                onPress={handleAddImage}
                iconColor={isDark ? '#e8eaed' : '#5f6368'}
              />
            </View>
          </Surface>

          <Modal
            transparent
            visible={showColorMenu}
            animationType="fade"
            onRequestClose={() => setShowColorMenu(false)}
          >
            <Pressable 
              style={styles.modalOverlay}
              onPress={() => setShowColorMenu(false)}
            >
              <View style={[styles.colorPicker, { backgroundColor: isDark ? '#202124' : '#fff' }]}>
                {Object.entries(NOTE_COLORS).map(([key, color]) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color.background, borderColor: color.border },
                      selectedColor === key && styles.colorOptionSelected
                    ]}
                    onPress={() => {
                      setSelectedColor(key); // ИСПРАВЛЕНИЕ: key уже string
                      setShowColorMenu(false);
                    }}
                  >
                    {selectedColor === key && (
                      <IconButton icon="check" size={20} iconColor="#202124" style={{margin: 0}} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </Pressable>
          </Modal>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: isDark ? '#202124' : '#f5f5f5' }]}>
      <View style={styles.wrapper}>
        <Surface 
          style={[
            styles.expandedCard, 
            { 
              backgroundColor: currentColor.background, 
              borderColor: currentColor.border,
            }
          ]} 
          elevation={4}
        >
          <View style={styles.header}>
            <TextInput
              placeholder="Название"
              placeholderTextColor={placeholderColor}
              style={[styles.titleInput, { color: textColor }]}
              autoFocus
              value={title}
              onChangeText={setTitle}
            />
            <IconButton 
              icon={isPinned ? "pin" : "pin-outline"} 
              size={22}
              onPress={() => setIsPinned(!isPinned)}
              iconColor={isPinned ? "#1a73e8" : (isDark ? '#e8eaed' : '#5f6368')}
            />
          </View>

          {hasImage && (
            <View style={styles.imageContainer}>
              <View style={[styles.imagePlaceholder, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                <Text style={[styles.imageName, { color: textColor }]}>{imageName}</Text>
                <IconButton 
                  icon="close" 
                  size={20} 
                  onPress={handleRemoveImage}
                  iconColor={isDark ? '#e8eaed' : '#5f6368'}
                  style={{margin: 0}}
                />
              </View>
            </View>
          )}

          <TextInput
            placeholder="Заметка..."
            placeholderTextColor={placeholderColor}
            multiline
            style={[styles.noteInput, { color: textColor }]}
            value={text}
            onChangeText={setText}
          />

          {hasReminder && reminderDate && (
            <View style={[styles.reminderContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
              <IconButton icon="bell-ring" size={18} iconColor="#1a73e8" style={{margin: 0}} />
              <Text style={[styles.reminderText, { color: textColor }]}>
                {formatReminderDate(reminderDate)}
              </Text>
              <IconButton 
                icon="close" 
                size={16} 
                onPress={handleRemoveReminder}
                iconColor={isDark ? '#e8eaed' : '#5f6368'}
                style={{margin: 0}}
              />
            </View>
          )}

          {collaborators.length > 0 && (
            <View style={[styles.collaboratorsSection, { borderTopColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#9aa0a6' : '#5f6368' }]}>Совместный доступ:</Text>
              <View style={styles.collaboratorsList}>
                {collaborators.map((email, index) => (
                  <View key={index} style={[styles.collaboratorChip, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                    <Text style={[styles.collaboratorText, { color: textColor }]}>{email}</Text>
                    <IconButton 
                      icon="close" 
                      size={16} 
                      onPress={() => handleRemoveCollaborator(email)}
                      iconColor={isDark ? '#e8eaed' : '#5f6368'}
                      style={{margin: 0}}
                    />
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={[styles.footer, { borderTopColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]}>
            <View style={styles.toolbar}>
              <IconButton 
                icon={hasReminder ? "bell-ring" : "bell-plus-outline"} 
                size={18}
                onPress={hasReminder ? handleRemoveReminder : handleSetReminder}
                iconColor={hasReminder ? "#1a73e8" : (isDark ? '#e8eaed' : '#5f6368')}
                style={styles.toolbarButton}
              />
              
              <IconButton 
                icon="account-plus-outline" 
                size={18}
                onPress={() => setShowCollaboratorsModal(true)}
                iconColor={isDark ? '#e8eaed' : '#5f6368'}
                style={styles.toolbarButton}
              />
              
              <IconButton 
                icon="palette-outline" 
                size={18}
                onPress={() => setShowColorMenu(true)}
                iconColor={isDark ? '#e8eaed' : '#5f6368'}
                style={styles.toolbarButton}
              />
              
              <IconButton 
                icon={hasImage ? "image" : "image-outline"} 
                size={18}
                onPress={hasImage ? handleRemoveImage : handleAddImage}
                iconColor={hasImage ? "#1a73e8" : (isDark ? '#e8eaed' : '#5f6368')}
                style={styles.toolbarButton}
              />
              
              <IconButton 
                icon="archive-arrow-down-outline" 
                size={18}
                onPress={handleArchive}
                iconColor={isDark ? '#e8eaed' : '#5f6368'}
                style={styles.toolbarButton}
              />
              
              <IconButton 
                icon="dots-vertical" 
                size={18}
                onPress={() => setShowMoreMenu(true)}
                iconColor={isDark ? '#e8eaed' : '#5f6368'}
                style={styles.toolbarButton}
              />
              
              <IconButton 
                icon="undo" 
                size={18}
                onPress={handleUndo}
                disabled={historyIndex <= 0}
                iconColor={historyIndex <= 0 ? (isDark ? '#5f6368' : '#bdc1c6') : (isDark ? '#e8eaed' : '#5f6368')}
                style={styles.toolbarButton}
              />
              
              <IconButton 
                icon="redo" 
                size={18}
                onPress={handleRedo}
                disabled={historyIndex >= history.length - 1}
                iconColor={historyIndex >= history.length - 1 ? (isDark ? '#5f6368' : '#bdc1c6') : (isDark ? '#e8eaed' : '#5f6368')}
                style={styles.toolbarButton}
              />
            </View>
            
            <Pressable 
              onPress={handleClose}
              style={styles.closeButton}
            >
              <Text style={[styles.closeButtonText, { color: textColor }]}>Закрыть</Text>
            </Pressable>
          </View>
        </Surface>

        <Modal
          transparent
          visible={showColorMenu}
          animationType="fade"
          onRequestClose={() => setShowColorMenu(false)}
        >
          <Pressable 
            style={styles.modalOverlay}
            onPress={() => setShowColorMenu(false)}
          >
            <View style={[styles.colorPicker, { backgroundColor: isDark ? '#202124' : '#fff' }]}>
              {Object.entries(NOTE_COLORS).map(([key, color]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color.background, borderColor: color.border },
                    selectedColor === key && styles.colorOptionSelected
                  ]}
                  onPress={() => {
                    setSelectedColor(key);
                    setShowColorMenu(false);
                  }}
                >
                  {selectedColor === key && (
                    <IconButton icon="check" size={20} iconColor="#202124" style={{margin: 0}} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </Pressable>
        </Modal>

        <Modal
          transparent
          visible={showCollaboratorsModal}
          animationType="slide"
          onRequestClose={() => setShowCollaboratorsModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, { backgroundColor: isDark ? '#202124' : '#fff' }]}>
              <Text style={[styles.modalTitle, { color: textColor }]}>Совместный доступ</Text>
              <View style={styles.inputRow}>
                <TextInput
                  placeholder="Email collaborator"
                  placeholderTextColor={placeholderColor}
                  style={[styles.collaboratorInput, { color: textColor, backgroundColor: isDark ? '#3c4043' : '#fff', borderColor: isDark ? '#3c4043' : '#dadce0' }]}
                  value={newCollaborator}
                  onChangeText={setNewCollaborator}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                <Pressable 
                  style={[styles.addButton, { backgroundColor: '#1a73e8' }]}
                  onPress={handleAddCollaborator}
                >
                  <Text style={styles.addButtonText}>Добавить</Text>
                </Pressable>
              </View>
              <Pressable 
                style={styles.closeModalButton}
                onPress={() => setShowCollaboratorsModal(false)}
              >
                <Text style={[styles.closeModalButtonText, { color: '#1a73e8' }]}>Готово</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        <Modal
          transparent
          visible={showMoreMenu}
          animationType="fade"
          onRequestClose={() => setShowMoreMenu(false)}
        >
          <Pressable 
            style={styles.modalOverlay}
            onPress={() => setShowMoreMenu(false)}
          >
            <View style={[styles.menuContainer, { backgroundColor: isDark ? '#3c4043' : '#fff' }]}>
              <Pressable 
                style={styles.menuItem}
                onPress={() => {
                  handleArchive();
                  setShowMoreMenu(false);
                }}
              >
                <IconButton icon="archive-arrow-down-outline" size={20} iconColor={isDark ? '#e8eaed' : '#5f6368'} style={{margin: 0}} />
                <Text style={[styles.menuItemText, { color: textColor }]}>Архивировать</Text>
              </Pressable>
              <Pressable 
                style={styles.menuItem}
                onPress={() => {
                  handleDelete();
                  setShowMoreMenu(false);
                }}
              >
                <IconButton icon="delete-outline" size={20} iconColor={isDark ? '#e8eaed' : '#5f6368'} style={{margin: 0}} />
                <Text style={[styles.menuItemText, { color: textColor }]}>Удалить</Text>
              </Pressable>
              <Pressable 
                style={styles.menuItem}
                onPress={() => {
                  handleMakeCopy();
                  setShowMoreMenu(false);
                }}
              >
                <IconButton icon="content-copy" size={20} iconColor={isDark ? '#e8eaed' : '#5f6368'} style={{margin: 0}} />
                <Text style={[styles.menuItemText, { color: textColor }]}>Создать копию</Text>
              </Pressable>
            </View>
          </Pressable>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  wrapper: { width: '100%', paddingHorizontal: 16, paddingTop: 32 },
  collapsedCard: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 8, height: 46,
    borderWidth: 1, maxWidth: 600, width: '100%', alignSelf: 'center', paddingLeft: 16,
  },
  expandedCard: {
    borderRadius: 8, borderWidth: 1, maxWidth: 600, width: '100%',
    alignSelf: 'center', paddingTop: 8, paddingBottom: 8,
  },
  pressableArea: { flex: 1, height: '100%', justifyContent: 'center' },
  placeholder: { fontSize: 16 },
  collapsedActions: { flexDirection: 'row' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8 },
  titleInput: { flex: 1, fontSize: 18, fontWeight: '700', paddingVertical: 10 },
  imageContainer: { paddingHorizontal: 16, paddingBottom: 12 },
  imagePlaceholder: { flexDirection: 'row', alignItems: 'center', borderRadius: 8, padding: 12 },
  imageName: { flex: 1, fontSize: 14 },
  noteInput: { fontSize: 14, paddingHorizontal: 16, paddingBottom: 20, minHeight: 40, textAlignVertical: 'top' },
  reminderContainer: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16,
    paddingVertical: 8, borderRadius: 8, marginHorizontal: 16, marginBottom: 12,
  },
  reminderText: { flex: 1, fontSize: 14, marginLeft: 8 },
  collaboratorsSection: {
    paddingHorizontal: 16, paddingBottom: 12, borderTopWidth: 1,
    paddingTop: 12, marginHorizontal: 16,
  },
  sectionTitle: { fontSize: 12, marginBottom: 8, fontWeight: '600' },
  collaboratorsList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  collaboratorChip: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 16,
    paddingHorizontal: 12, paddingVertical: 4,
  },
  collaboratorText: { fontSize: 13, marginRight: 4 },
  footer: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 8, paddingBottom: 4, borderTopWidth: 1, paddingTop: 8,
  },
  toolbar: { flexDirection: 'row', flex: 1 },
  toolbarButton: { margin: 0 },
  closeButton: { paddingHorizontal: 24, paddingVertical: 8 },
  closeButtonText: { fontWeight: '700', fontSize: 14, textTransform: 'uppercase' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  colorPicker: {
    flexDirection: 'row', flexWrap: 'wrap', borderRadius: 8,
    padding: 16, width: 280, gap: 8,
  },
  colorOption: {
    width: 40, height: 40, borderRadius: 20, borderWidth: 2,
    justifyContent: 'center', alignItems: 'center',
  },
  colorOptionSelected: { borderWidth: 3, borderColor: '#202124' },
  modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 24, minHeight: 300 },
  modalTitle: { fontSize: 20, fontWeight: '600', marginBottom: 20 },
  inputRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  collaboratorInput: {
    flex: 1, borderWidth: 1, borderRadius: 4,
    paddingHorizontal: 12, paddingVertical: 10, fontSize: 16,
  },
  addButton: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 4, justifyContent: 'center' },
  addButtonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  closeModalButton: { alignSelf: 'flex-end', paddingVertical: 10, paddingHorizontal: 16 },
  closeModalButtonText: { fontWeight: '600', fontSize: 14, textTransform: 'uppercase' },
  menuContainer: {
    borderRadius: 8, paddingVertical: 8, minWidth: 200, elevation: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25, shadowRadius: 3.84,
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  menuItemText: { fontSize: 14, marginLeft: 12 },
});

export default GoogleKeepNote;