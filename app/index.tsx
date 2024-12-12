import { StatusBar, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Nav from "@/components/nav";
import List from "@/components/list";
import BottomBar from "@/components/bottomBar";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <Nav />
      <List />
      {/* <BottomBar /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6e9",
  },
});
