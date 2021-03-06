import React from "react";
import { Text, StyleSheet, Pressable } from "react-native";
import PropTypes from "prop-types";
import { COLORS} from "../../assets/constants";

// Button component with different themes and styling options

export const Button = ({
  text,
  onPress,
  disabled,
  theme,
  type,
  extraStyles,
}) => {
  const styles = StyleSheet.create({
    text: {
      fontSize: 18,
      color: COLORS.white,
      fontWeight: "bold",
      textAlign: "center",
    },
    container: {
      marginVertical: 5,
      justifyContent: "center",
      alignItems: "center",
      minWidth: 140,
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

  const getStyles = (theme, type) => {
    const containerStyles = [styles.container];
    const textStyles = [styles.text];

    switch (theme) {
      case "primary":
        containerStyles.push({ backgroundColor: COLORS.mediumseagrean });
        break;
      case "secondary":
        containerStyles.push({ backgroundColor: COLORS.darkgray });
        break;
      case "cancel":
        containerStyles.push({ backgroundColor: COLORS.red });
        break;
      case "submit":
        containerStyles.push({ backgroundColor: COLORS.darkgreen });
        break;
      case "contact":
        containerStyles.push({
          backgroundColor: COLORS.lightBlue,
          padding: 10,
          borderRadius: 15,
        });
        break;
    }
    console.log(extraStyles);
    containerStyles.push(extraStyles);

    if (type === "modal") {
      containerStyles.push({
        padding: 10,
        borderRadius: 10,
      });
      textStyles.push({
        fontSize: 14,
      });
    }

    return { containerStyles, textStyles };
  };

  const { containerStyles, textStyles } = getStyles(theme, type);

  return (
    <Pressable style={containerStyles} onPress={onPress} disabled={disabled}>
      <Text style={textStyles}>{text}</Text>
    </Pressable>
  );
};

Button.propTypes = {
  text: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  onPress: PropTypes.func,
  theme: PropTypes.oneOf([
    "primary",
    "secondary",
    "contact",
    "submit",
    "cancel",
  ]),
  type: PropTypes.string,
  extraStyles: PropTypes.object,
};

//Default onpress handler

Button.defaultProps = {
  text: "Button",
  onPress: () => console.warn("todo"),
};
