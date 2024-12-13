import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

export default function DynamicUserPage() {
  var { data } = useLocalSearchParams();
  return (
    <View className="h-screen w-screen bg-white">
      <Text>{data}</Text>
    </View>
  );
}
