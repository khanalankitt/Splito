import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

export default function DynamicUserPage() {
  var { userName } = useLocalSearchParams();
  return (
    <View className="h-screen w-screen bg-white">
      <Text className="text-4xl font-bold text-primaryColor mt-20">
        {userName}
      </Text>
    </View>
  );
}
