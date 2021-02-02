import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import PropTypes from "prop-types";
import { COLORS, FONTS, SIZES } from "../../assets/constants";

export const Button = ({ text, style, onPress, disabled, theme }) => {
  const styles = StyleSheet.create({
    text: {
      fontSize: 18,
      color: "#fff",
      alignSelf: "center",
      fontWeight: "900",
    },
    container: {
      backgroundColor: theme == "primary" ? COLORS.mediumseagrean : COLORS.gray2,
      marginVertical: 5,
     
      maxWidth: 180,
      maxHeight: 60,
      borderRadius: 2,
      padding: 5
    },
  });

  return (
    <Pressable style={styles.container} onPress={onPress} disabled={disabled}>
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
};

Button.propTypes = {
  text: PropTypes.string.isRequired,
  style: PropTypes.object,
  disabled: PropTypes.bool,
  onPress: PropTypes.func,
  theme: PropTypes.oneOf(["primary", "secondary"]),
};

Button.defaultProps = {
  text: "Button",
  onPress: () => console.warn("todo"),
};
