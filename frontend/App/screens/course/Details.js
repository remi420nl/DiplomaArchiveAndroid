import React, { useEffect, useState, createRef, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  TouchableHighlight,
  Pressable,
} from "react-native";
import Menu, { MenuItem, MenuDivider } from "react-native-material-menu";

import {
  GetAllExemptionsForCourse,
  GetCourseById,
  RegisterGroups,
} from "../../../api/Api";
import { COLORS } from "../../assets/constants";
import { useAuth } from "../../context/AuthContext";

export default ({ navigation, route }) => {
  const [course, setCourse] = useState();
  const [loading, setLoading] = useState(true);
  const [exemptions, setExemptions] = useState(null);

  const { token, user } = useAuth();
  const refs = useRef([]);
  const id = route.params.id;

  useEffect(() => {
    // Added eventlistener to refresh when the user navigates back to this screen so the course gets updated

    const unsubscribe = navigation.addListener("focus", () => {
      GetCourseById(id, token)
        .then(({ data }) => {
          setCourse(data);
        })
        .then(() => setLoading(false))
        .catch((e) => console.log(e));
    });

    // user has to be logged in for this

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (user.type === "employee") {
      const id = route.params.id;
      //Set all the exemptions for this cours that have status Goedgekeurd / Approved
      GetAllExemptionsForCourse(id, token)
        .then(({ data }) => {
          console.log(data);
          setExemptions(data.filter((e) => e.status === "Goedgekeurd"));
        })
        .catch((e) => console.log(e));
    }
  }, [course]);

  const ExemptionsView = () => {
    const exemptionsLength = exemptions && exemptions.length;

    if (exemptionsLength !== refs.length) {
      refs.current = Array(exemptionsLength)
        .fill()
        .map((e, i) => refs.current[i] || createRef());
    }

    return (
      <View style={styles.subContainer}>
        <TouchableHighlight
          style={styles.header}
          onPress={() => navigation.push("Exemptions", { id: id })}
        >
          <Text style={styles.headerText}>Vrijstellingen</Text>
        </TouchableHighlight>
        <View style={styles.exemptions}>
          {exemptions &&
            exemptions.map((e, i) => (
              <Menu
                ref={(r) => (refs.current[i] = r)}
                button={
                  <Pressable
                    onLongPress={() => {
                      refs.current[i].show();
                    }}
                    style={styles.studentButton}
                  >
                    <Text style={styles.studentName} key={i}>
                      {e.student.name}
                    </Text>
                  </Pressable>
                }
              >
                <MenuItem onPress={() => alert("todo")}>
                  Student Openen
                </MenuItem>

                <MenuDivider />
                <MenuItem onPress={() => refs.current[i].hide()}>
                  Terug
                </MenuItem>
              </Menu>
            ))}
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    view: {
      flex: 1,
      justifyContent: "space-around",
      marginLeft: 20,
    },
    container: {
      flexGrow: 1,
      height: "70%",
      justifyContent: "space-around",
    },
    subContainer: {
      flexGrow: 1,
      maxHeight: "20%",
      marginRight: 20,
    },
    header: {},
    headerText: {
      fontWeight: "bold",
    },
    exemptions: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    studentButton: {
      backgroundColor: COLORS.blue,
      borderRadius: 10,

      alignSelf: "flex-start",
    },
    studentName: {
      padding: 6,

      color: "#fff",
      fontWeight: "bold",
    },
  });

  if (!loading) {
    const isEmployee = user && user.type === "employee";

    return (
      <View style={styles.view}>
        <View style={styles.container}>
          <View style={styles.subContainer}>
            <TouchableHighlight
              style={styles.headerText}
              onPress={() =>
                isEmployee ? alert("Omschrijving Bijwerken") : null
              }
            >
              <Text style={styles.headerText}>{course.name}</Text>
            </TouchableHighlight>
            <Text>{course.context}</Text>
          </View>
          <View style={styles.subContainer}>
            <TouchableHighlight
              style={styles.header}
              onPress={() =>
                isEmployee
                  ? navigation.push("EditCompetences", { courseId: id })
                  : null
              }
            >
              <Text style={styles.headerText}>Competenties</Text>
            </TouchableHighlight>
            <View>
              {course.competences.map((c, i) => (
                <TouchableHighlight
                  activeOpacity={0.4}
                  onPress={() => alert(c.id)}
                >
                  <Text key={i}>{c.name}</Text>
                </TouchableHighlight>
              ))}
            </View>
          </View>
          {course && isEmployee && ExemptionsView()}
        </View>
      </View>
    );
  }

  return <Text>Loading..</Text>;
};
