import { ref, set, get, update } from "firebase/database";
import database from "../../firebaseConfig";

interface deleteDetails {
  payer: string;
  amount: any;
  user: string;
}

export const postUserData = async (
  whoPaid: any,
  amount: number,
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
    });

    selected.forEach((user: any) => {
      if (user === whoPaid) {
        userData[user].totalToReceive += amount - amountPerPerson;
        //updating toReceiveFrom for payer
        selected.forEach((otherUser: any) => {
          if (otherUser !== whoPaid) {
            userData[user].toReceiveFrom[otherUser] =
              (userData[user].toReceiveFrom[otherUser] || 0) + amountPerPerson;
          }
        });
        //updating toPayTo for payer
        selected.forEach((otherUser: any) => {
          if (otherUser !== whoPaid) {
            userData[user].toPayTo[otherUser] =
              (userData[user].toPayTo[otherUser] || 0) + 0;
          }
        });
      } else {
        userData[user].totalToPay += amountPerPerson;
        //updating toPayTo for other users
        selected.forEach((otherUser: any) => {
          if (otherUser === whoPaid) {
            userData[user].toPayTo[whoPaid] =
              (userData[user].toPayTo[whoPaid] || 0) + amountPerPerson;
          } else {
            userData[user].toPayTo[whoPaid] =
              (userData[user].toPayTo[whoPaid] || 0) + 0;
          }
        });
        //updating toReceiveFrom for other users
        selected.forEach((otherUser: any) => {
          if (otherUser !== user) {
            userData[user].toReceiveFrom[otherUser] =
              (userData[user].toReceiveFrom[otherUser] || 0) + 0;
          }
        });
      }
    });

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
    const snapshot = await get(ref(database, "Money"));
    // console.log(snapshot.val());

    return snapshot.val();
  } catch (error) {
    console.error("Error fetching data", error);
    throw error;
  }
};

export const deleteTransaction = async ({
  payer,
  amount,
  user,
}: deleteDetails) => {
  const snapshot = await get(ref(database, "Money"));
  const existingData = snapshot.val() || {};
  const userData = { ...existingData };

  userData[payer].totalToPay -= amount;
  userData[user].totalToReceive -= amount;

  //modify toPayTo for payer
  userData[payer].toPayTo[user] -= amount;

  //modify toReceiveFrom for user(receiver)
  userData[user].toReceiveFrom[payer] -= amount;
  console.log("Updating DB with new information.");

  await set(ref(database, "Money"), userData);
  console.log("Database update succesfull!");
  return true;
};
