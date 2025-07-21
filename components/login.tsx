import {
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { login } from "@/utils/api";
import { useRouter } from "expo-router";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { userLogin } = useAuth(); // Get the login function from context
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    setLoading(true);
    if (!username || !password) {
      setLoading(false);
      Alert.alert("Error", "Please enter both username and password");
      return;
    }

    const usernameRegex = /^[a-zA-Z]+$/;
    if (!usernameRegex.test(username)) {
      setLoading(false);
      Alert.alert("Invalid Username", "Username must contain only alphabets.");
      return;
    }

    try {
      const res = await login(username.trim(), password);

      if (res.status) {
        userLogin(username);
        Alert.alert("Success", res.message);
        router.replace("/");
      } else {
        Alert.alert("Login Failed", res.message);
      }
    } catch (e) {
      console.error("Login error:", e);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
      setUsername("");
      setPassword("");
    }
  };

  return (
    <>
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
          {loading ? <ActivityIndicator size="small" color="white" /> : "Login"}
        </Text>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({});
