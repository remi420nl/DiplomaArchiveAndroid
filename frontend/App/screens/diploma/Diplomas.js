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

export default ({ route }) => {
  const [diplomas, setDiplomas] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState();

  const firstRender = useRef(true);
  const colorsAdded = useRef(false);
  const ref = useRef();

  const { token, user } = route.params;

  const transition = (
    <Transition.Together>
      <Transition.In type="fade" durationMs={200} />
      <Transition.Change />
      <Transition.Out type="fade" durationMs={200} />
    </Transition.Together>
  );

  useEffect(() => {
    console.log("useffect Diplomas");
    if (!colorsAdded.current) {
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
      justifyContent: "center",
    },
    cardContainer: {
      flexGrow: 1,
    },
    title: {
      textAlign: "center",
      fontSize: 38,
      letterSpacing: -2,
      fontWeight: "bold",
    },
    card: {
      flexGrow: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    competenseList: { marginTop: 10 },
    competence: { fontSize: 20 },
  });

  return (
    <ScrollView>
      <Transitioning.View
        style={styles.container}
        ref={ref}
        transition={transition}
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
              }}
            >
              <View style={[styles.card, { backgroundColor: bg }]}>
                <Text style={[styles.title, { color }]}>{name}</Text>
                <View style={styles.competenseList}>
                  {i === currentIndex &&
                    competences.map(({ name }) => (
                      <Text style={[styles.competence, { color }]}>{name}</Text>
                    )) && (
                      <TouchableOpacity onPress={() => alert(id)}>
                        <Text>Openen</Text>
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
