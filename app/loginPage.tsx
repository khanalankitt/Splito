import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Register from "@/components/register";
import Login from "@/components/login";

export default function LoginPage() {
  const [activeLink, setActiveLink] = useState("login");

  return (
    <SafeAreaView style={styles.container}>
      <Text
        style={{
          width: "100%",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: 50,
          color: "#547bd4",
        }}
      >
        Splito
      </Text>
      <View style={styles.formContainer}>
        <View style={{ width: "100%", zIndex: 200 }}>
          <View
            style={{
              width: 192,
              height: 50,
              backgroundColor: "#547bd4",
              padding: 3,
              borderRadius: 10,
              gap: 8,
              marginBottom: 20,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Pressable onPress={() => setActiveLink("login")}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 18,
                  backgroundColor:
                    activeLink === "register" ? "#547bd4" : "white",
                  padding: 7,
                  paddingHorizontal: 12,
                  borderRadius: 6,
                  color: activeLink === "register" ? "white" : "#547bd4",
                }}
              >
                Login
              </Text>
            </Pressable>
            <Pressable onPress={() => setActiveLink("register")}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 18,
                  backgroundColor: activeLink === "login" ? "#547bd4" : "white",
                  padding: 7,
                  paddingHorizontal: 12,
                  borderRadius: 6,
                  color: activeLink === "login" ? "white" : "#547bd4",
                }}
              >
                Register
              </Text>
            </Pressable>
          </View>
          {activeLink === "register" ? <Register /> : <Login />}
        </View>
      </View>
      <Text style={{ position: "absolute", bottom: 20 }}>
        Created by{" "}
        <Link
          href="https://www.ankitkhanal.me"
          style={{
            textDecorationLine: "underline",
            color: "#547bd4",
            fontWeight: "bold",
          }}
        >
          Ankit Khanal
        </Link>
      </Text>
      <Image
        source={require("@/assets/images/person.png")}
        style={{
          zIndex: -30,
          width: 300,
          height: 300,
          objectFit: "contain",
          position: "absolute",
          opacity: 1,
          bottom: 80,
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6e9",
    paddingTop: 30,
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 20,
  },
  formContainer: {
    width: "90%",
    backgroundColor: "#f6f6e9",
    padding: 10,
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});
