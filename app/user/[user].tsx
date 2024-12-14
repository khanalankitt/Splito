import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { getAllTransactions } from "../api/route";

interface UserDetails {
  name: string;
  toPay: number;
  toReceive: number;
  transactionsToPay: {
    transactionId: string;
    amountToPay: number;
    toUser: string;
  }[];
  transactionsToReceive: {
    transactionId: string;
    amountToReceive: number;
    fromUser: string;
  }[];
}

export default function DynamicUserPage() {
  const { user } = useLocalSearchParams();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getAllTransactions();
        if (res) {
          const currentUserDetails = res.users.find(
            (detail) => detail.name === user
          );
          if (currentUserDetails) {
            setUserDetails({
              ...currentUserDetails,
              transactionsToPay: currentUserDetails.transactionsToPay
                .filter((transaction) => transaction !== null)
                .map((transaction) => ({
                  ...transaction,
                  amountToPay: Number(transaction.amountToPay),
                })),
            });
          } else {
            setUserDetails(null);
          }
        } else {
          setUserDetails(null);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setUserDetails(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  return (
    <View className="h-screen w-screen bg-[#f6f6e9]">
      <View className="h-24 w-full flex items-center justify-center bg-[#547bd4] rounded-b-[50px]">
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
            ) : !userDetails ? (
              <Text className="text-xl mt-4 font-bold text-gray-600">
                No Transactions
              </Text>
            ) : (
              <>
                <Text className="text-xl font-bold text-red-600">
                  रु. {userDetails.toPay}
                </Text>
                <Text className="text-xl font-bold text-green-600">
                  रु. {userDetails.toReceive}
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
      ) : !userDetails ? (
        <View className="flex-1 flex items-center justify-center">
          <Text className="text-xl font-bold text-gray-600">
            No Transactions
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
            transactions={userDetails.transactionsToPay}
            color="red"
          />
          <Section
            title="To Receive"
            transactions={userDetails.transactionsToReceive}
            color="green"
          />
        </ScrollView>
      )}
    </View>
  );
}

const Section = ({ title, transactions, color }: any) => (
  <View
    className="h-auto w-[90%] flex items-center justify-center mt-5 rounded-xl py-5 border-dotted border-primaryColor"
    style={{ borderWidth: 1 }}
  >
    <Text className="text-2xl text-primaryColor font-semibold mb-5">
      {title}
    </Text>
    {transactions.length > 0 ? (
      transactions.map((transaction: any, index: number) => (
        <View
          key={index}
          style={{
            height: "auto",
            paddingVertical: 10,
            backgroundColor: "#fefeff",
            marginBottom: 10,
            borderWidth: 1,
          }}
          className="w-[90%] rounded-lg border-gray-300 items-start"
        >
          <Text className="text-xl ml-5 font-bold">
            {transaction.toUser || transaction.fromUser}
          </Text>
          <Text className={`text-2xl font-bold text-${color}-600 ml-5`}>
            रु. {transaction.amountToPay || transaction.amountToReceive}
          </Text>
        </View>
      ))
    ) : (
      <Text className="text-xl font-bold text-gray-600 mt-5">
        No transactions found.
      </Text>
    )}
  </View>
);
