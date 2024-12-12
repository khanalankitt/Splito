import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";

export default function BottomBar() {
  return (
    <View style={styles.bottomBar}>
      <Pressable style={styles.pressable}>
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
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: "#547bd4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  add: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
});
