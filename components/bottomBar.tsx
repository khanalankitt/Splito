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
    backgroundColor: "#547bd4",
    borderTopStartRadius: 50,
    borderTopEndRadius: 50,
  },
  pressable: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: "#f6f6e9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    borderWidth: 3,
    borderColor: "#547bd4",
  },
  add: {
    color: "#547bd4",
    fontSize: 40,
    marginTop: -3,
    fontWeight: "bold",
    textAlign: "center",
  },
});
