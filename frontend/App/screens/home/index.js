import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Pressable, TouchableOpacity} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { COLORS, FONTS, SIZES } from "../../assets/constants";
import { Entypo} from '@expo/vector-icons'


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: COLORS.lightGray3,
    borderColor: 'black',
    borderWidth: 5,
    
  },
  main: {
    width: "100%",
    height: "80%",
    marginLeft: 20,
    justifyContent: "center",


  },
  title: {
    ...FONTS.h1,
    fontSize: 60,
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



export default  Home = ({navigation}) => {

const [searchText,setSearchText] = useState("Zoek Vak")

  return (
    <View style={styles.container}> 
   <View  style={styles.header}>
                <TouchableOpacity onPress={() => {
                    navigation.push('Login')
                }}>
                <Entypo name="cog" size={32} color={COLORS.white}/>
                </TouchableOpacity>
            </View>

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
