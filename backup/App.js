import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
} from "react-native";
import { GetCourses } from "./api/Api";
import axios from "axios";
import { Entypo } from "@expo/vector-icons";
import { Home } from "./screens/home/index";
import { Detail } from "./components/Detail";

import * as Font from "expo-font";
import { COLORS, FONTS, SIZES } from "./constants";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";

import Main from './index'

export default function App() {
  const [courses, setCourses] = useState([]);
  const [loaded, setLoaded] = useState(false);

  function LoadCourses() {
    console.log("clicked");

    GetCourses()
      .then((r) => {
        console.log(r.data);
        setCourses(r.data);
      })
      .catch((e) => console.log(e));
  }

  const AuthStack = createStackNavigator();

  useEffect(() => {
    Font.loadAsync({
      "Roboto-Bold": require("./assets/fonts/Roboto-Bold.ttf"),
      "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
    }).then(() => {
      setLoaded(true);
    });
  });

  const app = !loaded ? (
    <>
      <Text>Loading..</Text>
    </>
  ) : (
    <>
      <Main />
      {/* <StatusBar barStyle='light-content' translucent />
    <SafeAreaView style={styles.view}>
        
    <Home/>
    <Detail/>
    <Entypo name="home" size={24} color="black" />
    </SafeAreaView> */}
    </>
  );
  return app;
}

const styles = StyleSheet.create({
  container: {},
  view: {
    flex: 1,
    backgroundColor: COLORS.lightGray3,
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
});
