import React, { Children, useEffect, useState } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator, HeaderTitle } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";

import { useAuth } from "../../context/AuthContext";

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableHighlight,
} from "react-native";

export default ({ data, horizontal, onPress, colums }) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginVertical: 20,
    },
    scrollView: {
      flex: 1,
      justifyContent: "space-around",
    },
    itemText: {
      fontSize: 14,
      color: "#fff",
      fontWeight: "bold",
      letterSpacing: 1.4,
      flexShrink: 1,
    },
    item: {
      padding: 5,
      opacity: 0.7,
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      margin: 2,
      height: 100,
      minWidth: 120,
    },
    header: {
      alignItems: "center",
      marginVertical: 20,
    },
    headerText: {
      fontFamily: "Roboto-Bold",
      fontSize: 24,
      letterSpacing: -1,
    },
  });

  const RenderItem = ({ item, index, seperators }) => (
    <TouchableHighlight
      onLongPress={() => onPress(item.name)}
      style={{ ...styles.item, backgroundColor: item.match ? "green" : "blue" }}
    >
      <Text style={styles.itemText}>{item.name}</Text>
    </TouchableHighlight>
  );

  return (
    <View>
      <FlatList
        horizontal={horizontal}
        data={data}
        renderItem={RenderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={colums}
      />
    </View>
  );
};
