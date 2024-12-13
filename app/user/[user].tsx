import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

export default function DynamicUserPage() {
  var { userName } = useLocalSearchParams();
  return (
    <View className="h-screen w-screen bg-[#f6f6e9] ">
      <View className="h-auto w-full bg-primaryColor">
        <Text style={styles.text} className="text-center">
          Splito
        </Text>
      </View>
      <View className="h-16 w-full flex items-center justify-center bg-[#547bd4] rounded-b-[50px] ">
        <Text className="text-lg font-semibold -mt-6 text-white">
          Split bills like nobody
        </Text>
      </View>
      <Text className="text-4xl font-bold text-primaryColor mt-5 text-center">
        {userName}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 40,
    fontWeight: "bold",
    paddingLeft: 10,
    color: "white",
    fontFamily: "SpaceMono",
  },
});
