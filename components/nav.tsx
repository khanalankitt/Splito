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
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function Nav() {
  const { toggleSidebarVisibility } = useAuth();
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const handleModal = () => {
    setModalVisible(false);
  };

  const handleMenuPress = () => {
    toggleSidebarVisibility();
  };

  return (
    <>
      <View style={[styles.nav, { backgroundColor: colors.primary }]}>
        <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
        <Text style={[styles.text, styles.textCenter]}>Splito</Text>
        <Pressable onPress={handleMenuPress}>
          <Text style={styles.menu}>☰</Text>
        </Pressable>
        <Modal
          visible={modalVisible}
          animationType="slide" //or fade
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={[styles.pressableContainer, { backgroundColor: colors.primary }]}>
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
      <View style={[styles.bottomBarContainer, { backgroundColor: colors.primary }]}>
        <Text
          style={[
            styles.textLg,
            styles.fontSemibold,
            styles.textWhite,
            styles.negativeMarginTop,
            { backgroundColor: colors.primary }
          ]}
        >
          Split bills like nobody
        </Text>
      </View>
      <BottomBar setModalVisible={setModalVisible} />
    </>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 40,
    fontWeight: "bold",
    paddingLeft: 10,
    color: "white",
    width: "100%",
  },
  menu: {
    position: "absolute",
    right: 20,
    top: -30,
    color: "white",
    fontWeight: "bold",
    fontSize: 30,
    padding: 10,
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
    height: 60,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
  pressableContainer: {
    height: 60,
    alignItems: "flex-start",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  bottomBarContainer: {
    height: 54,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
});
