import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import data from "./data";

export default function Form() {
  const [selected, setSelected] = useState<string[]>([]);

  const renderItem = (item: any) => {
    const isSelected = selected.includes(item.name);
    return (
      <TouchableOpacity
        onPress={() => {
          if (isSelected) {
            setSelected(selected.filter((name) => name !== item.name));
          } else {
            setSelected([...selected, item.name]);
          }
        }}
      >
        <View style={[styles.item, isSelected && styles.selectedItem]}>
          <Text style={styles.selectedTextStyle}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView>
      <View style={styles.form}>
        <Text style={styles.formTitle}>Add payment details</Text>
        <Text className="text-2xl font-bold bg-red-500">Who paid?</Text>  
        <Dropdown
          style={styles.dropdownn}
          data={data}
          onChange={() => {}}
          placeholder="Select Person"
          labelField="name"
          valueField="name"
        />
        <Text style={styles.whopaid}>Amount</Text>
        <TextInput style={styles.amountInput} keyboardType="numeric" />
        <Text style={styles.whopaid}>Divide amongst?</Text>
        <MultiSelect
          style={styles.dropdown}
          data={data}
          labelField="name"
          valueField="name"
          placeholder="Select people to divide"
          value={selected}
          onChange={(data) => setSelected(data)}
          renderItem={renderItem}
          renderSelectedItem={(item, unSelect) => (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => unSelect && unSelect(item)}
            >
              <View style={styles.selectedStyle}>
                <Text style={styles.textSelectedStyle}>
                  {item.name.split(" ")[0]}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
        <Text style={styles.whopaid}>Remark</Text>
        <TextInput style={styles.amountInput} placeholder="Note" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 10,
    marginVertical: 10,
    marginHorizontal: "auto",
    height: "auto",
    padding: 10,
    paddingVertical: 20,
    borderRadius: 20,
    width: "90%",
    backgroundColor: "#e8e9ed",
    borderWidth: 2,
    borderColor: "#dddfe5",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  formTitle: {
    textAlign: "center",
    fontSize: 22,
    marginHorizontal: "auto",
    width: 270,
    fontWeight: "bold",
    padding: 5,
    paddingHorizontal: 10,
    color: "white",
    backgroundColor: "#547bd4",
    borderRadius: 10,
  },
  dropdownn: {
    height: 50,
    width: 300,
    borderRadius: 10,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: "gray",
  },
  whopaid: {
    fontWeight: "bold",
    width: "90%",
    fontSize: 17,
  },
  amountInput: {
    height: 50,
    borderWidth: 2,
    borderColor: "gray",
    width: 300,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 17,
  },
  dropdown: {
    height: 50,
    width: 300,
    borderRadius: 12,
    padding: 10,
    borderWidth: 2,
    borderColor: "grey",
  },
  placeholderStyle: {
    fontSize: 14,
  },
  selectedTextStyle: {
    fontSize: 15,
  },
  item: {
    padding: 13,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedItem: {
    backgroundColor: "#cde6ff", // Light blue background for selected items
    paddingHorizontal: 10,
  },
  selectedStyle: {
    flexDirection: "row",
    marginRight: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "grey",
    marginTop: 5,
    marginHorizontal: "auto",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 16,
  },
});
