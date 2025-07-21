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
import { getUsers, postUserData } from "../utils/api";
import { useTheme } from "../contexts/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ModalProps {
  setModalVisible: (visible: boolean) => void;
}

export default function Form({ setModalVisible }: ModalProps) {
  const [whoPaid, setWhoPaid] = useState<string>();
  const [amount, setAmount] = useState<number>();
  const [selected, setSelected] = useState<string[]>([]);
  const [users, setUsers] = useState<{ name: any }[]>([]);
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();

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
    if ((await AsyncStorage.getItem("userName"))?.trim() !== whoPaid) {
      alert("Only the logged in user can pay!");
      setAmount(undefined);
      setWhoPaid(undefined);
      setSelected([]);
      setModalVisible(false);
      return;
    }
    setLoading(true);
    const status = await postUserData(whoPaid, amount, selected);
    if (!status) {
      alert("Error saving data. Please try again later.");
      setLoading(false);
      return;
    }
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
        style={{ backgroundColor: colors.surface }}
      >
        <View style={[
          styles.item, 
          { 
            backgroundColor: isSelected ? colors.primary + '20' : colors.surface,
            borderBottomColor: colors.border,
            borderBottomWidth: 0.5
          }
        ]}>
          <Text style={[styles.selectedTextStyle, { color: colors.text }]}>{item.name}</Text>
          {isSelected && (
            <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: 16 }}>✓</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={{ backgroundColor: colors.background }}>
      <View style={[styles.form, { backgroundColor: colors.surface }]}>
        <Text style={[styles.formTitle, { color: colors.primary }]}>
          Add Payment Details
        </Text>
        <Text style={[styles.fontBoldTextXL, { color: colors.text }]}>Who paid?</Text>
        <Dropdown
          style={[styles.dropdownn, { 
            borderColor: colors.border,
            backgroundColor: colors.surface 
          }]}
          data={users}
          onChange={(item) => setWhoPaid(item.name)}
          placeholder="Select Person"
          labelField="name"
          valueField="name"
          value={whoPaid}
          placeholderStyle={{ color: colors.textSecondary }}
          selectedTextStyle={{ color: colors.text }}
          containerStyle={{ 
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: 8
          }}
          itemTextStyle={{ color: colors.text }}
          activeColor={colors.accent + '20'}
        />
        <Text style={[styles.whopaid, { color: colors.text }]}>Amount</Text>
        <TextInput
          style={[styles.amountInput, { 
            borderColor: colors.border,
            backgroundColor: colors.surface,
            color: colors.text 
          }]}
          keyboardType="numeric"
          value={amount?.toString()}
          placeholder="Rs."
          placeholderTextColor={colors.textSecondary}
          onChangeText={(am) => setAmount(am ? parseFloat(am) : undefined)}
        />
        <Text style={[styles.whopaid, { color: colors.text }]}>Divide amongst?</Text>
        <MultiSelect
          style={[styles.dropdown, { 
            borderColor: colors.border,
            backgroundColor: colors.surface 
          }]}
          data={users}
          labelField="name"
          valueField="name"
          placeholder="Select people to divide"
          value={selected}
          onChange={(data) => setSelected(data)}
          renderItem={renderItem}
          placeholderStyle={{ color: colors.textSecondary }}
          selectedTextStyle={{ color: colors.text }}
          containerStyle={{ 
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: 8
          }}
          itemTextStyle={{ color: colors.text }}
          activeColor={colors.accent + '20'}
          renderSelectedItem={(item, unSelect) => (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => unSelect && unSelect(item)}
            >
              <View style={[styles.selectedStyle, { 
                borderColor: colors.border,
                backgroundColor: colors.surface 
              }]}>
                <Text style={[styles.textSelectedStyle, { color: colors.text }]}>
                  {item.name.split(" ")[0]}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
        <Pressable onPress={handleSubmit}>
          {loading ? (
            <View style={[styles.loadingButton, { backgroundColor: colors.primary }]}>
              <ActivityIndicator size="large" color="white" />
            </View>
          ) : (
            <Text style={[styles.saveButton, { backgroundColor: colors.primary }]}>Save Payment</Text>
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
  },
  whopaid: {
    fontWeight: "bold",
    width: "90%",
    fontSize: 17,
  },
  amountInput: {
    height: 50,
    borderWidth: 2,
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
  },
  placeholderStyle: {
    fontSize: 14,
  },
  selectedTextStyle: {
    fontSize: 15,
  },
  item: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 50,
  },
  selectedStyle: {
    flexDirection: "row",
    marginRight: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 2,
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
    paddingHorizontal: 48,
    borderRadius: 10,
    paddingVertical: 8,
    marginTop: 8,
    color: "white",
  },
  saveButton: {
    fontWeight: "bold",
    fontSize: 20,
    paddingHorizontal: 40,
    borderRadius: 10,
    paddingVertical: 8,
    marginTop: 8,
    color: "white",
  },
});
