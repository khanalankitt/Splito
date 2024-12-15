import { ref, set, get, update } from "firebase/database";
import database from "../../firebaseConfig";
import { addLogBoxLog } from "react-native-reanimated/lib/typescript/logger";

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

    Object.entries(transactions).forEach(([key, transaction]: any) => {
      if (transaction.calculated) return;

      const { amount, selected, whoPaid } = transaction;
      const dividedAmount = (amount / selected.length).toFixed(2);

      batchUpdates[`IndivdualTransactions/${key}`] = {
        ...transaction,
        calculated: true,
      };

      selected.forEach((userId: string) => {
        if (userId === whoPaid) return;

        const user = users[userId] || { toPay: "0.00", toReceive: "0.00" };
        const updatedToPay = (
          parseFloat(user.toPay || "0.00") + parseFloat(dividedAmount)
        ).toFixed(2);

        batchUpdates[`Users/${userId}`] = {
          ...user,
          toPay: Math.max(0, parseFloat(updatedToPay)).toFixed(2),
        };
      });

      const payer = users[whoPaid] || { toPay: "0.00", toReceive: "0.00" };
      const updatedToReceive = (
        parseFloat(payer.toReceive || "0.00") +
        parseFloat(payer.toReceive || "0.00") +
        (amount - parseFloat(dividedAmount))
      ).toFixed(2);

      batchUpdates[`Users/${whoPaid}`] = {
        ...payer,
        toReceive: Math.max(0, parseFloat(updatedToReceive)).toFixed(2),
      };
    });

    await update(ref(database), batchUpdates);

    const [updatedTransactionSnapshot, updatedUserSnapshot] = await Promise.all(
      [get(ref(database, "IndivdualTransactions")), get(ref(database, "Users"))]
    );

    const updatedTransactions = updatedTransactionSnapshot.exists()
      ? updatedTransactionSnapshot.val()
      : {};
    const updatedUsers = updatedUserSnapshot.exists()
      ? updatedUserSnapshot.val()
      : {};

    const result = {
      users: Object.keys(updatedUsers).map((userId) => {
        const userTransactionsToPay = Object.values(updatedTransactions)
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
                transactionId: transaction.transactionTimeStamp,
                amountToPay,
                toUser: transaction.whoPaid,
                payer: userId,
              });
            }
            return acc;
          }, []);

        const userTransactionsToReceive = Object.values(updatedTransactions)
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
                    transactionId: transaction.transactionTimeStamp,
                    amountToReceive,
                    fromUser,
                    receiver: userId,
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

// export const deleteTransactions = async (
//   whoPaid: string,
//   whoReceived: string,
//   amount: number
// ) => {
//   try {
//     const payerSnapshot = await get(ref(database, `Users/${whoPaid}`));
//     const receiverSnapshot = await get(ref(database, `Users/${whoReceived}`));

//     if (!payerSnapshot.exists() || !receiverSnapshot.exists()) {
//       throw new Error("Payer or receiver does not exist");
//     }

//     const payer = payerSnapshot.val();
//     const receiver = receiverSnapshot.val();

//     const updatedPayerToPay = Math.max(
//       0,
//       parseFloat(payer.toPay) - amount
//     ).toFixed(2);
//     const updatedReceiverToReceive = Math.max(
//       0,
//       parseFloat(receiver.toReceive) - amount
//     ).toFixed(2);

//     await set(ref(database, `Users/${whoPaid}/toPay`), updatedPayerToPay);
//     await set(
//       ref(database, `Users/${whoReceived}/toReceive`),
//       updatedReceiverToReceive
//     );
//   } catch (error) {
//     console.error("Error deleting transaction:", error);
//     throw error;
//   }
// };

export const deleteTransactions = async (
  whoPaid: string,
  whoReceived: string,
  amount: number,
  transactionId: string // Pass transaction ID as an argument
) => {
  try {
    const payerSnapshot = await get(ref(database, `Users/${whoPaid}`));
    const receiverSnapshot = await get(ref(database, `Users/${whoReceived}`));
    const transactionSnapshot = await get(ref(database, `IndivdualTransactions/${transactionId}`));

    if (!payerSnapshot.exists() || !receiverSnapshot.exists() || !transactionSnapshot.exists()) {
      throw new Error("Payer, receiver, or transaction does not exist");
    }

    const payer = payerSnapshot.val();
    const receiver = receiverSnapshot.val();
    const transaction = transactionSnapshot.val();

    // Subtract the amount from the payer's and receiver's balances
    const updatedPayerToPay = Math.max(0, parseFloat(payer.toPay) - amount).toFixed(2);
    const updatedReceiverToReceive = Math.max(0, parseFloat(receiver.toReceive) - amount).toFixed(2);

    // Update the users' balances
    await set(ref(database, `Users/${whoPaid}/toPay`), updatedPayerToPay);
    await set(ref(database, `Users/${whoReceived}/toReceive`), updatedReceiverToReceive);

    // Update the transaction: subtract the amount and remove the payer from the selected array
    const updatedTransaction = { ...transaction };
    updatedTransaction.amount = (parseFloat(transaction.amount) - amount).toFixed(2);
    updatedTransaction.selected = updatedTransaction.selected.filter((userId: string) => userId !== whoPaid);

    // If no users are left in the selected array, we might want to delete the transaction or mark it as completed
    if (updatedTransaction.selected.length === 0) {
      await set(ref(database, `IndivdualTransactions/${transactionId}`), null); // Delete the transaction if no one is left
    } else {
      await set(ref(database, `IndivdualTransactions/${transactionId}`), updatedTransaction); // Update the transaction
    }

    console.log("Transaction and user balances updated successfully!");
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw error;
  }
};


export const updateTransactionInDatabase = async (
  whoPaid: string,
  whoReceived: string,
  amount: number
) => {
  try {
    // Get the current users and transactions
    const snapshot = await getAllTransactions();
    const users = snapshot.users;

    // Find the specific transaction to remove
    const transactionsToUpdate: Record<string, any> = {};

    // Iterate through all transactions
    Object.entries(snapshot.users || {}).forEach(
      ([transactionKey, transaction]: any) => {
        // Check if this transaction involves the users we want to update
        if (
          transaction.whoPaid === whoPaid &&
          transaction.selected.includes(whoReceived)
        ) {
          // Remove the transaction or mark it as deleted
          transactionsToUpdate[`IndivdualTransactions/${transactionKey}`] =
            null;
        }
      }
    );

    // Perform batch update
    await update(ref(database), transactionsToUpdate);

    // Return the updated transactions
    return snapshot;
  } catch (error) {
    console.error("Error updating transactions:", error);
    throw error;
  }
};
