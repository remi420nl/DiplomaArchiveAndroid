import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  TouchableOpacity,
} from "react-native";
import { Transition, Transitioning } from "react-native-reanimated";
import { GetAllDiplomas, GetAllDiplomasByUser } from "../../../api/Api";
import ListElement from "../../components/List/ListElement";
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

  useEffect(() => {
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

  const transition = (
    <Transition.Together>
      <Transition.In type="fade" durationMs={200} />
      <Transition.Change />
      <Transition.Out type="fade" durationMs={200} />
    </Transition.Together>
  );

  const styles = StyleSheet.create({
    header: {
      backgroundColor: COLORS.background2,
      alignItems: "center",
    },
    headerText: {
      marginTop: 15,
      marginHorizontal: 10,
      padding: 10,
    },
  });

  return (
    <ScrollView>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Diplomas opgeslagen: {!loading && diplomas.length}
        </Text>
      </View>

      {error && <Text>{error}</Text>}
      <Transitioning.View
        ref={ref}
        transition={transition}
        style={styles.container}
      >
        {!loading &&
          diplomas.map(({ id, ...rest }, i) => (
            <ListElement
              key={i}
              selected={i === currentIndex}
              {...rest}
              onPress={() =>
                navigation.navigate("Diploma", {
                  token: token,
                  id: id,
                })
              }
              setCurrentIndex={() =>
                setCurrentIndex(currentIndex !== i ? i : null)
              }
              animateNext={() => {
                ref.current.animateNextTransition();
              }}
            />
          ))}
      </Transitioning.View>
    </ScrollView>
  );
};
