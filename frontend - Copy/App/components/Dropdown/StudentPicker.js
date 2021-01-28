import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";

const allDiplomas = { name: "Alle Diplomas", id: null, email: "null" };
export default ({ data, onPress }) => {
  data = [...data, allDiplomas];

  const selected = useRef(allDiplomas);

  useEffect(() => {
    console.log("studentpicker");
  });

  return (
    <Picker
      selectedValue={selected.current}
      style={{ height: 50, width: 200 }}
      onValueChange={(value, index) => {
        selected.current = value;
        onPress(selected.current);
      }}
    >
      {data.map((student, i) => (
        <Picker.Item key={i} label={student.name} value={student} />
      ))}
    </Picker>
  );
};
