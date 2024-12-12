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
      <BottomBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6e9",
  },
  text: {
    color: "#02012e",
    fontSize: 30,
    fontWeight: "bold",
    paddingLeft: 10,
  },
  button: {
    height: 40,
    width: 100,
    borderRadius: 10,
    backgroundColor: "#697596",
  },
  nav: {
    backgroundColor: "red",
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
