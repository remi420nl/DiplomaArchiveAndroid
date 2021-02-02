import React, {
  useEffect,
  useState,
  createRef,
  useRef,
  useCallback,
} from "react";
import { View, StyleSheet } from "react-native";
import { COLORS } from "../../assets/constants";

const styles = StyleSheet.create({
  card: {
    borderRadius: 5,
    elevation: 3,
    backgroundColor: COLORS.white,
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

export default (props) => {
  return (
    <View style={styles.card}>
      <View style={styles.content}>{props.children}</View>
    </View>
  );
};
