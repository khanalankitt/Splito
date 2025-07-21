import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useTheme } from "../contexts/ThemeContext";

interface BottomBarProps {
  setModalVisible: (visible: boolean) => void;
}

export default function BottomBar({ setModalVisible }: BottomBarProps) {
  const { colors } = useTheme();
  const handleModalChange = () => {
    setModalVisible(true);
  };
  return (
    <View style={[styles.bottomBar, { backgroundColor: colors.primary }]}>
      <Pressable 
        style={[styles.pressable, { 
          backgroundColor: colors.primary,
          borderColor: colors.background 
        }]} 
        onPress={handleModalChange}
      >
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
    borderTopStartRadius: 50,
    borderTopEndRadius: 50,
  },
  pressable: {
    position: "absolute", // Fix: Use absolute positioning
    bottom: 10, // Adjust to sit correctly above the bottom bar
    height: 90,
    width: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 10,
    zIndex: 100,
  },
  add: {
    color: "#fff",
    fontSize: 40,
    marginTop: -3,
    fontWeight: "bold",
    textAlign: "center",
  },
});
