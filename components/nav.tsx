import { Pressable, StyleSheet, Text, View, Modal, Button, StatusBar } from "react-native";
import React, { useState } from "react";
import Form from "./form";

export default function Nav() {
  const [modalVisible, setModalVisible] = useState(false);
  const handleModal = () => {
    setModalVisible(!modalVisible);
  };
  return (
    <View style={styles.nav}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />

      <Text style={styles.text}>Splito</Text>
      <Pressable style={styles.button} onPress={handleModal}>
        <Text style={styles.buttonText}>Add Payment</Text>
      </Pressable>
      <Modal
        visible={modalVisible}
        animationType="slide" //or fade
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.pressableContainer}>
          <Pressable onPress={handleModal}>
            <Text style={styles.closeButton}>X</Text>
          </Pressable>
        </View>
        <Form/>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 30,
    fontWeight: "bold",
    paddingLeft: 10,
    color: "white",
  },
  button: {
    height: 40,
    width: "auto",
    borderRadius: 10,
    backgroundColor: "white",
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  nav: {
    backgroundColor: "#547bd4",
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  buttonText: {
    fontSize: 15,
    color: "#547bd4",
    fontWeight: "bold",
    textAlign: "center",
  },
  pressableContainer: {
    height: 60,
    backgroundColor: "#547bd4",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  closeButton: {
    color: "#547bd4",
    marginRight: 15,
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "white",
    fontWeight: "800",
  },
});
