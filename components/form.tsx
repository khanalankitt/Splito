import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import { getUsers, postUserData } from "../app/api/route";

interface ModalProps {
  setModalVisible: (visible: boolean) => void;
}

export default function Form({ setModalVisible }: ModalProps) {
  const [whoPaid, setWhoPaid] = useState<string>();
  const [amount, setAmount] = useState<number>();
  const [selected, setSelected] = useState<string[]>([]);
  const [users, setUsers] = useState<{ name: any }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await getUsers();
      const usersArray = Object.keys(res || {}).map((key) => ({
        name: key,
      }));
      setUsers(usersArray);
    };
    fetchUsers();
  }, []);

  const handleSubmit = async () => {
    if (!whoPaid || !amount || selected.length === 0) {
      alert(
        "All fields are required! Please complete the form before submitting."
      );
      return;
    }
    setLoading(true);
    await postUserData(whoPaid, amount, selected);
    setLoading(false);
    setModalVisible(false);
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
        <Text style={[styles.formTitle, styles.textPrimaryColor]}>
          Add Payment Details
        </Text>
        <Text style={styles.fontBoldTextXL}>Who paid?</Text>
        <Dropdown
          style={styles.dropdownn}
          data={users}
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
          value={amount?.toString()}
          placeholder="Rs."
          onChangeText={(am) => setAmount(am ? parseFloat(am) : undefined)}
        />
        <Text style={styles.whopaid}>Divide amongst?</Text>
        <MultiSelect
          style={styles.dropdown}
          data={users}
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
        <Pressable onPress={handleSubmit}>
          {loading ? (
            <View style={styles.loadingButton}>
              <ActivityIndicator size="large" color="white" />
            </View>
          ) : (
            <Text style={styles.saveButton}>Save Payment</Text>
          )}
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
    fontSize: 27,
    width: "100%",
    paddingVertical: 5,
    borderRadius: 10,
  },
  textPrimaryColor: {
    color: "#547bd4",
  },
  fontBoldTextXL: {
    fontWeight: "bold",
    fontSize: 20,
    width: "90%",
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
  loadingButton: {
    fontWeight: "bold",
    fontSize: 24,
    backgroundColor: "#547bd4",
    paddingHorizontal: 48,
    borderRadius: 10,
    paddingVertical: 8,
    marginTop: 8,
    color: "white",
  },
  saveButton: {
    fontWeight: "bold",
    fontSize: 20,
    backgroundColor: "#547bd4",
    paddingHorizontal: 40,
    borderRadius: 10,
    paddingVertical: 8,
    marginTop: 8,
    color: "white",
  },
});
