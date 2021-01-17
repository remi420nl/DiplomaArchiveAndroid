import React, { useEffect, useState, useReducer, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { Transition, Transitioning } from "react-native-reanimated";
import { GetAllCourses } from "../../../api/Api";

const increment = "INCREMENT";

const transition = (
  <Transition.Together>
    <Transition.In type="fade" durationMs={200} />
    <Transition.Change />
    <Transition.Out type="fade" durationMs={200} />
  </Transition.Together>
);

const reducer = (state, action) => {
  switch (action.type) {
    case increment:
      return state + action.payload;
    default:
      return state;
  }
};

const colors = [
  { bg: "#A8DDE9", color: "#3F5B98" },
  { bg: "#086E4B", color: "#FCBE4A" },
  { bg: "#FECBCA", color: "#FD5963" },
  { bg: "#193B8C", color: "#FECBCD" },
  { bg: "#FDBD50", color: "#F5F5EB" },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  cardContainer: {
    flexGrow: 1,
  },
  card: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  courseTitle: {
    fontSize: 38,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: -2,
  },
  competencesList: {
    marginTop: 10,
  },
  competence: {
    fontSize: 20,
    lineHeight: 20 * 1.5,
    textAlign: "center",
  },
  error: {
    color: "darkred",
    fontSize: 28,
    fontWeight: "bold",
    marginHorizontal: 25,
  },
});

export default () => {
  const [courses, setCourses] = useState();
  const [currentIndex, setCurrentIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const ref = useRef();
  const firstRender = useRef(true);
  const colorsUpdated = useRef(false);

  useEffect(() => {
    if (!colorsUpdated.current) {
      GetAllCourses()
        .then(({ data }) => {
          setCourses(data);
        })
        .then(() => setColors())
        .catch((e) => {
          console.log(e);
          setError(e.response.data.detail);
        });
    } else {
      setLoading(false);
    }
  }, [courses]);

  const setColors = () => {
    if (firstRender.current || colorsUpdated.current) {
      console.log(firstRender.current, colorsUpdated.current);
      firstRender.current = false;
      return;
    }

    if (!courses) {
      return null;
    }

    let arr = [];

    let count = 0;
    const n = colors.length - 1;
    courses.forEach((course) => {
      arr.push({ ...colors[count], ...course });
      n === count ? (count = 0) : count++;
      console.log(count);
    });
    console.log("count ", count);

    colorsUpdated.current = true;
    setCourses(arr);
  };

  return (
    <ScrollView>
      <Transitioning.View
        ref={ref}
        transition={transition}
        style={styles.container}
      >
        {error && <Text style={styles.error}>{error}</Text>}
        {!loading &&
          courses.map(({ name, competences, color, bg }, i) => (
            <TouchableOpacity
              style={styles.cardContainer}
              key={i}
              onPress={() => {
                setCurrentIndex(currentIndex !== i ? i : null);
                ref.current.animateNextTransition();
              }}
              activeOpacity={0.9}
            >
              <View style={[styles.card, { backgroundColor: bg }]}>
                <Text style={[styles.courseTitle, { color }]}>{name}</Text>
                <View style={styles.competencesList}>
                  {i === currentIndex &&
                    competences.map((com, i) => (
                      <Text key={i} style={[styles.competence, { color }]}>
                        {com.name}
                      </Text>
                    ))}
                </View>
              </View>
            </TouchableOpacity>
          ))}
      </Transitioning.View>
    </ScrollView>
  );
};
