// components/NoteCard.tsx
import { useGlobal } from "@/context/GlobalContext";
import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { IconButton, Surface } from "react-native-paper";

const NOTE_COLORS: Record<string, { background: string; border: string; darkBackground: string; darkBorder: string }> = {
  default: { background: '#ffffff', border: '#e0e0e0', darkBackground: '#202124', darkBorder: '#3c4043' },
  red: { background: '#f28b82', border: '#d66c64', darkBackground: '#c65a5a', darkBorder: '#b04a4a' },
  orange: { background: '#fbbc04', border: '#e0a800', darkBackground: '#d4a000', darkBorder: '#b88a00' },
  yellow: { background: '#fff475', border: '#e6dc5e', darkBackground: '#e6d84d', darkBorder: '#c9bd3d' },
  green: { background: '#ccff90', border: '#b3e87d', darkBackground: '#b3e87d', darkBorder: '#96cc66' },
  teal: { background: '#a7ffeb', border: '#80e8d6', darkBackground: '#80e8d6', darkBorder: '#66ccbd' },
  blue: { background: '#cbf0f8', border: '#b3e0f0', darkBackground: '#b3e0f0', darkBorder: '#96c9e6' },
  darkBlue: { background: '#aecbfa', border: '#9ab8e8', darkBackground: '#9ab8e8', darkBorder: '#7da3d9' },
  purple: { background: '#d7aefb', border: '#c496e8', darkBackground: '#c496e8', darkBorder: '#ab7dd9' },
  pink: { background: '#fdcfe8', border: '#e8b8d6', darkBackground: '#e8b8d6', darkBorder: '#d996bd' },
  brown: { background: '#e6c9a8', border: '#d6b896', darkBackground: '#d6b896', darkBorder: '#c9a37d' },
  gray: { background: '#e8eaed', border: '#dadce0', darkBackground: '#5f6368', darkBorder: '#4a4d52' },
};

interface NoteCardProps {
  note: {
    id: string;
    title: string;
    text: string;
    is_pinned?: boolean;
    color?: string;
    has_reminder?: boolean;
    has_image?: boolean;
    collaborators?: string;
    is_archived?: boolean;
    is_deleted?: boolean;
  };
  onPress: () => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
  onPin?: (id: string) => void;
}

