import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
  Animated,
  BackHandler,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Sidebar() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { userName, userLogout, sidebarOpen, toggleSidebarVisibility } = useAuth();
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

  const router = useRouter();

  const slideAnim = useRef(new Animated.Value(-250)).current; // Initially hidden
  const overlayOpacity = useRef(new Animated.Value(0)).current; // Overlay opacity

  const closeSidebar = async () => {
    if (sidebarOpen) {
      toggleSidebarVisibility();
    }
  };

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: sidebarOpen ? 0 : -250, // Move sidebar in or out
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Animate overlay opacity
    Animated.timing(overlayOpacity, {
      toValue: sidebarOpen ? 0.5 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [sidebarOpen]);

  // Handle Android back button
  useEffect(() => {
    const backAction = () => {
      if (sidebarOpen) {
        closeSidebar();
        return true; // Prevent default back action
      }
      return false; // Allow default back action
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [sidebarOpen]);

  const handleLogout = () => {
    router.replace("/loginPage");
    userLogout();
  };

  const callForFood = async () => {
    if (!message) {
      alert("Please enter a message");
      return;
    }
    try {
      setLoading(true);
      const url = process.env.EXPO_PUBLIC_DISCORD_WEBHOOK_URL;
      
      if (!url) {
        alert("Discord webhook URL not configured");
        setLoading(false);
        return;
      }
      
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: message }),
      });
      setLoading(false);
      alert("Message sent successfully");
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
    setMessage("");
  };

  return (
    <>
      {/* Dark Overlay */}
      {sidebarOpen && (
        <TouchableWithoutFeedback onPress={closeSidebar}>
          <Animated.View
            style={[
              styles.overlay,
              {
                width: screenWidth,
                height: screenHeight,
                opacity: overlayOpacity,
              },
            ]}
          />
        </TouchableWithoutFeedback>
      )}

      {/* Sidebar */}
      <Animated.View
        style={[
          styles.sidebar,
          {
            height: screenHeight,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <View style={styles.wrapper}>
          <View style={styles.buttonContainer}>
            <Text style={styles.greet}>{`Hi ${userName}`}</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter text message"
              placeholderTextColor="#888"
              onChangeText={setMessage}
              value={message}
            />
            <Pressable onPress={callForFood} style={styles.khana}>
              {loading ? (
                <ActivityIndicator size="small" color="black" />
              ) : (
                <Text style={{ fontSize: 17, fontWeight: "bold" }}>
                  Khana🍕
                </Text>
              )}
            </Pressable>
          </View>
          <Pressable onPress={handleLogout} style={styles.logout}>
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "black",
    zIndex: 50,
  },
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 250,
    backgroundColor: "#000",
    padding: 10,
    zIndex: 100,
  },
  toggleButton: {
    position: "absolute",
    left: 10,
    top: 20,
    padding: 10,
    borderRadius: 5,
    zIndex: 101,
  },
  toggleButtonText: {
    fontSize: 20,
    color: "#fff",
  },
  greet: {
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 10,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 20,
  },
  wrapper: {
    height: "100%",
    justifyContent: "space-between",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginVertical: 10,
    borderRadius: 5,
    color: "#fff",
  },
  khana: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: "center",
  },
  logout: {
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  logoutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
