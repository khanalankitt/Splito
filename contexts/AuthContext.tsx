import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextType {
  isLoggedIn: boolean;
  userName: string;
  isLoading: boolean;
  sidebarOpen: boolean;
  userLogin: (name: string) => void;
  userLogout: () => void;
  toggleSidebarVisibility: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("userName");
        if (storedUser) {
          setUserName(storedUser);
          setIsLoggedIn(true);
        }
        
        // Always start with sidebar closed
        setSidebarOpen(false);
        await AsyncStorage.setItem("isSidebarOpen", "close");
      } catch (error) {
        console.log("Error loading user from AsyncStorage:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const toggleSidebarVisibility = async () => {
    try {
      const newState = !sidebarOpen;
      setSidebarOpen(newState);
      await AsyncStorage.setItem(
        "isSidebarOpen",
        newState ? "open" : "close"
      );
    } catch (error) {
      console.log("Error saving user to AsyncStorage:", error);
    }
  };

  const userLogin = async (name: string) => {
    try {
      setIsLoggedIn(true);
      setUserName(name);
      await AsyncStorage.setItem("userName", name);
    } catch (error) {
      console.log("Error saving user to AsyncStorage:", error);
    }
  };

  const userLogout = async () => {
    try {
      setIsLoggedIn(false);
      setUserName("");
      await AsyncStorage.setItem("userName", "");
    } catch (error) {
      console.log("Error removing user from AsyncStorage:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userName,
        isLoading,
        sidebarOpen,
        userLogin,
        userLogout,
        toggleSidebarVisibility,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
