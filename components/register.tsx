import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { register } from "@/utils/api";
import { router } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";

export default function Register() {
  const { userLogin } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    setLoading(true);
    const usernameRegex = /^[a-zA-Z]+$/;
    if (!username || !password) {
      setLoading(false);
      alert("Please enter both username and password");
      return;
    }
    if (!usernameRegex.test(username)) {
      alert("Username must contain only English alphabets");
      setLoading(false);
      return;
    }
    try {
      const res = await register(username.trim(), password);
      alert(res.message);
      if (res.status) {
        userLogin(username.trim());
        alert(res.message);
        router.replace("/");
      }
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    } finally {
      setLoading(false);
      setUsername("");
      setPassword("");
    }
  };

  return (
    <View>
      <Text style={{ alignSelf: "flex-start", marginBottom: 5 }}>Username</Text>
      <TextInput
        style={{
          width: "100%",
          padding: 10,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 5,
          marginBottom: 15,
        }}
        placeholder="Enter your username"
        value={username}
        onChangeText={setUsername}
      />
      <Text style={{ alignSelf: "flex-start", marginBottom: 5 }}>Password</Text>
      <TextInput
        style={{
          width: "100%",
          padding: 10,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 5,
          marginBottom: 15,
        }}
        placeholder="Enter your password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Pressable
        style={{
          backgroundColor: "#547bd4",
          padding: 10,
          borderRadius: 5,
          alignItems: "center",
          width: "100%",
        }}
        onPress={handlePress}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            "Register"
          )}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({});
