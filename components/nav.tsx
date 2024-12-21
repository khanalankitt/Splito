import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Modal,
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
        <Text style={[styles.text, styles.textCenter]}>Splito</Text>
        <Modal
          visible={modalVisible}
          animationType="slide" //or fade
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.pressableContainer}>
            <Pressable onPress={handleModal}>
              <Text
                style={[
                  styles.text5xl,
                  styles.textWhite,
                  styles.fontBold,
                  styles.textLeft,
                ]}
              >
                {" ←"}
              </Text>
            </Pressable>
          </View>
          <Form setModalVisible={setModalVisible} />
        </Modal>
      </View>
      <View style={styles.bottomBarContainer}>
        <Text
          style={[
            styles.textLg,
            styles.fontSemibold,
            styles.textWhite,
            styles.negativeMarginTop,
          ]}
        >
          Split bills like nobody
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
  textCenter: {
    textAlign: "center",
  },
  text5xl: {
    fontSize: 40,
  },
  textWhite: {
    color: "white",
  },
  fontBold: {
    fontWeight: "bold",
  },
  textLeft: {
    textAlign: "left",
  },
  textLg: {
    fontSize: 16,
  },
  fontSemibold: {
    fontWeight: "600",
  },
  negativeMarginTop: {
    marginTop: -24,
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
  bottomBarContainer: {
    height: 64,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#547bd4",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
});
