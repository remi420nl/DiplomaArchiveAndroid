import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, Button } from "react-native";

export const CourseDetail = ({ route }) => (
  <View >
    <Text>Course Details {route.params.slug}</Text>
  </View>
);
