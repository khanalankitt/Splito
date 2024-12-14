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

    // console.log(
    //   "\nUsers:",
    //   JSON.stringify(users.Ankit, null, 2),
    //   "\nTransactions:",
    //   JSON.stringify(transactions, null, 2)
    // );

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
        selectedUsers.forEach(async (item: string) => {
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
                parseFloat((amount - amount / length).toString())
              ).toFixed(2);
              await set(userRef, {
                ...userData,
                toReceive: updatedToReceive,
              });
            }
          }
        });
      });
    }
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};
