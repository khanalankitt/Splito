import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Modal,
  Button,
  StatusBar,
} from "react-native";
import React, { useState } from "react";
import Form from "./form";
import BottomBar from "./bottomBar";

export default function Nav() {
  const [modalVisible, setModalVisible] = useState(false);
  const handleModal = () => {
    setModalVisible(!modalVisible);
  };
  return (
    <>
      <View style={styles.nav}>
        <StatusBar backgroundColor="#547bd4" barStyle="default" />
        <Text style={styles.text} className="text-center">
          Splito
        </Text>
        <Modal
          visible={modalVisible}
          animationType="slide" //or fade
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.pressableContainer}>
            <Pressable onPress={handleModal}>
              <Text className="text-5xl text-white font-bold text-left">
                {" ←"}
              </Text>
            </Pressable>
          </View>
          <Form />
        </Modal>
      </View>
      <View className="h-16 w-full flex items-center justify-center bg-[#547bd4] rounded-b-[50px] ">
        <Text className="text-lg font-semibold text-white">
          Split the bills like nobody does{" "}
        </Text>
      </View>
      <BottomBar
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 40,
    fontWeight: "bold",
    paddingLeft: 10,
    color: "white",
  },
  button: {
    height: 35,
    width: "auto",
    borderRadius: 8,
    backgroundColor: "white",
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  nav: {
    backgroundColor: "#547bd4",
    height: 60,
    flexDirection: "row",
    justifyContent: "center",
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
    alignItems: "flex-start",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
});
