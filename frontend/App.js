import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View, SafeAreaView, Platform} from "react-native";
import { GetCourses } from "./api/Api";
import axios from "axios";
import { Entypo } from '@expo/vector-icons'; 
import {Home} from './screens/home/index'

export default function App() {
  const [courses, setCourses] = useState([]);

  function LoadCourses() {
    console.log("clicked");

   GetCourses().then((r) => {
     console.log(r.data)
     setCourses(r.data)
   }).catch(e => console.log(e))
  }

  useEffect(() => {
    console.log("useffect..");
  }, []);

  return (<>
    <StatusBar barStyle='light-content' translucent />
    <SafeAreaView style={styles.view}>
        
    <Home/>
    <Entypo name="home" size={24} color="black" />
    </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  view: {
  
    flex: 1,
    backgroundColor: "#d3d3d3",
    paddingTop: Platform.OS === 'android' ? 25 : 0
},
});
