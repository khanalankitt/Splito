import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import data from "./data";
import { Link } from "expo-router";

export default function List() {
  const SeperatorComponent = () => <View style={{ height: 10 }} />;
  const [modalVisible, setModalVisible] = useState(false);
  const handleModal = () => {
    setModalVisible(!modalVisible);
  };
  return (
    <View style={[styles.listContainer, { flex: 0 }]}>
      <View className=" h-auto flex flex-row justify-between w-[100%] ">
        <Text className="text-4xl mt-2 font-bold text-primaryColor">Users</Text>
        <Pressable
          className="h-auto w-auto flex items-center justify-center"
          onPress={handleModal}
        >
          <Text className="bg-primaryColor text-white p-3 font-bold rounded-lg">
            Add User
          </Text>
        </Pressable>
      </View>
      <FlatList
        scrollEnabled
        data={data}
        className="mt-5 h-[70%]"
        renderItem={({ item }) => (
          <Link
            href={{
              pathname: "/user/[user]",
              params: { user: item.name },
            }}
            asChild
          >
            <View>
              <MoneyItem name={item.name} clear={item.clear} />
            </View>
          </Link>
        )}
        ItemSeparatorComponent={SeperatorComponent}
      />
      <Modal
        visible={modalVisible}
        animationType="slide" 
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.pressableContainer}>
          <Pressable onPress={handleModal}>
            <Text className="text-5xl text-white font-bold text-left">
              {" ←"}
            </Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}
interface dataTypes {
  name: string;
  clear: Boolean;
}
const MoneyItem = ({ name, clear }: dataTypes) => {
  return (
    <View style={styles.details}>
      <Text style={{ fontSize: 17, fontWeight: "bold" }}>{name}</Text>
      {clear ? (
        <Text className="text-green-600 font-extrabold text-lg">Clear</Text>
      ) : (
        <Text className="text-red-500 font-extrabold text-lg">Not Clear</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 15,
    height: "auto",
    width: "100%",
    marginHorizontal: "auto",
    borderRadius: 10,
  },
  details: {
    padding: 10,
    height: 60,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#e8e9ed",
    borderColor: "#dddfe5",
    borderWidth: 1,
    elevation: 1,
  },
  status: {
    fontSize: 13,
    width: 90,
    padding: 7,
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    borderRadius: 10,
  },
  clear: {
    backgroundColor: "#55ae51",
  },
  notClear: {
    backgroundColor: "#f40b0b",
  },
  pressableContainer: {
    height: 60,
    backgroundColor: "#547bd4",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
});
