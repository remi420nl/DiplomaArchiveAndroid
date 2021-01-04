import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";

export const Home = (props) => {

const [searchText,setSearchText] = useState("Zoek Vak")

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.upperbutton}
        onPress={() => {
            setSearchText("");
            console.warn("clicked")
        }}
    
      >
        <AntDesign name="search1" size={24} color="darkred" />
        <Text style={styles.pressabletext}>{searchText}</Text>
      </Pressable>
      <View style={styles.main}>
        <Text style={styles.title}>Diploma Archive</Text>
        <Pressable
          style={styles.lowerbutton}
          onPress={() => console.warn("clicked")}
        >
          <Text style={styles.pressabletext}>Diploma Uploaden</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  main: {
    width: "100%",
    height: "90%",
    marginLeft: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 60,
    fontWeight: "bold",
    color: "#1c86ee",
    width: "60%",

  },
  upperbutton: {
    top: 15,
    backgroundColor: "#fff",
    width: "55%",
    borderRadius: 20,
    padding: 12,
    flexDirection: 'row',
    
    justifyContent: 'space-evenly'

  },
  lowerbutton: {
    backgroundColor: "#fff",
    width: "55%",
    borderRadius: 10,
    paddingTop: 5,
    paddingBottom: 5,
    marginTop: 25,
  },
  pressabletext: {
    fontSize: 20,
    color: "black",
    alignSelf: "center",
  },
});
