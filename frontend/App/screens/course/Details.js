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
  CreateNewExemption,
  GetAllExemptions,
  GetCourseById,
} from "../../../api/Api";
import { COLORS } from "../../assets/constants";
import { useAuth } from "../../context/AuthContext";

export default ({ navigation, route }) => {
  const [course, setCourse] = useState();
  const [loading, setLoading] = useState(true);
  const [exemptions, setExemptions] = useState(null);
  const [studentExemptions, setStudentExemptions] = useState();
  const [error, setError] = useState();

  const { token, user } = useAuth();
  const refs = useRef([]);
  const courseId = route.params.id;

  useEffect(() => {
    // Added eventlistener to refresh when the user navigates back to this screen so the course gets updated

    const unsubscribe = navigation.addListener("focus", () => {
      setError(null);
      GetCourseById(courseId, token)
        .then(({ data }) => {
          setCourse(data);
        })
        .then(() => setLoading(false))
        .then(() => fetchExemptions())
        .catch((e) => console.log(e));
    });

    // user has to be logged in for this

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {}, [course]);

  const fetchExemptions = () => {
    if (user.type === "employee") {
      const courseId = route.params.id;
      //Set all the exemptions for this cours that have status Goedgekeurd / Approved
      GetAllExemptions(token, courseId)
        .then(({ data }) => {
          setExemptions(data.filter((e) => e.status === "Goedgekeurd"));
        })
        .catch((e) => console.log(e));
    } else if (user.type === "student") {
      GetAllExemptions(token)
        .then(({ data }) => {
          setStudentExemptions(data);

          setLoading(false);
        })
        .catch((e) => console.log(e));
    }
  };

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
          onPress={() => navigation.push("Exemptions", { id: courseId })}
        >
          <Text style={styles.headerText}>Vrijstellingen</Text>
        </TouchableHighlight>
        <View style={styles.exemptions}>
          {exemptions &&
            exemptions.map((e, i) => (
              <Menu
                key={i}
                ref={(r) => (refs.current[i] = r)}
                button={
                  <Pressable
                    onLongPress={() => {
                      refs.current[i].show();
                    }}
                    style={styles.studentButton}
                  >
                    <Text style={styles.studentName}>{e.student.name}</Text>
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

  const requestExemption = () => {
    setLoading(true);
    CreateNewExemption(token, courseId).then(() => fetchExemptions());
  };

  const StudentView = () => {
    const requests =
      studentExemptions &&
      studentExemptions.filter((e) => e.course.id === courseId);
    if (requests) {
      return (
        <View>
          {requests.length < 1 ? (
            <TouchableHighlight
              style={styles.button}
              onPress={() => {
                requestExemption();
              }}
            >
              <Text style={styles.buttonText}>Vrijstelling aanvragen</Text>
            </TouchableHighlight>
          ) : (
            <Text>Status aanvraag: {requests[0].status} </Text>
          )}
        </View>
      );
    } else {
      return <View></View>;
    }
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
    button: {
      backgroundColor: COLORS.white,
      borderRadius: 10,
      padding: 10,
    },
    buttonText: {
      fontWeight: "bold",
    },
  });

  if (!loading) {
    const isEmployee = user && user.type === "employee";
    const isStudent = user && user.type === "student";

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
                  ? navigation.push("EditCompetences", {
                      courseId: courseId,
                      courseName: course.name,
                    })
                  : null
              }
            >
              <Text style={styles.headerText}>Competenties</Text>
            </TouchableHighlight>
            <View>
              {course.competences.map((c, i) => (
                <TouchableHighlight
                  key={i}
                  activeOpacity={0.4}
                  onPress={() => alert(c.id)}
                >
                  <Text>{c.name}</Text>
                </TouchableHighlight>
              ))}
            </View>
          </View>
          <View style={styles.subContainer}>
            {course && isEmployee && ExemptionsView()}
            {course && isStudent && StudentView()}
          </View>
        </View>
      </View>
    );
  }

  return <Text>Loading..</Text>;
};
