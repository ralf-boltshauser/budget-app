import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function TabTwoScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.appBar}>
        <Text style={styles.title}>Settings</Text>
      </View>
      <Text>hello world</Text>
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
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
