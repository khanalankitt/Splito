import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";

interface BottomBarProps {
  setModalVisible: (visible: boolean) => void;
}

export default function BottomBar({ setModalVisible }: BottomBarProps) {
  const handleModalChange = () => {
    setModalVisible(true);
  };
  return (
    <View style={styles.bottomBar}>
      <Pressable style={styles.pressable} onPress={handleModalChange}>
        <Text style={styles.add}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#547bd4",
    borderTopStartRadius: 50,
    borderTopEndRadius: 50,
  },
  pressable: {
    position: "absolute", // Fix: Use absolute positioning
    bottom: 10, // Adjust to sit correctly above the bottom bar
    height: 90,
    width: 90,
    borderRadius: 45,
    backgroundColor: "#547bd4",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 10,
    zIndex: 100,
    borderColor: "#f6f6e9",
  },
  add: {
    color: "#fff",
    fontSize: 40,
    marginTop: -3,
    fontWeight: "bold",
    textAlign: "center",
  },
});
