import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';

export default function KeepHeader() {
  const [searchText, setSearchText] = React.useState("");
  const { width } = useWindowDimensions();

  const isMobile = width < 768;

  return (
    <View style={styles.wrapper}>
      
      <View style={[styles.leftSection, isMobile ? { minWidth: 0 } : {minWidth: 150}]}>
        <Pressable style={styles.iconButton}>
          <Ionicons name="menu" size={24} color="#5f6368" />
        </Pressable>

        {!isMobile && (
          <View style={styles.logoContainer}>
            <Image
              source={{
                uri: "https://www.gstatic.com/images/branding/product/1x/keep_2020q4_48dp.png",
              }}
              style={styles.logoIcon}
            />
            <Text style={styles.logoText}>Keep</Text>
          </View>
        )}
      </View>

      <View
        style={[
          styles.searchContainer,
          isMobile && styles.searchMobile,
        ]}
      >
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#5f6368" />

          <TextInput
            style={styles.input}
            placeholder="Поиск"
            placeholderTextColor="#5f6368"
            value={searchText}
            onChangeText={setSearchText}
          />

          {searchText.length > 0 && (
            <Ionicons
              onPress={() => setSearchText("")}
              name="close"
              size={22}
              color="#5f6368"
            />
          )}
        </View>
      </View>

      <View style={styles.rightSection}>
          <>
            <Ionicons name="refresh" size={24} color="#5f6368" style={styles.sideIcon} />
            <Ionicons name="settings-outline" size={22} color="#5f6368" style={styles.sideIcon} />
            <MaterialCommunityIcons name="apps" size={24} color="#5f6368" style={styles.sideIcon} />
          </>

        <Pressable style={styles.avatar}>
          <Text style={{ color: "#fff", fontSize: 12 }} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchMobile: {
    marginHorizontal: 8,
  },
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    height: 64,
    paddingHorizontal: 8,
    borderBottomColor: "#e0e0e0",
    borderBottomWidth: 1,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 4,
  },
  logoIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  logoText: {
    fontSize: 22,
    color: "#5f6368",
    marginLeft: 4,
  },
  searchContainer: {
    flex: 1,
    maxWidth: 720, 
    marginHorizontal: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f3f4",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    ...Platform.select({
      web: {
        outlineStyle: "none",
      },
    }),
  },
  closeIcon: {
    marginLeft: 10,
    cursor: "pointer",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  sideIcon: {
    marginHorizontal: 10,
    cursor: "pointer",
  },
  iconButton: {
    padding: 10,

  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#96929c",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    marginRight: 8,
  },
});