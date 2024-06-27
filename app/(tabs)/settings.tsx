import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { getSettings, saveSettings } from "@/constants/storage";
import { Settings } from "@/constants/types";
import { Ionicons } from "@expo/vector-icons";
export default function SettingsScreen() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [display, setDisplay] = useState<boolean>(false);
  const [roundAmounts, setRoundAmounts] = useState<boolean>(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState<string>("");

  useEffect(() => {
    const loadSettings = async () => {
      const savedSettings = await getSettings();
      if (savedSettings) {
        const { display, roundAmounts, categories } = savedSettings;
        setSettings(savedSettings);
        setDisplay(display);
        setRoundAmounts(roundAmounts);
        setCategories(categories);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    const newSettings: Settings = { display, roundAmounts, categories };
    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  const addCategory = () => {
    if (newCategory.trim()) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory("");
    }
  };

  const deleteCategory = (index: number) => {
    const newCategories = categories.filter((_, i) => i !== index);
    setCategories(newCategories);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.appBar}>
        <Text style={styles.title}>Settings</Text>
      </View>
      <View style={styles.settingRow}>
        <Text style={styles.label}>Display Decimal Places</Text>
        <Switch value={display} onValueChange={setDisplay} />
      </View>
      <View style={styles.settingRow}>
        <Text style={styles.label}>Round Amounts</Text>
        <Switch value={roundAmounts} onValueChange={setRoundAmounts} />
      </View>
      <FlatList
        data={categories}
        renderItem={({ item, index }) => (
          <View style={styles.categoryRow}>
            <Text style={styles.categoryText}>{item}</Text>
            <TouchableOpacity onPress={() => deleteCategory(index)}>
              <Ionicons name="trash-outline" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={<Text style={styles.label}>Categories</Text>}
        ListFooterComponent={
          <View style={styles.newCategoryRow}>
            <TextInput
              style={styles.input}
              placeholder="New Category"
              value={newCategory}
              onChangeText={setNewCategory}
            />
            <Ionicons.Button
              name="add-outline"
              backgroundColor="#2196F3"
              onPress={addCategory}
            >
              Add
            </Ionicons.Button>
          </View>
        }
        style={styles.flatList}
        contentContainerStyle={styles.flatListContent}
      />
      <View style={styles.saveButton}>
        <Ionicons.Button
          name="save-outline"
          backgroundColor="#2196F3"
          onPress={handleSave}
        >
          Save
        </Ionicons.Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    margin: 20,
  },
  appBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    flex: 1,
    marginRight: 10,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 5,
  },
  categoryText: {
    fontSize: 16,
    color: "black",
    flex: 1,
  },
  deleteButton: {
    color: "red",
  },
  newCategoryRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  saveButton: {
    marginTop: 20,
  },
  flatList: {
    flexGrow: 0,
    width: "100%",
  },
  flatListContent: {
    paddingVertical: 10,
  },
});
