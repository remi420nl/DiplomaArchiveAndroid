import React, { useContext, useState, useEffect } from "react";
import Navigation from "./components/Navigation";
import * as Font from "expo-font";
import {
  Button,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { AuthProvider } from "../App/context/AuthContext";
import { COLORS } from "./assets/constants";
import Loading from "../App/screens/loading";


const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: "blue",
    // paddingTop: Platform.OS === "android" ? 25 : 0,
  },
});

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Font.loadAsync({
      "Roboto-Bold": require("./assets/constants/fonts/Roboto-Bold.ttf"),
      "Roboto-Regular": require("./assets/constants/fonts/Roboto-Regular.ttf"),
    }).then(() => {
      setLoading(false);
    });
  });

  return !loading ? (
    <AuthProvider>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />
      <Navigation />
    </AuthProvider>
  ) : (
    <Loading />
  );
}
