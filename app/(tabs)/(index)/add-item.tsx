import { getCategories, saveBudgetItem } from "@/constants/storage";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import SelectDropdown from "react-native-select-dropdown";

const AddItem = () => {
  const router = useRouter();
  const [categories, setCategories] = React.useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<
    string | null
  >();
  const [amount, setAmount] = React.useState<number | null>(null);
  const [description, setDescription] = React.useState<string>("");

  // location
  const [displayCurrentAddress, setDisplayCurrentAddress] = useState(
    "Location Loading....."
  );
  const [coords, setCoords] = useState({ latitude: 0, longitude: 0 });
  const [locationServicesEnabled, setLocationServicesEnabled] = useState(false);
  useEffect(() => {
    checkIfLocationEnabled();
    getCurrentLocation();
  }, []);
  //check if location is enable or not
  const checkIfLocationEnabled = async () => {
    let enabled = await Location.hasServicesEnabledAsync(); //returns true or false
    if (!enabled) {
      //if not enable
      // Alert.alert("Location not enabled", "Please enable your Location", [
      //   {
      //     text: "Cancel",
      //     onPress: () => console.log("Cancel Pressed"),
      //     style: "cancel",
      //   },
      //   { text: "OK", onPress: () => console.log("OK Pressed") },
      // ]);
      console.log("Location not enabled");
    } else {
      setLocationServicesEnabled(enabled); //store true into state
    }
  };
  //get current location
  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync(); //used for the pop up box where we give permission to use location
    console.log(status);
    if (status !== "granted") {
      // Alert.alert(
      //   "Permission denied",
      //   "Allow the app to use the location services",
      //   [
      //     {
      //       text: "Cancel",
      //       onPress: () => console.log("Cancel Pressed"),
      //       style: "cancel",
      //     },
      //     { text: "OK", onPress: () => console.log("OK Pressed") },
      //   ]
      // );
      console.log("Permission denied");
    }

    //get current position lat and long
    const { coords } = await Location.getCurrentPositionAsync();
    console.log(coords);
    setCoords(coords);

    if (coords) {
      const { latitude, longitude } = coords;
      console.log(latitude, longitude);
    }
  };
  const convertCoordsToAddress = async (
    latitude: number,
    longitude: number
  ) => {
    let address = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });
    console.log(address);
    setDisplayCurrentAddress(
      `${address[0].name}, ${address[0].city}, ${address[0].region}`
    );
  };

  useEffect(() => {
    convertCoordsToAddress(coords.latitude, coords.longitude);
  }, [coords]);

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
      address: displayCurrentAddress,
      long: coords.longitude,
      lat: coords.latitude,
    });
    router.back();
  };
  return (
    <ScrollView
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
      <Text>{displayCurrentAddress}</Text>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        region={{
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          onDragEnd={(e) => {
            console.log(e.nativeEvent.coordinate);
            setCoords(e.nativeEvent.coordinate);
          }}
          draggable
          coordinate={{
            latitude: coords.latitude,
            longitude: coords.longitude,
          }}
          title="Current Location"
          description="You are here"
        />
      </MapView>
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
    </ScrollView>
  );
};

export default AddItem;

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "50%",
  },
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
