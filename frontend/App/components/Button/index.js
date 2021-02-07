import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import PropTypes from "prop-types";
import { COLORS, FONTS, SIZES } from "../../assets/constants";

export const Button = ({ text, style, onPress, disabled, theme }) => {
  const styles = StyleSheet.create({
    text: {
      fontSize: 18,
      color: COLORS.white,
      fontWeight: "bold",
      textAlign: "center",
    },
    container: {
      backgroundColor:
        theme == "primary" ? COLORS.mediumseagrean : COLORS.gray2,
      marginVertical: 5,
      justifyContent: "center",
      alignItems: "center",
      maxWidth: 180,
      maxHeight: 60,
      borderRadius: 2,
      padding: 5,

      elevation: 3,
      shadowOffset: { width: 1, height: 1 },
      shadowColor: COLORS.shadow,
      shadowOpacity: 0.4,
      shadowRadius: 2,
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
