import { ref, set, get, update } from "firebase/database";
import database from "../../firebaseConfig";

export const postUserData = async (userId: string, userData: object) => {
  const dateAndTime = `Transaction ${new Date()
    .toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
    .replace(/\//g, "-")}`;

  try {
    await set(ref(database, `IndivdualTransactions/${dateAndTime}`), userData);
  } catch (error) {
    console.error("Error writing data:", error);
    throw error;
  }
};

export const postUsers = async (userId: string, user: object) => {
  try {
    await set(ref(database, `Users/${userId}`), user);
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
