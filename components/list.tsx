import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Link } from "expo-router";
import { getAllTransactions } from "../utils/api";
import { useAuth } from "@/contexts/AuthContext";

interface User {
  name: string;
}

export default function List() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { userName } = useAuth();

  const SeperatorComponent = () => <View style={{ height: 10 }} />;
  const ListEmptyComponent = () => (
    <Text style={{ marginTop: 100, textAlign: "center" }}>
      No users with transactions found
    </Text>
  );

  const fetchUsersWithTransactions = async () => {
    setLoading(true);
    try {
      const transactionData = await getAllTransactions();
      
      if (!transactionData || !userName) {
        setUsers([]);
        setLoading(false);
        return;
      }

      const currentUserData = transactionData[userName];
      if (!currentUserData) {
        setUsers([]);
        setLoading(false);
        return;
      }

      const usersWithTransactions = new Set<string>();

      // Add users who owe money to the current user
      if (currentUserData.toReceiveFrom) {
        Object.keys(currentUserData.toReceiveFrom).forEach(user => {
          if (currentUserData.toReceiveFrom[user] > 0) {
            usersWithTransactions.add(user);
          }
        });
      }

      // Add users to whom the current user owes money
      if (currentUserData.toPayTo) {
        Object.keys(currentUserData.toPayTo).forEach(user => {
          if (currentUserData.toPayTo[user] > 0) {
            usersWithTransactions.add(user);
          }
        });
      }

      // Convert set to array of user objects
      const usersArray = Array.from(usersWithTransactions).map(name => ({
        name: name,
      }));

      setUsers(usersArray);
    } catch (error) {
      console.error("Error fetching users with transactions:", error);
      setUsers([]);
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUsersWithTransactions();
    setRefreshing(false);
  };

  useEffect(() => {
    if (userName) {
      fetchUsersWithTransactions();
    }
  }, [userName]);

  return (
    <View style={[styles.listContainer, { flex: 0 }]}>
      <View style={[styles.flexRow, styles.justifyBetween, styles.fullWidth]}>
        {/* <Text
          style={[
            styles.text4XL,
            styles.mt2,
            styles.fontBold,
            styles.textPrimaryColor,
          ]}
        >
          Your Transactions
        </Text> */}
      </View>
      {loading ? (
        <ActivityIndicator
          size="large"
          style={{ marginTop: 100 }}
          color="#547bd4"
        />
      ) : (
        <FlatList
          scrollEnabled
          data={users}
          style={[styles.mt5, { height: "70%" }]}
          ListEmptyComponent={<ListEmptyComponent />}
          renderItem={({ item }) => (
            <Link
              href={{
                pathname: "/user/[user]",
                params: { user: item.name },
              }}
              asChild
            >
              <Pressable>
                <MoneyItem name={item.name} />
              </Pressable>
            </Link>
          )}
          ItemSeparatorComponent={SeperatorComponent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}

interface dataTypes {
  name: string;
}

const MoneyItem = ({ name }: dataTypes) => {
  return (
    <View style={styles.details}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>{name}</Text>
      <Text
        style={[
          styles.opacity50,
          styles.textUnderline,
          styles.fontSemibold,
          styles.textMd,
        ]}
      >
        More Details→
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 15,
    height: "auto",
    width: "100%",
    marginHorizontal: "auto",
    borderRadius: 10,
  },
  details: {
    padding: 10,
    height: 60,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#e8e9ed",
    borderColor: "#dddfe5",
    borderWidth: 1,
  },
  flexRow: {
    flexDirection: "row",
  },
  justifyBetween: {
    justifyContent: "space-between",
  },
  fullWidth: {
    width: "100%",
  },
  text4XL: {
    fontSize: 32,
  },
  mt2: {
    marginTop: 8,
  },
  fontBold: {
    fontWeight: "bold",
  },
  textPrimaryColor: {
    color: "#547bd4",
  },
  mt5: {
    marginTop: 20,
  },
  fontSemibold: {
    fontWeight: "600",
  },
  opacity50: {
    opacity: 0.5,
  },
  textUnderline: {
    textDecorationLine: "underline",
  },
  textMd: {
    fontSize: 14,
  },
});
