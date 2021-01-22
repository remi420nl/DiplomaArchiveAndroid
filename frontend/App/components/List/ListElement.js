import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  TouchableOpacity,
} from "react-native";
import { GetAllDiplomas, GetAllDiplomasByUser } from "../../../api/Api";

import { ScrollView } from "react-native-gesture-handler";
import { useAuth } from "../../context/AuthContext";
import { COLORS } from "../../assets/constants";

export default ({
  i,
  name,
  competences,
  bg,
  color,
  onPress,
  animateNext,
  setCurrentIndex,
  selected,
}) => {
  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
    },

    header: {
      backgroundColor: COLORS.background2,
      alignItems: "center",
    },
    headerText: {
      marginTop: 15,
      marginHorizontal: 10,
      padding: 10,
    },
    cardContainer: {
      flexGrow: 1,
    },
    title: {
      textAlign: "center",
      fontSize: 38,
      letterSpacing: -2,
      fontWeight: "bold",
      textTransform: "uppercase",
    },
    card: {
      flexGrow: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    competenceList: { marginTop: 10 },
    competence: { fontSize: 20 },
    link: {
      fontSize: 18,
      fontWeight: "bold",
      color: "darkgray",
    },
  });

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      key={i}
      activeOpacity={0.8}
      onPress={() => {
        setCurrentIndex();
        animateNext();
      }}
    >
      <View style={[styles.card, { backgroundColor: bg }]}>
        <Text style={[styles.title, { color }]}>{name}</Text>
        <View style={styles.competenceList}>
          {selected &&
            competences &&
            competences.map(({ name }, i) => (
              <Text key={i} style={[styles.competence, { color }]}>
                {name}
              </Text>
            ))}
          {selected && (
            <TouchableOpacity onPress={() => onPress()}>
              <Text style={styles.link}>Openen</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
