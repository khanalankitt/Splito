import { View, Text, ScrollView } from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { getAllTransactions } from "../api/route";

export default function DynamicUserPage() {
  var { user } = useLocalSearchParams();

  useEffect(()=>{
    const fetchData = async () => {
      const res = await getAllTransactions();
    };
    fetchData();
  },[]);

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

        <View className="border-2 border-gray-400 mt-2 border-dashed w-[90%] flex-row justify-between p-5 rounded-lg">
          <View>
            <Text className="text-xl font-bold text-red-600">To Pay</Text>
            <Text className="text-xl font-bold text-green-600">To Receive</Text>
          </View>
          <View>
            <Text className="text-xl font-bold text-red-600">रु.233</Text>
            <Text className="text-xl font-bold text-green-600">रु.32</Text>
          </View>
        </View>
        <Text className="text-2xl text-primaryColor text-left w-[90%] mt-5 font-semibold">
          Details
        </Text>
        <ScrollView className="w-[100%]" scrollEnabled>
          <View className="h-auto w-[100%] flex items-center justify-center mt-5">
            <PaymentItem />
            <PaymentItem />
            <PaymentItem />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const PaymentItem = () => {
  return (
    <View
      style={{
        height: "auto",
        paddingVertical: 10,
        backgroundColor: "#fefeff",
        marginBottom: 10,
        borderWidth: 1,
      }}
      className="w-[90%] rounded-lg border-gray-300 items-center "
    >
      <View
        style={{ paddingHorizontal: 10 }}
        className="w-[100%] flex flex-row justify-between items-center"
      >
        <Text className="text-2xl text-primaryColor font-bold">
          Ankit Khanal
        </Text>
        <Text style={{ opacity: 0.7, fontSize: 12 }}>
          {new Date().toLocaleString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </Text>
      </View>
      <View className="w-[90%]">
        <Text className="font-bold text-3xl mt-2">रु. 220</Text>
        <Text style={{ opacity: 0.6 }}>Masu biryani sabji paste tamatar</Text>
      </View>
    </View>
  );
};
