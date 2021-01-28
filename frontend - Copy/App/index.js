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
  TouchableOpacity,
} from "react-native";
import { AuthProvider } from "../App/context/AuthContext";


const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: "blue",
    // paddingTop: Platform.OS === "android" ? 25 : 0,
  },
});

export default function App() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      "Roboto-Bold": require("./assets/constants/fonts/Roboto-Bold.ttf"),
      "Roboto-Regular": require("./assets/constants/fonts/Roboto-Regular.ttf"),
    }).then(() => {
      setLoaded(true);
    });
  });

  return loaded ? (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  ) : (
    <View>
      <Text>........Loading.........</Text>
    </View>
  );
}
