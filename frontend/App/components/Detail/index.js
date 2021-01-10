import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { COLORS, FONTS, SIZES } from "../../constants";

export const Detail = (props) => {
    useEffect(() => {
        console.log("detailpage")
    })


    return (
        <View style={style.container}>
            <Text>Detailzzz</Text>
           
        </View>
    )

}

const style = StyleSheet.create({
    container: {
        display: "flex",
        justifyContent:'center'
    }

})