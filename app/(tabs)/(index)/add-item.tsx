import { getCategories, saveBudgetItem } from "@/constants/storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import SelectDropdown from "react-native-select-dropdown";

const AddItem = () => {
  const router = useRouter();
  const [categories, setCategories] = React.useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<
    string | null
  >();
  const [amount, setAmount] = React.useState<number | null>(null);
  const [description, setDescription] = React.useState<string>("");

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getCategories();
      setCategories(categories);
    };
    fetchCategories();
  }, []);

  const handleAddItem = () => {
    if (!selectedCategory || !amount) {
      return;
    }
    saveBudgetItem({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      category: selectedCategory || "",
      amount: amount || 0,
      description: description,
    });
    router.back();
  };
  return (
    <View
      style={{
        margin: 20,
      }}
    >
      <SelectDropdown
        data={categories}
        onSelect={(selectedItem, index) => {
          setSelectedCategory(selectedItem);
        }}
        renderButton={(selectedItem, isOpened) => {
          return (
            <View style={styles.dropdownButtonStyle}>
              <Text style={styles.dropdownButtonTxtStyle}>
                {selectedItem || "Select category"}
              </Text>
              <Ionicons
                name={isOpened ? "chevron-up" : "chevron-down"}
                style={styles.dropdownButtonArrowStyle}
              />
            </View>
          );
        }}
        renderItem={(item, index, isSelected) => {
          return (
            <View
              style={{
                ...styles.dropdownItemStyle,
                ...(isSelected && { backgroundColor: "#D2D9DF" }),
              }}
            >
              <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
        dropdownStyle={styles.dropdownMenuStyle}
      />
      <View style={{ marginVertical: 20 }}>
        <Text style={{ fontSize: 18 }}>Amount</Text>
        <TextInput
          style={{
            height: 50,
            borderColor: "#E9ECEF",
            borderWidth: 1,
            borderRadius: 12,
            paddingHorizontal: 12,
            fontSize: 18,
          }}
          onChange={(e) => setAmount(Number(e.nativeEvent.text))}
          keyboardType="numeric"
          placeholder="Enter amount"
        />
      </View>
      <View style={{ marginVertical: 20 }}>
        <Text style={{ fontSize: 18 }}>Description</Text>
        <TextInput
          style={{
            height: 50,
            borderColor: "#E9ECEF",
            borderWidth: 1,
            borderRadius: 12,
            paddingHorizontal: 12,
            fontSize: 18,
          }}
          onChange={(e) => setDescription(e.nativeEvent.text)}
          placeholder="Enter description"
        />
      </View>
      <View
        style={{
          marginVertical: 20,
        }}
      >
        <Ionicons
          name="add-circle"
          size={48}
          color="#007BFF"
          onPress={handleAddItem}
        />
      </View>
    </View>
  );
};

export default AddItem;

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    width: 200,
    height: 50,
    backgroundColor: "#E9ECEF",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: "#E9ECEF",
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
});
