import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import data from "./data";

export default function List() {
  const SeperatorComponent = () => <View style={{ height: 10 }} />;
  return (
    <View style={[styles.listContainer, { flex: 0 }]}>
      <Text className="text-4xl mt-2 font-bold text-primaryColor">Users</Text>
      <FlatList
        scrollEnabled
        data={data}
        className="mt-5 h-[70%]"
        renderItem={({ item }) => (
          <MoneyItem name={item.name} clear={item.clear} />
        )}
        ItemSeparatorComponent={SeperatorComponent}
      />
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
        <Text style={[styles.clear, styles.status]}>Clear</Text>
      ) : (
        <Text style={[styles.notClear, styles.status]}>Not Clear</Text>
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
});
