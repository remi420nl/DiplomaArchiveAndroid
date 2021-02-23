import React, { useRef } from "react";
import { View, StyleSheet} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { COLORS } from "../../assets/constants";

const allDiplomas = { name: "Alle Diplomas", id: null, email: "null" };

// Picker component to show a popup to display all students which have a diploma, which the user can choose from

export default ({ data, onPress }) => {
  data = [...data, allDiplomas];

  const selected = useRef(allDiplomas);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: "#a5b5a3",
      borderColor: COLORS.black,
      borderWidth: 1,
      borderRadius: 5,
      margin: 4,
      alignItems: "center",
    },
    picker: {
      height: 50,
      width: 190,
    },
    item: {
      fontWeight: "bold",
    },
  });

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selected.current}
        style={styles.picker}
        itemStyle={styles.item}
        onValueChange={(value, index) => {
          selected.current = value;
          onPress(selected.current);
        }}
      >
        {data.map((student, i) => (
          <Picker.Item key={i} label={student.name} value={student} />
        ))}
      </Picker>
    </View>
  );
};
