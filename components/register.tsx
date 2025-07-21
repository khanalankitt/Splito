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
import { useTheme } from "@/contexts/ThemeContext";

export default function Register() {
  const { userLogin } = useAuth();
  const { colors } = useTheme();
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
      <Text style={{ alignSelf: "flex-start", marginBottom: 5, color: colors.text }}>Username</Text>
      <TextInput
        style={{
          width: "100%",
          padding: 10,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surface,
          color: colors.text,
          borderRadius: 5,
          marginBottom: 15,
        }}
        placeholder="Enter your username"
        placeholderTextColor={colors.textSecondary}
        value={username}
        onChangeText={setUsername}
      />
      <Text style={{ alignSelf: "flex-start", marginBottom: 5, color: colors.text }}>Password</Text>
      <TextInput
        style={{
          width: "100%",
          padding: 10,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surface,
          color: colors.text,
          borderRadius: 5,
          marginBottom: 15,
        }}
        placeholder="Enter your password"
        placeholderTextColor={colors.textSecondary}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Pressable
        style={{
          backgroundColor: colors.primary,
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
