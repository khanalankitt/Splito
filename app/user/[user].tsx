import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

export default function DynamicUserPage() {
  var { user } = useLocalSearchParams();
  return (
    <View className="h-screen w-screen bg-[#f6f6e9] ">
      <View className="h-24 w-full flex items-center justify-center bg-[#547bd4] rounded-b-[50px] ">
        <Text className="text-4xl bg-pr font-bold text-white text-center">
          {user}
        </Text>
      </View>

      <View className="h-auto w-[100%] flex items-center justify-center mt-5">
        <Text className="text-left w-[90%] text-2xl mb-1 text-primaryColor font-semibold ">
          Total
        </Text>

        <View className="border-2 border-gray-400 border-dashed w-[90%] flex-row justify-between p-5 rounded-lg">
          <View>
            <Text className="text-xl font-bold text-red-600">To Pay</Text>
            <Text className="text-xl font-bold text-green-600">To Receive</Text>
          </View>
          <View>
            <Text className="text-xl font-bold text-red-600">रु.233</Text>
            <Text className="text-xl font-bold text-green-600">रु.32</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
