import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";

interface BottomBarProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}

export default function BottomBar({
  modalVisible,
  setModalVisible,
}: BottomBarProps) {
  const handleModalChange = () => {
    setModalVisible(!modalVisible);
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
  },
  pressable: {
    height: 70,
    width: 70,
    borderRadius: 35,
    backgroundColor: "#547bd4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  add: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
});
