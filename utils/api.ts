import { ref, set, get } from "firebase/database";
import database from "../firebaseConfig.js";


export const postUserData = async (
  whoPaid: string,
  amount: number,
  selected: string[]
) => {
  try {
    if (
      !whoPaid ||
      !Array.isArray(selected) ||
      selected.length === 0 ||
      amount <= 0
    ) {
      throw new Error(
        "Invalid input: whoPaid, amount, or selected is undefined/empty."
      );
    }

    const snapshot = await get(ref(database, "Money"));
    const existingData = snapshot.val() || {};
    const userData = { ...existingData };

    [whoPaid, ...selected].forEach((user) => {
      if (!userData[user]) {
        userData[user] = {};
      }
      userData[user].toReceiveFrom = userData[user].toReceiveFrom || {};
      userData[user].toPayTo = userData[user].toPayTo || {};
      userData[user].totalToPay = userData[user].totalToPay || 0;
      userData[user].totalToReceive = userData[user].totalToReceive || 0;
    });

    if (!selected.includes(whoPaid)) {
      const amountPerPerson = parseFloat((amount / selected.length).toFixed(3));

      selected.forEach((user) => {
        userData[user].totalToPay += amountPerPerson;
        userData[user].toPayTo[whoPaid] =
          (userData[user].toPayTo[whoPaid] || 0) + amountPerPerson;
      });
      console.log(amountPerPerson);
      userData[whoPaid].totalToReceive += amount;
      selected.forEach((user) => {
        userData[whoPaid].toReceiveFrom[user] =
          (userData[whoPaid].toReceiveFrom[user] || 0) + amountPerPerson;
      });
    } else {
      const amountPerPerson = parseFloat((amount / selected.length).toFixed(3));
      selected.forEach((user) => {
        if (user === whoPaid) {
          userData[user].totalToReceive += amount - amountPerPerson;
          selected.forEach((otherUser) => {
            if (otherUser !== whoPaid) {
              userData[user].toReceiveFrom[otherUser] =
                (userData[user].toReceiveFrom[otherUser] || 0) +
                amountPerPerson;
            }
          });
        } else {
          userData[user].totalToPay += amountPerPerson;
          userData[user].toPayTo[whoPaid] =
            (userData[user].toPayTo[whoPaid] || 0) + amountPerPerson;
        }
      });
    }

    await set(ref(database, "Money"), userData);
    return { status: true, message: "Data written successfully" };
  } catch (error) {
    console.error("Error writing data:", error);
    return {
      status: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
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

export const register = async (username: string, password: string) => {
  try {
    const snapshot = await get(ref(database, `Users/${username}`));
    if (snapshot.exists()) {
      return { message: "User already exists", status: false };
    }
    await set(ref(database, `Users/${username}`), { username, password });
    return { message: "User registered successfully", status: true };
  } catch (error) {
    console.error("Error during registration:", error);
    return {
      status: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const login = async (username: string, password: string) => {
  try {
    const snapshot = await get(ref(database, `Users/${username}`));
    if (!snapshot.exists()) {
      return { message: "User does not exist", status: false };
    }
    const userData = snapshot.val();
    if (userData.password === password) {
      return { message: "Login successful", status: true };
    } else {
      return { message: "Invalid password", status: false };
    }
  } catch (error) {
    console.error("Error during login:", error);
    return {
      status: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const deleteTransaction = async ({ payer, amount, user }: any) => {
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
