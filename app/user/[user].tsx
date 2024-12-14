// import { View, Text, ScrollView } from "react-native";
// import React, { useEffect, useState } from "react";
// import { useLocalSearchParams } from "expo-router";
// import { getAllTransactions } from "../api/route";

// interface UserDetails {
//   name: string;
//   toPay: number;
//   toReceive: number;
//   transactions: {
//     transactionId: string;
//     amountToPay: number;
//     toUser: string;
//   }[];
// }

// export default function DynamicUserPage() {
//   const { user } = useLocalSearchParams(); // Assume user is passed in the dynamic route
//   const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       const res = await getAllTransactions();
//       if (res) {
//         const currentUserDetails = res.users.find(
//           (detail) => detail.name === user
//         );
//         if (currentUserDetails) {
//           setUserDetails(currentUserDetails);
//         }
//       }
//     };
//     fetchData();
//   }, [user]);

//   return (
//     <View className="h-screen w-screen bg-[#f6f6e9]">
//       {/* Header Section */}
//       <View className="h-24 w-full flex items-center justify-center bg-[#547bd4] rounded-b-[50px]">
//         <Text className="text-4xl font-bold text-white text-center">
//           {user}
//         </Text>
//       </View>

//       {/* To Pay and To Receive Section */}
//       <View className="h-auto w-[100%] flex items-center justify-center mt-5">
//         <Text className="text-left w-[90%] text-2xl mb-1 text-primaryColor font-semibold">
//           Total
//         </Text>

//         <View className="border-2 border-gray-400 mt-2 border-dashed w-[90%] flex-row justify-between p-5 rounded-lg">
//           <View>
//             <Text className="text-xl font-bold text-red-600">To Pay</Text>
//             <Text className="text-xl font-bold text-green-600">To Receive</Text>
//           </View>
//           <View>
//             {!userDetails ? (
//               <Text className="text-xl font-bold text-gray-600">
//                 Loading...
//               </Text>
//             ) : (
//               <>
//                 <Text className="text-xl font-bold text-red-600">
//                   रु. {userDetails.toPay}
//                 </Text>
//                 <Text className="text-xl font-bold text-green-600">
//                   रु. {userDetails.toReceive}
//                 </Text>
//               </>
//             )}
//           </View>
//         </View>
//       </View>

//       {!userDetails ? (
//         <View className="flex-1 flex items-center justify-center">
//           <Text className="text-xl font-bold text-gray-600">Loading...</Text>
//         </View>
//       ) : (
//         <>
//           <Text className="text-2xl text-primaryColor text-left ml-6 w-[90%] mt-5 font-semibold">
//             Details
//           </Text>
//           <ScrollView className="w-[100%]" scrollEnabled>
//             <View className="h-auto w-[100%] flex items-center justify-center mt-5">
//               {userDetails.transactions.length > 0 ? (
//                 userDetails.transactions.map((transaction, index) => (
//                   <PaymentItem
//                     key={index}
//                     name={transaction.toUser}
//                     amount={transaction.amountToPay}
//                   />
//                 ))
//               ) : (
//                 <Text className="text-xl font-bold text-gray-600 mt-5">
//                   No transactions found.
//                 </Text>
//               )}
//             </View>
//           </ScrollView>
//         </>
//       )}
//     </View>
//   );
// }

// // PaymentItem Component
// const PaymentItem = ({ name, amount }: { name: string; amount: number }) => {
//   return (
//     <View
//       style={{
//         height: "auto",
//         paddingVertical: 10,
//         backgroundColor: "#fefeff",
//         marginBottom: 10,
//         borderWidth: 1,
//       }}
//       className="w-[90%] rounded-lg border-gray-300 items-center"
//     >
//       <View
//         style={{ paddingHorizontal: 10 }}
//         className="w-[100%] flex flex-row justify-between items-center"
//       >
//         <Text className="text-2xl text-primaryColor font-bold">{name}</Text>
//         <Text style={{ opacity: 0.7, fontSize: 12 }}>
//           {new Date().toLocaleString("en-US", {
//             month: "2-digit",
//             day: "2-digit",
//             year: "numeric",
//             hour: "2-digit",
//             minute: "2-digit",
//             hour12: true,
//           })}
//         </Text>
//       </View>
//       <View className="w-[90%]">
//         <Text className="font-bold text-3xl mt-2">रु. {amount}</Text>
//       </View>
//     </View>
//   );
// };

import { View, Text, ScrollView } from "react-native";
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

  useEffect(() => {
    const fetchData = async () => {
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
        }
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

      <View className="h-auto w-[100%] flex items-center justify-center mt-5">
        <Text className="text-left w-[90%] text-2xl mb-1 text-primaryColor font-semibold">
          Total
        </Text>
        <View className="border-2 border-gray-400 mt-2 border-dashed w-[90%] flex-row justify-between p-5 rounded-lg">
          <View>
            <Text className="text-xl font-bold text-red-600">To Pay</Text>
            <Text className="text-xl font-bold text-green-600">To Receive</Text>
          </View>
          <View>
            {!userDetails ? (
              <Text className="text-xl font-bold text-gray-600">
                Loading...
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

      {!userDetails ? (
        <View className="flex-1 flex items-center justify-center">
          <Text className="text-xl font-bold text-gray-600">Loading...</Text>
        </View>
      ) : (
        <>
          <ScrollView className="w-[100%]" scrollEnabled>
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
        </>
      )}
    </View>
  );
}

const Section = ({ title, transactions, color }: any) => (
  <View className="h-auto w-[100%] flex items-center justify-center mt-5">
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
          <Text className="text-2xl ml-5 font-bold">
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