export default function NoteCard({ note, onPress, onArchive, onDelete, onPin }: NoteCardProps) {
  const { theme } = useGlobal();
  const [showActions, setShowActions] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isDark = theme === 'dark';
  
  // ИСПРАВЛЕНИЕ ЦВЕТА - явное приведение и проверка
  const colorKey = (note.color as keyof typeof NOTE_COLORS) || 'default';
  const colorScheme = NOTE_COLORS[colorKey] || NOTE_COLORS.default;
  
  const backgroundColor = isDark ? colorScheme.darkBackground : colorScheme.background;
  const borderColor = isDark ? colorScheme.darkBorder : colorScheme.border;
  const textColor = isDark ? '#e8eaed' : '#202124';
  const iconColor = isDark ? '#e8eaed' : '#5f6368';
  const placeholderColor = isDark ? '#9aa0a6' : '#757575';

  const collaborators = note.collaborators ? JSON.parse(note.collaborators) as string[] : [];
  const hasCollaborators = collaborators.length > 0;

  // ИСПРАВЛЕНИЕ HOVER - используем таймауты вместо прямых onHoverOut
  const showActionsHandler = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setShowActions(true);
  };

  const hideActionsHandler = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setShowActions(false);
      setShowMenu(false);
    }, 300);
  };

  const handleArchive = (e: any) => {
    e.stopPropagation();
    onArchive?.(note.id);
  };

  const handleDelete = (e: any) => {
    e.stopPropagation();
    onDelete?.(note.id);
  };

  const handlePin = (e: any) => {
    e.stopPropagation();
    onPin?.(note.id);
  };

  // Очистка таймера при размонтировании
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  return (
    <View 
      style={styles.wrapper}
      onMouseEnter={showActionsHandler}
      onMouseLeave={hideActionsHandler}
    >
      <Pressable onPress={onPress} style={styles.pressable}>
        <Surface 
          style={[
            styles.card, 
            { 
              backgroundColor, 
              borderColor,
              shadowColor: isDark ? '#000' : '#000',
            }
          ]} 
          elevation={showActions ? 8 : 4}
        >
          {note.is_pinned && (
            <View style={styles.pinIndicator}>
              <IconButton icon="pin" size={16} iconColor="#1a73e8" style={{ margin: 0 }} />
            </View>
          )}

          {showActions && (
            <Pressable style={styles.check} onPress={handlePin}>
              <IconButton icon={note.is_pinned ? "check-box" : "check-box-outline"} size={14} iconColor="white" style={{ margin: 0 }} />
            </Pressable>
          )}

          <View style={styles.content}>
            {note.title ? (
              <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
                {note.title}
              </Text>
            ) : null}
            
            <Text 
              style={[styles.text, { color: textColor }]} 
              numberOfLines={note.title ? 4 : 6}
            >
              {note.text || ' '}
            </Text>

            {note.has_image && (
              <View style={styles.indicatorRow}>
                <IconButton icon="image" size={16} iconColor={iconColor} style={{ margin: 0 }} />
                <Text style={[styles.indicatorText, { color: placeholderColor }]}>Изображение</Text>
              </View>
            )}

            {note.has_reminder && (
              <View style={styles.indicatorRow}>
                <IconButton icon="bell-ring" size={16} iconColor="#1a73e8" style={{ margin: 0 }} />
                <Text style={[styles.indicatorText, { color: '#1a73e8' }]}>Напоминание</Text>
              </View>
            )}

            {hasCollaborators && (
              <View style={styles.indicatorRow}>
                <IconButton icon="account-group" size={16} iconColor={iconColor} style={{ margin: 0 }} />
                <Text style={[styles.indicatorText, { color: placeholderColor }]}>
                  {collaborators.length} {collaborators.length === 1 ? 'участник' : 'участника'}
                </Text>
              </View>
            )}
          </View>

          {showActions && (
            <View style={styles.actionBar}>
              <Pressable onPress={(e) => e.stopPropagation()}>
                <IconButton icon="palette-outline" size={18} iconColor={iconColor} />
              </Pressable>
              <Pressable onPress={(e) => e.stopPropagation()}>
                <IconButton 
                  icon={note.has_reminder ? "bell-ring" : "bell-plus-outline"} 
                  size={18} 
                  iconColor={note.has_reminder ? "#1a73e8" : iconColor}
                />
              </Pressable>
              <Pressable onPress={(e) => e.stopPropagation()}>
                <IconButton 
                  icon={hasCollaborators ? "account-group" : "account-plus-outline"} 
                  size={18} 
                  iconColor={iconColor}
                />
              </Pressable>
              <Pressable onPress={(e) => e.stopPropagation()}>
                <IconButton 
                  icon={note.has_image ? "image" : "image-outline"} 
                  size={18} 
                  iconColor={note.has_image ? "#1a73e8" : iconColor}
                />
              </Pressable>
              <Pressable onPress={handleArchive}>
                <IconButton icon="archive-arrow-down-outline" size={18} iconColor={iconColor} />
              </Pressable>
              
              <Pressable 
                onPress={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
              >
                <IconButton icon="dots-vertical" size={18} iconColor={iconColor} />
              </Pressable>
            </View>
          )}

          {showMenu && (
            <View 
              style={[styles.dropdownMenu, { backgroundColor: isDark ? '#3c4043' : '#fff', borderColor }]}
              onMouseEnter={showActionsHandler}
              onMouseLeave={hideActionsHandler}
            >
              <Pressable 
                style={styles.menuItem}
                onPress={(e) => {
                  e.stopPropagation();
                  handlePin(e);
                  setShowMenu(false);
                }}
              >
                <IconButton icon={note.is_pinned ? "pin-off" : "pin-outline"} size={18} iconColor={iconColor} style={{ margin: 0 }} />
                <Text style={[styles.menuItemText, { color: textColor }]}>
                  {note.is_pinned ? 'Открепить' : 'Закрепить'}
                </Text>
              </Pressable>
              <Pressable 
                style={styles.menuItem}
                onPress={(e) => {
                  e.stopPropagation();
                  handleArchive(e);
                  setShowMenu(false);
                }}
              >
                <IconButton icon="archive-arrow-down-outline" size={18} iconColor={iconColor} style={{ margin: 0 }} />
                <Text style={[styles.menuItemText, { color: textColor }]}>Архивировать</Text>
              </Pressable>
              <Pressable 
                style={[styles.menuItem, styles.menuItemDanger]}
                onPress={(e) => {
                  e.stopPropagation();
                  handleDelete(e);
                  setShowMenu(false);
                }}
              >
                <IconButton icon="delete-outline" size={18} iconColor="#ea4335" style={{ margin: 0 }} />
                <Text style={[styles.menuItemText, { color: '#ea4335' }]}>Удалить</Text>
              </Pressable>
            </View>
          )}
        </Surface>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  pressable: {
    position: 'relative',
  },
  card: {
    width: 320,
    minHeight: 140,
    maxHeight: 280,
    margin: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    position: 'relative',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  pinIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
  },
  check: {
    position: 'absolute',
    top: -12,
    left: -12,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#1a73e8',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  content: {
    flex: 1,
    paddingRight: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  indicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  indicatorText: {
    fontSize: 12,
    marginLeft: 4,
  },
  actionBar: {
    flexDirection: 'row',
    marginTop: 12,
    marginLeft: -8,
    zIndex: 3,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 40,
    right: 8,
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 4,
    minWidth: 180,
    zIndex: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  menuItemDanger: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  menuItemText: {
    fontSize: 14,
    marginLeft: 12,
  },
});