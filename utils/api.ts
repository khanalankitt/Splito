import { ref, set, get, update } from "firebase/database";
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

    // Apply net settlements after adding the transaction
    const settledData = calculateNetSettlements(userData);
    await set(ref(database, "Money"), settledData);
    return {
      status: true,
      message: "Data written successfully with net settlements applied",
    };
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

// Function to calculate net settlements between users
export const calculateNetSettlements = (userData: any) => {
  try {
    if (!userData || typeof userData !== "object") {
      console.log("No user data provided for net settlement calculation");
      return {};
    }

    // Deep clone safely
    let settledData;
    try {
      settledData = JSON.parse(JSON.stringify(userData));
    } catch (e) {
      console.error("Error cloning userData:", e);
      return userData; // Return original if can't clone
    }

    // Ensure all users have proper structure
    Object.keys(settledData).forEach((user) => {
      if (!settledData[user]) settledData[user] = {};
      if (!settledData[user].toPayTo) settledData[user].toPayTo = {};
      if (!settledData[user].toReceiveFrom)
        settledData[user].toReceiveFrom = {};
      if (typeof settledData[user].totalToPay !== "number")
        settledData[user].totalToPay = 0;
      if (typeof settledData[user].totalToReceive !== "number")
        settledData[user].totalToReceive = 0;
    });

    // Process each user pair to calculate net amounts
    Object.keys(settledData).forEach((user1) => {
      Object.keys(settledData).forEach((user2) => {
        if (user1 !== user2 && settledData[user1] && settledData[user2]) {
          // Get amounts between user1 and user2
          const user1OwesToUser2 = settledData[user1].toPayTo[user2] || 0;
          const user2OwesToUser1 = settledData[user2].toPayTo[user1] || 0;

          if (user1OwesToUser2 > 0 && user2OwesToUser1 > 0) {
            // Calculate net amount
            const netAmount = Math.abs(user1OwesToUser2 - user2OwesToUser1);

            if (user1OwesToUser2 > user2OwesToUser1) {
              // user1 owes net amount to user2
              settledData[user1].toPayTo[user2] = parseFloat(
                netAmount.toFixed(3)
              );
              settledData[user2].toReceiveFrom[user1] = parseFloat(
                netAmount.toFixed(3)
              );

              // Clear the reverse debt
              settledData[user2].toPayTo[user1] = 0;
              settledData[user1].toReceiveFrom[user2] = 0;
            } else if (user2OwesToUser1 > user1OwesToUser2) {
              // user2 owes net amount to user1
              settledData[user2].toPayTo[user1] = parseFloat(
                netAmount.toFixed(3)
              );
              settledData[user1].toReceiveFrom[user2] = parseFloat(
                netAmount.toFixed(3)
              );

              // Clear the reverse debt
              settledData[user1].toPayTo[user2] = 0;
              settledData[user2].toReceiveFrom[user1] = 0;
            } else {
              // Equal amounts, clear both debts
              settledData[user1].toPayTo[user2] = 0;
              settledData[user2].toPayTo[user1] = 0;
              settledData[user1].toReceiveFrom[user2] = 0;
              settledData[user2].toReceiveFrom[user1] = 0;
            }
          }
        }
      });
    });

    // Recalculate totals after net settlement
    Object.keys(settledData).forEach((user) => {
      if (settledData[user]) {
        settledData[user].totalToPay = Object.values(
          settledData[user].toPayTo || {}
        ).reduce(
          (sum: number, amount: any) => sum + parseFloat(amount.toString()),
          0
        );

        settledData[user].totalToReceive = Object.values(
          settledData[user].toReceiveFrom || {}
        ).reduce(
          (sum: number, amount: any) => sum + parseFloat(amount.toString()),
          0
        );

        // Round to 3 decimal places
        settledData[user].totalToPay = parseFloat(
          settledData[user].totalToPay.toFixed(3)
        );
        settledData[user].totalToReceive = parseFloat(
          settledData[user].totalToReceive.toFixed(3)
        );
      }
    });

    return settledData;
  } catch (error) {
    console.error("Error in calculateNetSettlements:", error);
    return userData || {}; // Return original data if error
  }
};

// Function to apply net settlements to the database
export const applyNetSettlements = async () => {
  try {
    const snapshot = await get(ref(database, "Money"));
    if (!snapshot.exists()) {
      console.log("No transaction data available");
      return { status: false, message: "No data to settle" };
    }

    const userData = snapshot.val();
    const settledData = calculateNetSettlements(userData);

    await set(ref(database, "Money"), settledData);
    console.log("Net settlements applied successfully");
    return { status: true, message: "Net settlements applied successfully" };
  } catch (error) {
    console.error("Error applying net settlements:", error);
    return {
      status: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const getAllTransactionsWithNetSettlement = async () => {
  try {
    const snapshot = await get(ref(database, "Money"));
    if (!snapshot.exists()) {
      console.log("No transaction data available for net settlement");
      return null;
    }

    const userData = snapshot.val();
    if (!userData || typeof userData !== "object") {
      console.log("Invalid user data format");
      return null;
    }

    const settledData = calculateNetSettlements(userData);

    return settledData;
  } catch (error) {
    console.error("Error fetching data with net settlement", error);
    throw error;
  }
};

// Function to manually trigger net settlements (can be called from UI)
export const manuallyApplyNetSettlements = async () => {
  try {
    const result = await applyNetSettlements();
    return result;
  } catch (error) {
    console.error("Error manually applying net settlements:", error);
    return {
      status: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const deleteAccount = async (username: string) => {
  try {
    // Delete user from Users collection
    await set(ref(database, `Users/${username}`), null);
    
    // Remove user from Money collection transactions
    const moneySnapshot = await get(ref(database, "Money"));
    if (moneySnapshot.exists()) {
      const moneyData = moneySnapshot.val();
      
      // Remove the user's data completely
      if (moneyData[username]) {
        delete moneyData[username];
      }
      
      // Remove the user from other users' transaction lists
      Object.keys(moneyData).forEach(user => {
        if (moneyData[user].toPayTo && moneyData[user].toPayTo[username]) {
          delete moneyData[user].toPayTo[username];
        }
        if (moneyData[user].toReceiveFrom && moneyData[user].toReceiveFrom[username]) {
          delete moneyData[user].toReceiveFrom[username];
        }
        
        // Recalculate totals
        moneyData[user].totalToPay = Object.values(moneyData[user].toPayTo || {})
          .reduce((sum: number, amount: any) => sum + parseFloat(amount.toString()), 0);
        moneyData[user].totalToReceive = Object.values(moneyData[user].toReceiveFrom || {})
          .reduce((sum: number, amount: any) => sum + parseFloat(amount.toString()), 0);
      });
      
      await set(ref(database, "Money"), moneyData);
    }
    
    console.log("Account deleted successfully");
    return { status: true, message: "Account deleted successfully" };
  } catch (error) {
    console.error("Error deleting account:", error);
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

  // Apply net settlements after deletion
  const settledData = calculateNetSettlements(userData);
  await set(ref(database, "Money"), settledData);
  console.log("Database update successful with net settlements!");
  return true;
};
