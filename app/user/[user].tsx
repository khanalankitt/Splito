import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Pressable,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { deleteTransaction, getAllTransactions } from "../../utils/api";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAuth } from "../../contexts/AuthContext";

export default function DynamicUserPage() {
  const { user } = useLocalSearchParams();
  const { userName } = useAuth();
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
          const selectedUserDetails = res[String(user).trim()];

          if (selectedUserDetails && userName) {
            // Filter transactions to show only those related to the logged-in user
            const filteredDetails = {
              toPayTo: {} as { [key: string]: number },
              toReceiveFrom: {} as { [key: string]: number },
              totalToPay: 0,
              totalToReceive: 0,
            };

            // Filter toPayTo - only show if the selected user owes money to the logged-in user
            if (selectedUserDetails.toPayTo && selectedUserDetails.toPayTo[userName]) {
              filteredDetails.toPayTo[userName] = selectedUserDetails.toPayTo[userName];
              filteredDetails.totalToPay = selectedUserDetails.toPayTo[userName];
            }

            // Filter toReceiveFrom - only show if the selected user should receive money from the logged-in user
            if (selectedUserDetails.toReceiveFrom && selectedUserDetails.toReceiveFrom[userName]) {
              filteredDetails.toReceiveFrom[userName] = selectedUserDetails.toReceiveFrom[userName];
              filteredDetails.totalToReceive = selectedUserDetails.toReceiveFrom[userName];
            }

            setUserDetails(filteredDetails);
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
  }, [user, trigger, userName]);

  const handleDelete = async (payer: string, amount: any) => {
    setLoading(true);
    const details: any = { payer, amount, user };
    await deleteTransaction(details);
    setLoading(false);
    setTrigger(!trigger);
  };
  return (
    <View style={{ height: "100%", width: "100%", backgroundColor: "#f6f6e9" }}>
      <View style={styles.top}>
        <Text style={styles.userName} onPress={() => router.back()}>
          ←
        </Text>
        <Text style={styles.userTitle}>{user}</Text>
      </View>

      <View style={styles.totalContainer}>
        <Text style={styles.totalTitle}>Total</Text>
        <View style={styles.totalBox}>
          <View>
            <Text style={styles.toReceiveText}>You will receive</Text>
            <Text style={styles.toPayText}>You owe</Text>
          </View>
          <View>
            {loading ? (
              <ActivityIndicator
                style={styles.activityIndicator}
                size="large"
                color="#547bd4"
              />
            ) : (
              <>
                <Text style={styles.toReceiveAmount}>
                  रु.{" "}
                  {Math.abs(parseFloat(userDetails.totalToPay || 0)).toFixed(2)}
                </Text>
                <Text style={styles.toPayAmount}>
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
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#547bd4" />
        </View>
      ) : Object.keys(userDetails.toPayTo || {}).length === 0 &&
        Object.keys(userDetails.toReceiveFrom || {}).length === 0 ? (
        <View style={styles.noTransactionsContainer}>
          <Text style={styles.noTransactionsText}>No Transactions Found</Text>
        </View>
      ) : (
        <ScrollView
          scrollEnabled
          contentContainerStyle={styles.scrollViewContent}
          style={styles.scrollView}
        >
          <Section
            title={`${user} owes you`}
            transactions={userDetails.toPayTo || {}}
            color="green"
            handleDelete={handleDelete}
            user={Array.isArray(user) ? user[0] : user}
            userName={userName}
          />
          <Section
            title={`You owe ${user}`}
            transactions={userDetails.toReceiveFrom || {}}
            color="red"
            handleDelete={handleDelete}
            user={Array.isArray(user) ? user[0] : user}
            userName={userName}
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
  user,
  userName,
}: {
  title: string;
  transactions: { [key: string]: number };
  color: string;
  handleDelete: any;
  user: string;
  userName: string;
}) => {
  const filteredTransactions = Object.entries(transactions).filter(
    ([_, amount]) => amount > 0
  );

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>

      {filteredTransactions.length > 0 ? (
        filteredTransactions.map(([name, amount], index) => (
          <View key={index} style={styles.transactionContainer}>
            <View>
              <Text
                style={{
                  ...styles.transactionAmount,
                  color: color === "red" ? "#dc2626" : "#16a34a",
                }}
              >
                रु. {Math.abs(parseFloat(amount.toString())).toFixed(2)}
              </Text>
            </View>
            {title.includes("owes you") && user === userName && (
              <Pressable
                style={styles.deleteButton}
                onPress={() => handleDelete(name, amount)}
              >
                <Text style={styles.deleteIcon}>
                  <MaterialIcons name="delete" size={30} color="#df2626" />
                </Text>
              </Pressable>
            )}
          </View>
        ))
      ) : (
        <Text style={styles.noTransactionsText}>No transactions found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  top: {
    height: 96,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#547bd4",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  userName: {
    fontSize: 40,
    color: "white",
    fontWeight: "bold",
    position: "absolute",
    left: 40,
    top: 10,
  },
  userTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  totalContainer: {
    height: "auto",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    paddingBottom: 20,
  },
  totalTitle: {
    textAlign: "left",
    width: "90%",
    fontSize: 22,
    marginBottom: 5,
    color: "#1f2937",
    fontWeight: "600",
  },
  totalBox: {
    borderWidth: 2,
    borderColor: "#9ca3af",
    marginTop: 8,
    borderStyle: "dashed",
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 10,
  },
  toPayText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#dc2626",
  },
  toReceiveText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#16a34a",
  },
  activityIndicator: {
    marginTop: 8,
  },
  toPayAmount: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#dc2626",
  },
  toReceiveAmount: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#16a34a",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  noTransactionsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  noTransactionsText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#4b5563",
  },
  scrollViewContent: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    width: "100%",
  },
  sectionContainer: {
    height: "auto",
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 20,
    paddingVertical: 15,
    borderStyle: "dotted",
    borderColor: "#1f2937",
    borderWidth: 1,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 20,
    color: "#1f2937",
    fontWeight: "600",
    marginBottom: 20,
  },
  transactionContainer: {
    height: "auto",
    paddingVertical: 7,
    backgroundColor: "#fefeff",
    marginBottom: 10,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    borderRadius: 10,
    borderColor: "#d1d5db",
  },
  transactionName: {
    fontSize: 17,
    marginLeft: 20,
    fontWeight: "bold",
  },
  transactionAmount: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 20,
  },
  deleteButton: {
    marginRight: 15,
  },
  deleteIcon: {
    fontSize: 40,
  },
});
