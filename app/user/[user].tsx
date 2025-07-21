import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { deleteTransaction, getAllTransactionsWithNetSettlement } from "../../utils/api";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useFocusEffect } from "@react-navigation/native";

export default function DynamicUserPage() {
  const { user } = useLocalSearchParams();
  const { userName } = useAuth();
  const { colors } = useTheme();
  const [userDetails, setUserDetails] = useState<any>({
    toPayTo: {},
    toReceiveFrom: {},
    totalToPay: 0,
    totalToReceive: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [trigger, setTrigger] = useState<boolean>(true);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const res = await getAllTransactionsWithNetSettlement();
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
    }, [user, trigger, userName])
  );

  const handleDelete = async (payerName: string, amount: any) => {
    // Show confirmation dialog
    Alert.alert(
      "Confirm Payment Received",
      `Are you sure you received रु. ${Math.abs(parseFloat(amount.toString())).toFixed(2)} from ${Array.isArray(user) ? user[0] : user}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes, I received payment",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              // For "owes you" section: the viewed user (user) owes money to the logged-in user (userName)
              // So payer is the viewed user, and receiver is the logged-in user
              const details: any = {
                payer: Array.isArray(user) ? user[0] : user, // The viewed user who owes money
                amount,
                user: userName // The logged-in user who should receive money
              };
              await deleteTransaction(details);
              setTrigger(!trigger);
            } catch (error) {
              console.error("Error deleting transaction:", error);
              Alert.alert("Error", "Failed to delete transaction. Please try again.");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };
  return (
    <View style={[{ height: "100%", width: "100%" }, { backgroundColor: colors.background }]}>
      <View style={[styles.top, { backgroundColor: colors.primary }]}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={32} color="white" />
        </Pressable>
        <Text style={[styles.userTitle, { color: "white" }]}>{user}</Text>
      </View>

      <View style={styles.totalContainer}>
        <Text style={[styles.totalTitle, { color: colors.text }]}>Total</Text>
        <View style={[styles.totalBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View>
            <Text style={[styles.toReceiveText, { color: colors.success }]}>You will receive</Text>
            <Text style={[styles.toPayText, { color: colors.error }]}>You owe</Text>
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
                <Text style={[styles.toReceiveAmount, { color: colors.success }]}>
                  रु.{" "}
                  {Math.abs(parseFloat(userDetails.totalToPay || 0)).toFixed(2)}
                </Text>
                <Text style={[styles.toPayAmount, { color: colors.error }]}>
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
          <MaterialIcons
            name="receipt-long"
            size={80}
            color={colors.textSecondary}
            style={styles.emptyIcon}
          />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No Transactions Yet
          </Text>
          <Text style={[styles.noTransactionsText, { color: colors.textSecondary }]}>
            When you split bills with {Array.isArray(user) ? user[0] : user}, transactions will appear here
          </Text>
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
  const { colors } = useTheme();
  const filteredTransactions = Object.entries(transactions).filter(
    ([_, amount]) => amount > 0
  );

  return (
    <View style={[styles.sectionContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>

      {filteredTransactions.length > 0 ? (
        filteredTransactions.map(([name, amount], index) => (
          <View key={index} style={[styles.transactionContainer, { borderBottomColor: colors.border }]}>
            <View>
              <Text
                style={{
                  ...styles.transactionAmount,
                  color: color === "red" ? colors.error : colors.success,
                }}
              >
                रु. {Math.abs(parseFloat(amount.toString())).toFixed(2)}
              </Text>
            </View>
            {title.includes("owes you") && (
              <Pressable
                style={styles.deleteButton}
                onPress={() => handleDelete(name, amount)}
              >
                <MaterialIcons name="delete" size={24} color={colors.error} />
              </Pressable>
            )}
          </View>
        ))
      ) : (
        <View style={styles.sectionEmptyContainer}>
          <MaterialIcons
            name="hourglass-empty"
            size={40}
            color={colors.textSecondary}
            style={styles.sectionEmptyIcon}
          />
          <Text style={[styles.sectionEmptyText, { color: colors.textSecondary }]}>
            No transactions in this category
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  top: {
    height: 70,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  backButton: {
    position: "absolute",
    left: 30,
    top: 18,
  },
  userName: {
    fontSize: 40,
    fontWeight: "bold",
    position: "absolute",
    left: 40,
    top: 10,
  },
  userTitle: {
    fontSize: 30,
    fontWeight: "bold",
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
    fontWeight: "600",
  },
  totalBox: {
    borderWidth: 2,
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
  },
  toReceiveText: {
    fontSize: 17,
    fontWeight: "bold",
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
    paddingHorizontal: 20,
  },
  noTransactionsText: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
  emptyIcon: {
    marginBottom: 20,
    opacity: 0.7,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
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
    borderWidth: 1,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
  },
  transactionContainer: {
    height: "auto",
    paddingVertical: 7,
    marginBottom: 10,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    borderRadius: 10,
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
  sectionEmptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },
  sectionEmptyIcon: {
    marginBottom: 10,
    opacity: 0.6,
  },
  sectionEmptyText: {
    fontSize: 14,
    textAlign: "center",
    fontStyle: "italic",
  },
});
