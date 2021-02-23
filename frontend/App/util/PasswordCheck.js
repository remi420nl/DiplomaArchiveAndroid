import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { COLORS } from "../assets/constants";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

const styles = StyleSheet.create({
  validation: {
    flexDirection: "row",
    margin: 2,
  },
});

//For password validation and text to be rendered for the validation

export const isPasswordValid = (form) => {
  const { lowercase, capital, number, length } = passwordValidation(form);
  return lowercase && capital && number && length;
};

export const passwordValidation = (form) => {
  let lowercase = false;
  let capital = false;
  let number = false;
  let length = false;

  const field = form.password;

  const lowerCaseLetters = /[a-z]/g;
  if (field.match(lowerCaseLetters)) {
    lowercase = true;
  }

  const upperCaseLetters = /[A-Z]/g;
  if (field.match(upperCaseLetters)) {
    capital = true;
  }

  const numbers = /[0-9]/g;
  if (field.match(numbers)) {
    number = true;
  }

  if (field.length >= 6) {
    length = true;
  }

  return { lowercase, capital, number, length };
};

export const PasswordValidationText = ({ passwordForm }) => {
  const { lowercase, capital, number, length } = passwordValidation(
    passwordForm
  );

  const getColor = (bool) => {
    return bool ? COLORS.darkgreen : COLORS.testred;
  };
  return (
    <View style={{ marginVertical: 5 }}>
      <View style={styles.validation}>
        {icon(capital)}
        <Text style={{ color: getColor(capital) }}>
          Minimaal een hoofdletter
        </Text>
      </View>
      <View style={styles.validation}>
        {icon(lowercase)}
        <Text style={{ color: getColor(lowercase) }}>
          Minimaal een kleine letter
        </Text>
      </View>

      <View style={styles.validation}>
        {icon(number)}
        <Text style={{ color: getColor(number) }}>Minimaal een cijfer</Text>
      </View>
      <View style={styles.validation}>
        {icon(length)}
        <Text style={{ color: getColor(length) }}>Minimaal 6 karakters</Text>
      </View>
    </View>
  );
};

const icon = (bool) => {
  if (bool) {
    return <Ionicons name="checkmark-sharp" size={24} color="green" />;
  } else {
    return <Entypo name="cross" size={16} color="red" />;
  }
};
