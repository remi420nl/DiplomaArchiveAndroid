import React, { useState, useEffect } from "react";
import Navigation from "./components/Navigation";
import * as Font from "expo-font";
import { StatusBar } from "react-native";
import { AuthProvider } from "../App/context/AuthContext";
import Loading from "../App/components/loading";

export default function App() {
  const [loading, setLoading] = useState(true);

  //Making sure fonts are loaded before the app is shown

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
      <StatusBar barStyle="dark-content" />
      <Navigation />
    </AuthProvider>
  ) : (
    <Loading />
  );
}
