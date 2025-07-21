import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    accent: string;
  };
}

const lightTheme = {
  primary: "#547bd4",
  secondary: "#f6f6e9",
  background: "#f6f6e9",
  surface: "#ffffff",
  text: "#1f2937",
  textSecondary: "#4b5563",
  border: "#d1d5db",
  error: "#dc2626",
  success: "#16a34a",
  accent: "#8b5cf6",
};

const darkTheme = {
  primary: "#6366f1",
  secondary: "#1f2937",
  background: "#111827",
  surface: "#1f2937",
  text: "#f9fafb",
  textSecondary: "#d1d5db",
  border: "#374151",
  error: "#ef4444",
  success: "#22c55e",
  accent: "#a855f7",
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const deviceColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(deviceColorScheme === 'dark');

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem("isDarkMode");
        if (storedTheme !== null) {
          setIsDarkMode(JSON.parse(storedTheme));
        } else {
          // Use device color scheme as default if no stored preference
          setIsDarkMode(deviceColorScheme === 'dark');
        }
      } catch (error) {
        console.log("Error loading theme from AsyncStorage:", error);
        setIsDarkMode(deviceColorScheme === 'dark');
      }
    };
    loadTheme();
  }, [deviceColorScheme]);

  const toggleTheme = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    try {
      await AsyncStorage.setItem("isDarkMode", JSON.stringify(newTheme));
    } catch (error) {
      console.log("Error saving theme to AsyncStorage:", error);
    }
  };

  const colors = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
