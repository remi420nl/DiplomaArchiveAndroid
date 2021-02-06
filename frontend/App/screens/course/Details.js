import React, { useEffect, useState, createRef, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Pressable,
} from "react-native";
import Menu, { MenuItem, MenuDivider } from "react-native-material-menu";
import Loading from "../loading";
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
      <View>
        <TouchableHighlight
          onPress={() => navigation.push("Exemptions", { id: courseId })}
        >
          <Text style={styles.header}>Vrijstellingen</Text>
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
              style={styles.buttonStudent}
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
    container: {
      marginTop: 40,
      margin: 10,
      flex: 1,
      padding: 10,
      justifyContent: "space-evenly",
    },
    content: {
      flex: 1,
      paddingVertical: 5,
    },
    competences: {
      flex: 2,
      paddingVertical: 5,
    },
    header: {
      fontSize: 22,
      fontWeight: "bold",
      textTransform: "uppercase",
    },
    text: {
      fontSize: 18,
      height: 25,
    },
    lowerContainer: {
      flex: 2,
      paddingVertical: 5,
    },
    button: {
      marginVertical: 15,
    },
    competenseList: { marginTop: 10 },
    competence: { fontSize: 20 },
    exemptions: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    studentButton: {
      backgroundColor: COLORS.blue,
      borderRadius: 10,
      margin: 5,
      alignSelf: "flex-start",
    },
    studentName: {
      padding: 6,
      color: "#fff",
      fontWeight: "bold",
    },

    buttonStudent: {
      backgroundColor: COLORS.white,
      borderRadius: 10,
      padding: 10,
      margin: 5,
    },
    buttonText: {
      fontWeight: "bold",
    },
  });

  if (!loading) {
    const isEmployee = user && user.type === "employee";
    const isStudent = user && user.type === "student";

    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.content}>
            <TouchableHighlight
              onPress={() =>
                isEmployee ? alert("Omschrijving Bijwerken") : null
              }
            >
              <Text style={styles.header}>{course.name}</Text>
            </TouchableHighlight>
            <Text>{course.context}</Text>
          </View>
        </ScrollView>

        <View style={styles.competences}>
          <TouchableHighlight
            onPress={() =>
              isEmployee
                ? navigation.push("ManageCourse", {
                    courseId: courseId,
                    courseName: course.name,
                  })
                : null
            }
          >
            <Text style={styles.header}>Competenties</Text>
          </TouchableHighlight>
          <ScrollView style={{ padding: 10 }}>
            {course.competences.map((c, i) => (
              <Text style={styles.text}>{c.name}</Text>
            ))}
          </ScrollView>
        </View>
        <View style={styles.lowerContainer}>
          {course && isEmployee && ExemptionsView()}
          {course && isStudent && StudentView()}
        </View>
      </View>
    );
  } else {
    return <Loading />;
  }
};
