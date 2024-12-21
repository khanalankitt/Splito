import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Link } from "expo-router";
import { postUsers, getUsers } from "../app/api/route";

interface User {
  name: string;
}

export default function List() {
  const [newUser, setNewUser] = useState<string>();
  const [users, setUsers] = useState<User[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const SeperatorComponent = () => <View style={{ height: 10 }} />;
  const ListEmptyComponent = () => (
    <Text style={[styles.textCenter, styles.textXL, { marginTop: 100 }]}>
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
    await postUsers(`${newUser}`, newUser);

    setNewUser("");
    setTrigger(!trigger);
    setLoading(false);
    setModalVisible(!modalVisible);
  };

  const fetchUsers = async () => {
    setLoading(true);
    const res = await getUsers();
    const usersArray = Object.keys(res || {}).map((key) => ({
      name: key,
    }));
    setUsers(usersArray);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [trigger]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUsers();
    setRefreshing(false);
  };

  return (
    <View style={[styles.listContainer, { flex: 0 }]}>
      <View style={[styles.flexRow, styles.justifyBetween, styles.fullWidth]}>
        <Text
          style={[
            styles.text4XL,
            styles.mt2,
            styles.fontBold,
            styles.textPrimaryColor,
          ]}
        >
          Users
        </Text>
        <Pressable style={[styles.flexCenter]} onPress={handleModal}>
          <Text
            style={[
              styles.bgPrimaryColor,
              styles.textWhite,
              styles.p3,
              styles.fontBold,
              styles.roundedLg,
            ]}
          >
            Add User
          </Text>
        </Pressable>
      </View>
      {loading ? (
        <ActivityIndicator
          size="large"
          style={{ marginTop: 100 }}
          color="#547bd4"
        />
      ) : (
        <FlatList
          scrollEnabled
          data={users}
          style={[styles.mt5, { height: "70%" }]}
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
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.pressableContainer}>
          <Pressable onPress={handleModal}>
            <Text
              style={[
                styles.text5XL,
                styles.textWhite,
                styles.fontBold,
                styles.textLeft,
              ]}
            >
              {" ←"}
            </Text>
          </Pressable>
        </View>
        <View
          style={[styles.fullWidth, styles.itemsCenter, styles.justifyCenter]}
        >
          <Text
            style={[
              styles.text3XL,
              styles.mt5,
              styles.fontBold,
              styles.textPrimaryColor,
              styles.textCenter,
            ]}
          >
            Add New User
          </Text>
          <TextInput
            value={newUser}
            onChangeText={(text) => setNewUser(text)}
            placeholder="Username"
            style={[
              styles.h16,
              styles.border2,
              styles.mt5,
              styles.borderGray400,
              styles.fullWidth90,
              styles.roundedMd,
              styles.px2,
              styles.py0,
              styles.fontSemibold,
              styles.textXL,
            ]}
          />
          <Pressable
            style={[styles.add, styles.bgPrimaryColor, styles.roundedLg]}
            onPress={handleAddNewUser}
          >
            <Text style={[styles.text2XL, styles.textWhite, styles.fontBold]}>
              {loading ? (
                <Text>
                  <ActivityIndicator size="large" color="white" />
                </Text>
              ) : (
                <Text>Add</Text>
              )}
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
        style={[
          styles.opacity50,
          styles.textUnderline,
          styles.fontSemibold,
          styles.textMd,
        ]}
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
  textCenter: {
    textAlign: "center",
  },
  textXL: {
    fontSize: 20,
  },
  flexRow: {
    flexDirection: "row",
  },
  justifyBetween: {
    justifyContent: "space-between",
  },
  fullWidth: {
    width: "100%",
  },
  text4XL: {
    fontSize: 32,
  },
  mt2: {
    marginTop: 8,
  },
  fontBold: {
    fontWeight: "bold",
  },
  textPrimaryColor: {
    color: "#547bd4",
  },
  flexCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
  bgPrimaryColor: {
    backgroundColor: "#547bd4",
  },
  textWhite: {
    color: "white",
  },
  p3: {
    padding: 12,
  },
  roundedLg: {
    borderRadius: 8,
  },
  mt5: {
    marginTop: 20,
  },
  text5XL: {
    fontSize: 40,
  },
  textLeft: {
    textAlign: "left",
  },
  itemsCenter: {
    alignItems: "center",
  },
  justifyCenter: {
    justifyContent: "center",
  },
  text3XL: {
    fontSize: 24,
  },
  fullWidth90: {
    width: "90%",
  },
  h16: {
    height: 64,
  },
  border2: {
    borderWidth: 2,
  },
  borderGray400: {
    borderColor: "#ccc",
  },
  roundedMd: {
    borderRadius: 4,
  },
  px2: {
    paddingHorizontal: 8,
  },
  py0: {
    paddingVertical: 0,
  },
  fontSemibold: {
    fontWeight: "600",
  },
  text2XL: {
    fontSize: 24,
  },
  opacity50: {
    opacity: 0.5,
  },
  textUnderline: {
    textDecorationLine: "underline",
  },
  textMd: {
    fontSize: 14,
  },
});
