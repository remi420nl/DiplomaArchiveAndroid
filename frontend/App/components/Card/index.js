import React, {
  useEffect,
  useState,
  createRef,
  useRef,
  useCallback,
} from "react";
import { View, StyleSheet } from "react-native";
import { COLORS } from "../../assets/constants";
import PropTypes from "prop-types";

const styles = StyleSheet.create({
  card: {
    borderRadius: 5,
    elevation: 3,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.4,
    shadowRadius: 2,
    margin: 5,
  },
  content: {
    marginHorizontal: 25,
    marginVertical: 15,
  },
});

const Card = ({ children, customStyle }) => {
  return (
    <View style={[{ ...customStyle }, styles.card]}>
      <View style={styles.content}>{children}</View>
    </View>
  );
};

Card.propTypes = {};

Card.defaultProps = {
  customStyle: { backgroundColor: COLORS.white },
};

export default Card;
