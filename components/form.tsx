import {
  Pressable,
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
  const [whoPaid, setWhoPaid] = useState<string>();
  const [amount, setAmount] = useState<string>();
  const [selected, setSelected] = useState<string[]>([]);
  const [remark, setRemark] = useState<string>();

  const handleSubmit = () => {
    if (whoPaid == "" || amount == "" || selected == null || remark == "") {
      alert("All fields are compulsary!");
      return;
    } else {
      alert(
        `Who Paid: ${whoPaid}\nAmount: ${amount}\nSelected: ${selected.join(
          ", "
        )}\nRemark: ${remark}`
      );
    }

    setWhoPaid("");
    setAmount("");
    setSelected([]);
    setRemark("");
  };

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
        <Text
          style={styles.formTitle}
          className="text-primaryColor font-bold text-4xl w-full "
        >
          Add Payment Details
        </Text>
        <Text className="font-bold text-xl w-[90%]">Who paid?</Text>
        <Dropdown
          style={styles.dropdownn}
          data={data}
          onChange={(item) => setWhoPaid(item.name)}
          placeholder="Select Person"
          labelField="name"
          valueField="name"
          value={whoPaid}
        />
        <Text style={styles.whopaid}>Amount</Text>
        <TextInput
          style={styles.amountInput}
          keyboardType="numeric"
          value={amount}
          placeholder="Rs."
          onChangeText={(am) => setAmount(am)}
        />
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
        <TextInput
          style={styles.amountInput}
          placeholder="Note"
          value={remark}
          onChangeText={(text) => setRemark(text)}
        />
        <Pressable onPress={handleSubmit}>
          <Text className="font-bold text-2xl bg-[#547bd4] px-12 rounded-lg py-2 mt-2 text-white">
            Submit
          </Text>
        </Pressable>
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
    justifyContent: "flex-start",
    alignItems: "center",
  },
  formTitle: {
    textAlign: "center",
    marginHorizontal: "auto",
    fontWeight: "bold",
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  dropdownn: {
    height: 50,
    width: 300,
    borderRadius: 10,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: "lightgray",
  },
  whopaid: {
    fontWeight: "bold",
    width: "90%",
    fontSize: 17,
  },
  amountInput: {
    height: 50,
    borderWidth: 2,
    borderColor: "lightgray",
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
    borderColor: "lightgray",
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
    borderColor: "lightgray",
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
