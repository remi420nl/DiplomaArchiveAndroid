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
import { Transition, Transitioning } from "react-native-reanimated";
import { ScrollView } from "react-native-gesture-handler";
import { useAuth } from "../../context/AuthContext";
import { COLORS } from "../../assets/constants";

export default ({ navigation, route }) => {
  const [diplomas, setDiplomas] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState();

  const firstRender = useRef(true);
  const colorsAdded = useRef(false);
  const ref = useRef();

  const { token, user } = useAuth();

  const transition = (
    <Transition.Together>
      <Transition.In type="fade" durationMs={200} />
      <Transition.Change />
      <Transition.Out type="fade" durationMs={200} />
    </Transition.Together>
  );

  useEffect(() => {
    console.log("useffect Diplomas");
    if (!colorsAdded.current && user) {
      if (user.type === "employee") {
        GetAllDiplomas(token)
          .then(({ data }) => setDiplomas(data))
          .catch((e) => console.log(e));
      } else if (user.type === "student") {
        GetAllDiplomasByUser(token)
          .then(({ data }) => setDiplomas(data))
          .catch((e) => console.log(e));
      }
    }
    return () => setColors();
  }, [diplomas]);

  const colors = [
    { bg: "#A8DDE9", color: "#3F5B98" },
    { bg: "#086E4B", color: "#FCBE4A" },
    { bg: "#FECBCA", color: "#FD5963" },
    { bg: "#193B8C", color: "#FECBCD" },
    { bg: "#FDBD50", color: "#F5F5EB" },
  ];

  const setColors = () => {
    if (!colorsAdded.current && diplomas) {
      colorsAdded.current = true;
      let arr = [];
      let length = colors.length - 1;
      let count = 0;
      diplomas.forEach((diploma) => {
        arr.push({ ...diploma, ...colors[count] });
        count === length ? (count = 0) : count++;
      });
      setDiplomas(arr);
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    view: {
      flex: 1,
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
      flex: 1,
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
    competenseList: { marginTop: 10 },
    competence: { fontSize: 20 },
    link: {
      fontSize: 18,
      fontWeight: "bold",
      color: "darkgray",
    },
  });

  return (
    <ScrollView contentContainerStyle={styles.view}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Diplomas opgeslagen: {!loading && diplomas.length}
        </Text>
      </View>
      <Transitioning.View
        ref={ref}
        transition={transition}
        style={styles.container}
      >
        {error && <Text>{error}</Text>}
        {!loading &&
          diplomas.map(({ id, name, competences, color, bg }, i) => (
            <TouchableOpacity
              style={styles.cardContainer}
              key={i}
              activeOpacity={0.8}
              onPress={() => {
                setCurrentIndex(currentIndex !== i ? i : null);
                ref.current.animateNextTransition();
                console.log("clicked");
              }}
            >
              <View style={[styles.card, { backgroundColor: bg }]}>
                <Text style={[styles.title, { color }]}>{name}</Text>
                <View style={styles.competenseList}>
                  {i === currentIndex &&
                    competences &&
                    competences.map(({ name }) => (
                      <Text style={[styles.competence, { color }]}>{name}</Text>
                    ))}
                  {i == currentIndex && (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("Diploma", {
                          token: token,
                          id: id,
                        })
                      }
                    >
                      <Text style={styles.link}>Openen</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
      </Transitioning.View>
    </ScrollView>
  );
};
