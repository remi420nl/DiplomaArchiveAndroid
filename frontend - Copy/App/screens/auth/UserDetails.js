import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, Button } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { COLORS } from "../../assets/constants";
import { LogIn } from "../../../api/Api";

export default () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text style={{ color: "gray", fontSize: 34 }}>Edit Profile</Text>
  </View>
);
