import { StatusBar, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Nav from "@/components/nav";
import List from "@/components/list";
import Sidebar from "@/components/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect } from "react";
import { router } from "expo-router";

export default function HomeScreen() {
  const { isLoggedIn, userName, isLoading } = useAuth();
  const { colors } = useTheme();

  useEffect(() => {
    const initializeApp = async () => {
      // Only redirect if not loading and not logged in
      if (!isLoading && !isLoggedIn) {
        router.replace("/loginPage");
      }
    };
    
    initializeApp();
  }, [isLoggedIn, isLoading]);

  // Show loading or return null while authentication is loading
  if (isLoading) {
    return null;
  }

  // If not logged in, return null (will redirect)
  if (!isLoggedIn) {
    return null;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar backgroundColor={colors.primary} />
      <Nav />
      <Sidebar />
      <List />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
