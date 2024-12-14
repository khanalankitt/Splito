import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Link } from "expo-router";
import { postUsers, getUsers } from "@/app/api/route";

interface User {
  name: string;
}
export default function List() {
  const [newUser, setNewUser] = useState<string>();
  const [users, setUsers] = useState<User[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const [loading, setLoading] = useState(false);
  const SeperatorComponent = () => <View style={{ height: 10 }} />;
  const ListEmptyComponent = () => (
    <Text style={{ marginTop: 100 }} className="text-center text-xl">
      Add users to start
    </Text>
  );

  const handleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleAddNewUser = async () => {
    if (!newUser || newUser.trim() === "") {
      alert("User Name cannot be empty!");
      return;
    }
    setLoading(true);
    await postUsers(`${newUser}`, {
      name: newUser,
      toPay: 0,
      toReceive: 0,
    });

    setNewUser("");
    setTrigger(!trigger);
    setLoading(false);
    setModalVisible(!modalVisible);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await getUsers();
      const usersArray = Object.keys(res || {}).map((key) => ({
        id: key,
        name: res[key].name,
        toPay: res[key].toPay,
        toReceive: res[key].toReceive,
      }));
      setUsers(usersArray);
    };
    fetchUsers();
  }, [trigger]);
  // console.log(users);
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
        data={users}
        className="mt-5 h-[70%]"
        ListEmptyComponent={<ListEmptyComponent />}
        renderItem={({ item }) => (
          <Link
            href={{
              pathname: "/user/[user]",
              params: { user: item.name },
            }}
            asChild
          >
            <Pressable>
              <MoneyItem name={item.name} />
            </Pressable>
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
        <View className="w-full items-center justify-center">
          <Text className="text-3xl mt-5 font-bold text-primaryColor text-center">
            Add New User
          </Text>
          <TextInput
            value={newUser}
            onChangeText={(text) => setNewUser(text)}
            placeholder="Username"
            className="h-16 border-2 mt-5 border-gray-400 w-[90%] rounded-md px-2 py-0 font-semibold text-xl"
          />
          <Pressable
            style={styles.add}
            className="bg-primaryColor rounded-lg "
            onPress={handleAddNewUser}
          >
            <Text className="text-2xl text-white font-bold">
              {loading ? <Text>loading...</Text> : <Text>Add</Text>}
            </Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}
interface dataTypes {
  name: string;
}
const MoneyItem = ({ name }: dataTypes) => {
  return (
    <View style={styles.details}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>{name}</Text>
      <Text
        style={{ opacity: 0.5, textDecorationLine: "underline" }}
        className="font-semibold text-md"
      >
        More Details→
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  add: {
    paddingVertical: 5,
    paddingHorizontal: 50,
    marginTop: 20,
  },
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
