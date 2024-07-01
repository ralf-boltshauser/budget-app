import {
  deleteWishlistItem,
  getWishlistItems,
  saveWishlistItem,
} from "@/constants/storage";
import { WishlistItem } from "@/constants/types";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  const [facing, setFacing] = useState("back");
  const [addingItem, setAddingItem] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<null | string>(null);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    const loadWishlistItems = async () => {
      try {
        const items = await getWishlistItems();
        setWishlistItems(items);
      } catch (e) {
        console.error("Error loading wishlist items", e);
      }
    };

    loadWishlistItems();
  }, [addingItem]);

  // add camera ref
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
    cameraRef.current?.takePictureAsync().then((photo) => {
      if (photo) setPhoto(photo.uri);
    });
  }

  const handleSaveWishlistItem = async (): Promise<void> => {
    if (!photo) return;
    try {
      saveWishlistItem({
        id: Math.random().toString(36).substring(7),
        date: new Date().toISOString(),
        imageUri: photo,
      });
      setPhoto(null);
      setAddingItem(false);
    } catch (e) {
      console.error("Error saving wishlist item", e);
    }
  };

  const handleDeleteItem = async (id: string): Promise<void> => {
    try {
      deleteWishlistItem(id);
      setWishlistItems((items) => items.filter((item) => item.id !== id));
    } catch (e) {
      console.error("Error deleting wishlist item", e);
    }
  };

  return (
    <View style={styles.container}>
      {addingItem ? (
        <>
          {photo ? (
            <View style={styles.camera}>
              <ImageBackground source={{ uri: photo }} style={{ flex: 1 }}>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => setPhoto(null)}
                  >
                    <Text style={styles.text}>Retake</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleSaveWishlistItem}
                  >
                    <Text style={styles.text}>Save</Text>
                  </TouchableOpacity>
                </View>
              </ImageBackground>
            </View>
          ) : (
            <CameraView style={styles.camera} ref={cameraRef}>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={toggleCameraFacing}
                >
                  <Text style={styles.text}>Take photo</Text>
                </TouchableOpacity>
              </View>
            </CameraView>
          )}
        </>
      ) : (
        <SafeAreaView
          style={{
            flex: 1,
            padding: 16,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              paddingTop: 16,
            }}
          >
            Wishlist
          </Text>
          <ScrollView>
            <Button
              title="Add item"
              onPress={() => setAddingItem(true)}
              disabled={addingItem}
            />
            <View style={styles.gridRow}>
              {wishlistItems.map((item) => (
                <View key={item.id} style={styles.gridItem}>
                  <ImageBackground
                    source={{ uri: item.imageUri }}
                    style={{
                      width: 160,
                      height: 160,
                      borderRadius: 16,
                      overflow: "hidden",
                      margin: 4,
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      alignItems: "flex-end",
                    }}
                  >
                    <Ionicons
                      name="trash"
                      size={24}
                      style={{
                        color: "red",
                        backgroundColor: "white",
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        padding: 4,
                        margin: 4,
                      }}
                      onPress={() => handleDeleteItem(item.id)}
                    />
                  </ImageBackground>
                </View>
              ))}
            </View>
          </ScrollView>
        </SafeAreaView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  gridRow: {
    display: "flex",
    flexGrow: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  gridItem: {
    margin: 2,
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
