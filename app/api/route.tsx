import { ref, set, get } from "firebase/database";
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
    const transactionSnapshot = await get(
      ref(database, "IndivdualTransactions")
    );
    if (transactionSnapshot.exists()) {
      var transactions = transactionSnapshot.val();
    }

    const userSnapShot = await get(ref(database, "Users"));
    if (userSnapShot.exists()) {
      var users = userSnapShot.val();
    }

    if (transactions && typeof transactions === "object") {
      Object.keys(transactions).forEach(async (key) => {
        let calculated = transactions[key].calculated;
        if (calculated) {
          return;
        }
        transactions[key].calculated = true;
        await set(
          ref(database, `IndivdualTransactions/${key}`),
          transactions[key]
        );
        let amount = transactions[key].amount;
        let length = transactions[key].selected.length;
        let dividedAmount = (amount / length).toFixed(2);
        let selectedUsers = transactions[key].selected;
        let whoPaid = transactions[key].whoPaid;

        selectedUsers.forEach(async (item: any) => {
          const userRef = ref(database, `Users/${item}`);
          const userSnapshot = await get(userRef);
          if (userSnapshot.exists()) {
            const userData = userSnapshot.val();
            if (item !== whoPaid) {
              const updatedToPay = (
                parseFloat(userData.toPay || 0) + parseFloat(dividedAmount)
              ).toFixed(2);
              await set(userRef, {
                ...userData,
                toPay: updatedToPay,
              });
            } else {
              const updatedToReceive = (
                parseFloat(userData.toReceive || 0) +
                (amount - parseFloat(dividedAmount))
              ).toFixed(2);
              await set(userRef, {
                ...userData,
                toReceive: updatedToReceive,
              });
            }
          }
        });
      });

      const result = {
        users: Object.keys(users).map((userId) => {
          const userTransactionsToPay = Object.keys(transactions)
            .map((transactionId) => {
              const transaction = transactions[transactionId];
              if (
                transaction.selected.includes(userId) &&
                transaction.whoPaid !== userId
              ) {
                return {
                  transactionId,
                  amountToPay: (
                    transaction.amount / transaction.selected.length
                  ).toFixed(2),
                  toUser: transaction.whoPaid,
                };
              }
              return null;
            })
            .filter(Boolean)
            .reduce((acc: any[], curr: any) => {
              const existingTransaction = acc.find(
                (t: any) => t.toUser === curr.toUser
              );
              if (existingTransaction) {
                existingTransaction.amountToPay = (
                  parseFloat(existingTransaction.amountToPay) +
                  parseFloat(curr.amountToPay)
                ).toFixed(2);
              } else {
                acc.push(curr);
              }
              return acc;
            }, []);

          const userTransactionsToReceive = Object.keys(transactions)
            .map((transactionId) => {
              const transaction = transactions[transactionId];
              if (transaction.whoPaid === userId) {
                const receivingUsers = transaction.selected.filter(
                  (item: string) => item !== userId
                );
                return receivingUsers.map((receiver: any) => ({
                  transactionId,
                  amountToReceive: (
                    transaction.amount / transaction.selected.length
                  ).toFixed(2),
                  fromUser: receiver,
                }));
              }
              return null;
            })
            .flat()
            .filter(Boolean)
            .reduce((acc: any[], curr: any) => {
              const existingTransaction = acc.find(
                (t: any) => t.fromUser === curr.fromUser
              );
              if (existingTransaction) {
                existingTransaction.amountToReceive = (
                  parseFloat(existingTransaction.amountToReceive) +
                  parseFloat(curr.amountToReceive)
                ).toFixed(2);
              } else {
                acc.push(curr);
              }
              return acc;
            }, []);

          return {
            name: users[userId].name || "Unknown",
            toPay: users[userId].toPay || "0.00",
            toReceive: users[userId].toReceive || "0.00",
            transactionsToPay: userTransactionsToPay,
            transactionsToReceive: userTransactionsToReceive,
          };
        }),
      };

      return result;
    }
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};
