import { getBudgetItems, getSettings } from "@/constants/storage";
import { BudgetEntry, Settings } from "@/constants/types";
import { Link, useNavigation, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const navigation = useNavigation();
  const router = useRouter();
  const [budgetEntries, setBudgetEntries] = React.useState<BudgetEntry[]>([]);
  const [settings, setSettings] = React.useState<Settings | null>(null);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const fetchBudgetEntries = async () => {
      const entries = await getBudgetItems();
      setBudgetEntries(entries);
    };
    const fetchSettings = async () => {
      const settings = await getSettings();
      setSettings(settings);
    };
    fetchSettings();
    fetchBudgetEntries();
  }, [router]);

  const format = (amount: number) => {
    if (!settings) {
      return amount;
    }
    if (settings.roundAmounts) {
      amount = Math.round(amount);
    }

    let amountStr = settings?.display
      ? amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'")
      : amount;

    if (settings?.roundAmounts) {
      amountStr += ".-";
    }

    return amountStr;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.appBar}>
        <Text style={styles.title}>Budget List</Text>
        <Link href={{ pathname: "add-item" }}>Add Item</Link>
      </View>
      <FlatList
        data={budgetEntries}
        style={{ width: "100%", flexGrow: 0 }}
        renderItem={({ item }) => (
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginVertical: 10,
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                {item.category}
              </Text>
              <Text>{format(item.amount)}</Text>
            </View>
            <Text>
              {item.description} @ {item.address}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListFooterComponent={() => <View style={styles.separator} />}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginVertical: 10,
          width: "100%",
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          Total
        </Text>
        <Text>
          {format(budgetEntries.reduce((acc, item) => acc + item.amount, 0))}
        </Text>
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
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 5,
    backgroundColor: "black",
    height: 1,
    width: "100%",
  },
});
