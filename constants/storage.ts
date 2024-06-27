// storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BudgetEntry, Settings } from "./types";

// Budget items functions
export const saveBudgetItem = async (item: BudgetEntry): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(item);
    await AsyncStorage.setItem(`@budget_item_${item.id}`, jsonValue);
  } catch (e) {
    console.error("Error saving budget item", e);
  }
};

export const getBudgetItems = async (): Promise<BudgetEntry[]> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const items = await AsyncStorage.multiGet(
      keys.filter((key) => key.startsWith("@budget_item_"))
    );
    return items.map((item) => JSON.parse(item[1] || "") as BudgetEntry);
  } catch (e) {
    console.error("Error retrieving budget items", e);
    return [];
  }
};

export const deleteBudgetItem = async (id: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(`@budget_item_${id}`);
  } catch (e) {
    console.error("Error deleting budget item", e);
  }
};

// Settings functions
export const saveSettings = async (settings: Settings): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(settings);
    await AsyncStorage.setItem("@settings", jsonValue);
  } catch (e) {
    console.error("Error saving settings", e);
  }
};

export const getSettings = async (): Promise<Settings | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem("@settings");
    return jsonValue != null ? (JSON.parse(jsonValue) as Settings) : null;
  } catch (e) {
    console.error("Error retrieving settings", e);
    return null;
  }
};

export const getCategories = async (): Promise<string[]> => {
  // retrieve settings and return cateogries
  try {
    const settings = await getSettings();
    return settings?.categories || [];
  } catch (e) {
    console.error("Error retrieving categories", e);
    return [];
  }
};
