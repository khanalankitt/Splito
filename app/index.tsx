import { StatusBar, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Nav from "@/components/nav";
import List from "@/components/list";
export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#547bd4" />
      <Nav />
      <List />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6e9",
  },
});
