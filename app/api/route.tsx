import { ref, set, get, update } from "firebase/database";
import database from "../../firebaseConfig";

export const postUserData = async (
  whoPaid: any,
  amount: any,
  selected: any
) => {
  try {
    const snapshot = await get(ref(database, "Money"));
    const existingData = snapshot.val() || {};

    const userData = { ...existingData };
    const amountPerPerson = amount / selected.length;
    
    selected.forEach((user: any) => {
      if (!userData[user]) {
        userData[user] = {
          toReceiveFrom: {},
          toPayTo: {},
          totalToPay: 0,
          totalToReceive: 0,
        };
      }

      if (user === whoPaid) {
        userData[user].totalToReceive += amount - amountPerPerson;
        selected.forEach((otherUser: any) => {
          if (otherUser !== whoPaid) {
            userData[user].toReceiveFrom[otherUser] =
              (userData[user].toReceiveFrom[otherUser] || 0) + amountPerPerson;
          }
        });
      } else {
        userData[user].toPayTo[whoPaid] =
          (userData[user].toPayTo[whoPaid] || 0) + amountPerPerson;
        userData[user].totalToPay =
          (userData[user].totalToPay || 0) + amountPerPerson;
      }
    });

    // Write the updated data to the database
    await set(ref(database, "Money"), userData);
    console.log("Data written successfully");
  } catch (error) {
    console.error("Error writing data:", error);
    throw error;
  }
};

export const postUsers = async (userId: string, userName: string) => {
  try {
    await set(ref(database, `Users/${userId}`), userName);
  } catch (error) {
    console.error("Error writing data:", error);
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const snapshot = await get(ref(database, "Users"));
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No users available");
      return null;
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const getAllTransactions = async () => {
  try {
    const [transactionSnapshot, userSnapshot] = await Promise.all([
      get(ref(database, "IndivdualTransactions")),
      get(ref(database, "Users")),
    ]);

    const transactions = transactionSnapshot.exists()
      ? transactionSnapshot.val()
      : {};
    const users = userSnapshot.exists() ? userSnapshot.val() : {};

    if (!transactions || !Object.keys(transactions).length || !users) {
      console.log("No transactions or users available");
      return { users: [] };
    }

    const batchUpdates: Record<string, any> = {};

    // Process each transaction
    const updatedUsers = { ...users }; // Create a copy of users to update

    Object.entries(transactions).forEach(([key, transaction]: any) => {
      const { amount, selected, whoPaid } = transaction;
      const dividedAmount = (amount / selected.length).toFixed(2);

      batchUpdates[`IndivdualTransactions/${key}`] = {
        ...transaction,
        calculated: true,
      };

      selected.forEach((userId: string) => {
        const user = updatedUsers[userId] || {
          toPay: "0.00",
          toReceive: "0.00",
        };

        if (userId !== whoPaid) {
          const updatedToPay = (
            parseFloat(user.toPay || "0.00") + parseFloat(dividedAmount)
          ).toFixed(2);
          updatedUsers[userId].toPay = updatedToPay; // Update in memory
        } else {
          const updatedToReceive = (
            parseFloat(user.toReceive || "0.00") + parseFloat(amount)
          ).toFixed(2);
          updatedUsers[userId].toReceive = updatedToReceive; // Update in memory
        }
      });
    });

    // Perform batch updates in one go
    await update(ref(database), batchUpdates);

    // Generate result data in memory before returning
    const result = {
      users: Object.keys(updatedUsers).map((userId) => {
        const userTransactionsToPay = Object.values(transactions)
          .filter(
            (transaction: any) =>
              transaction.selected.includes(userId) &&
              transaction.whoPaid !== userId
          )
          .reduce((acc: any[], transaction: any) => {
            const amountToPay = (
              transaction.amount / transaction.selected.length
            ).toFixed(2);
            const existing = acc.find((t) => t.toUser === transaction.whoPaid);
            if (existing) {
              existing.amountToPay = (
                parseFloat(existing.amountToPay) + parseFloat(amountToPay)
              ).toFixed(2);
            } else {
              acc.push({
                transactionId: transaction.id,
                amountToPay,
                toUser: transaction.whoPaid,
              });
            }
            return acc;
          }, []);

        const userTransactionsToReceive = Object.values(transactions)
          .filter((transaction: any) => transaction.whoPaid === userId)
          .reduce((acc: any[], transaction: any) => {
            const amountToReceive = (
              transaction.amount / transaction.selected.length
            ).toFixed(2);
            transaction.selected
              .filter((item: string) => item !== userId)
              .forEach((fromUser: any) => {
                const existing = acc.find((t) => t.fromUser === fromUser);
                if (existing) {
                  existing.amountToReceive = (
                    parseFloat(existing.amountToReceive) +
                    parseFloat(amountToReceive)
                  ).toFixed(2);
                } else {
                  acc.push({
                    transactionId: transaction.id,
                    amountToReceive,
                    fromUser,
                  });
                }
              });
            return acc;
          }, []);

        const totalToPay = userTransactionsToPay
          .reduce(
            (sum, transaction) => sum + parseFloat(transaction.amountToPay),
            0
          )
          .toFixed(2);
        const totalToReceive = userTransactionsToReceive
          .reduce(
            (sum, transaction) => sum + parseFloat(transaction.amountToReceive),
            0
          )
          .toFixed(2);

        return {
          name: updatedUsers[userId]?.name || "Unknown",
          toPay: totalToPay,
          toReceive: totalToReceive,
          transactionsToPay: userTransactionsToPay,
          transactionsToReceive: userTransactionsToReceive,
        };
      }),
    };

    return result;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};
