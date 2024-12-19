import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { deleteTransaction, getAllTransactions } from "../api/route";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function DynamicUserPage() {
  const { user } = useLocalSearchParams();
  const [userDetails, setUserDetails] = useState<any>({
    toPayTo: {},
    toReceiveFrom: {},
    totalToPay: 0,
    totalToReceive: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [trigger, setTrigger] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getAllTransactions();
        if (res) {
          const currentUserDetails = res[String(user)];
          if (currentUserDetails) {
            setUserDetails(currentUserDetails);
          } else {
            setUserDetails({
              toPayTo: {},
              toReceiveFrom: {},
              totalToPay: 0,
              totalToReceive: 0,
            });
          }
        } else {
          setUserDetails({
            toPayTo: {},
            toReceiveFrom: {},
            totalToPay: 0,
            totalToReceive: 0,
          });
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setUserDetails({
          toPayTo: {},
          toReceiveFrom: {},
          totalToPay: 0,
          totalToReceive: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, trigger]);

  const handleDelete = async (payer: string, amount: any) => {
    setLoading(true);
    const details: any = { payer, amount, user };
    await deleteTransaction(details);
    setLoading(false);
    setTrigger(!trigger);
  };

  return (
    <View className="h-screen w-screen bg-[#f6f6e9]">
      <View className="h-24 w-full flex items-center flex-row justify-center bg-[#547bd4] rounded-b-[50px]">
        <Text
          className="text-5xl text-white font-bold absolute left-10"
          onPress={() => router.back()}
        >
          ←
        </Text>
        <Text className="text-4xl font-bold text-white text-center">
          {user}
        </Text>
      </View>

      <View className="h-auto w-[100%] flex items-center justify-center mt-5 pb-5">
        <Text className="text-left w-[90%] text-2xl mb-1 text-primaryColor font-semibold">
          Total
        </Text>
        <View className="border-2 border-gray-400 mt-2 border-dashed w-[90%] flex-row justify-between p-5 rounded-lg">
          <View>
            <Text className="text-xl font-bold text-red-600">To Pay</Text>
            <Text className="text-xl font-bold text-green-600">To Receive</Text>
          </View>
          <View>
            {loading ? (
              <ActivityIndicator
                className="mt-2"
                size="large"
                color="#547bd4"
              />
            ) : (
              <>
                <Text className="text-xl font-bold text-red-600">
                  रु.{" "}
                  {Math.abs(parseFloat(userDetails.totalToPay || 0)).toFixed(2)}
                </Text>
                <Text className="text-xl font-bold text-green-600">
                  रु.{" "}
                  {Math.abs(
                    parseFloat(userDetails.totalToReceive || 0)
                  ).toFixed(2)}
                </Text>
              </>
            )}
          </View>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 flex items-center justify-center">
          <ActivityIndicator size="large" color="#547bd4" />
        </View>
      ) : Object.keys(userDetails.toPayTo || {}).length === 0 &&
        Object.keys(userDetails.toReceiveFrom || {}).length === 0 ? (
        <View className="flex-1 flex items-center justify-center">
          <Text className="text-xl font-bold text-gray-600">
            No Transactions Found
          </Text>
        </View>
      ) : (
        <ScrollView
          scrollEnabled
          contentContainerStyle={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          className="w-[100%] "
        >
          <Section
            title="To Pay"
            transactions={userDetails.toPayTo || {}}
            color="red"
            handleDelete={handleDelete}
          />
          <Section
            title="To Receive"
            transactions={userDetails.toReceiveFrom || {}}
            color="green"
            handleDelete={handleDelete}
          />
        </ScrollView>
      )}
    </View>
  );
}

const Section = ({
  title,
  transactions = {},
  color,
  handleDelete,
}: {
  title: string;
  transactions: { [key: string]: number };
  color: string;
  handleDelete: any;
}) => {
  const filteredTransactions = Object.entries(transactions).filter(
    ([_, amount]) => amount > 0
  );

  return (
    <View
      className="h-auto w-[90%] flex items-center justify-center mt-5 mb-5 rounded-xl py-5 border-dotted border-primaryColor"
      style={{ borderWidth: 1 }}
    >
      <Text className="text-2xl text-primaryColor font-semibold mb-5">
        {title}
      </Text>

      {filteredTransactions.length > 0 ? (
        filteredTransactions.map(([name, amount], index) => (
          <View
            key={index}
            style={{
              height: "auto",
              paddingVertical: 10,
              backgroundColor: "#fefeff",
              marginBottom: 10,
              borderWidth: 1,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            className="w-[90%] rounded-lg border-gray-300 items-start"
          >
            <View>
              <Text className="text-xl ml-5 font-bold">{name}</Text>

              <Text
                style={{ color: color === "red" ? "#dc2626" : "#16a34a" }}
                className="text-2xl font-bold ml-5"
              >
                रु. {Math.abs(parseFloat(amount.toString())).toFixed(2)}
              </Text>
            </View>
            {title === "To Receive" && (
              <Pressable
                style={{ marginRight: 15 }}
                onPress={() => handleDelete(name, amount)}
              >
                <Text className="text-5xl">
                  <MaterialIcons name="delete" size={30} color="#df2626" />
                </Text>
              </Pressable>
            )}
          </View>
        ))
      ) : (
        <Text className="text-xl font-bold text-gray-600 mt-5">
          No transactions found.
        </Text>
      )}
    </View>
  );
};
