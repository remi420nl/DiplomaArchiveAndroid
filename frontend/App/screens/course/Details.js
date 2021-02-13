import React, { useEffect, useState, createRef, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
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
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { COLORS } from "../../assets/constants";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/Button";

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
      GetAllExemptions(token, courseId)
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
        <Pressable
          style={{ flexDirection: "row" }}
          onLongPress={() => navigation.push("Exemptions", { id: courseId })}
        >
          <AntDesign name="staro" size={24} color="black" />
          <Text style={styles.title}>Vrijstellingen</Text>
        </Pressable>
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

  const statusStyles = (status) => {
    const statusText = [styles.text];
    statusText.push({
      color: COLORS[status],
      textTransform: "uppercase",
      fontSize: 20,
      fontWeight: "bold",
      letterSpacing: 2,
    });

    return { statusText };
  };

  const StudentView = () => {
    if (studentExemptions && studentExemptions.length > 0) {
      const status = studentExemptions[0].status;

      const { statusText } = statusStyles(status);

      return (
        <View style={styles.statusContainer}>
          <Text style={[styles.text, { fontWeight: "bold", color: "white" }]}>
            Status vrijstellings aanvraag:
          </Text>
          <Text style={statusText}>{status}</Text>
        </View>
      );
    } else
      return (
        <Button
          text="Vrijstelling aanvragen"
          theme="primary"
          onPress={() => requestExemption()}
        />
      );
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
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    title: {
      marginLeft: 5,
      fontSize: 22,
      fontWeight: "bold",
      textTransform: "uppercase",
    },
    text: {
      fontSize: 22,
      height: 25,
    },
    lowerContainer: {
      flex: 2,
      paddingVertical: 5,
      alignContent: "center",
      justifyContent: "center",
    },
    button: {
      marginVertical: 15,
    },
    competenseList: {},
    text: { fontSize: 20 },
    exemptions: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 5,
    },
    studentButton: {
      backgroundColor: COLORS.blue,
      borderRadius: 10,
      margin: 5,
      alignSelf: "flex-start",
    },
    studentName: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      color: COLORS.white,
      fontWeight: "bold",
      fontSize: 18,
    },
    buttonStudent: {
      backgroundColor: COLORS.white,
      borderRadius: 10,
      margin: 5,
    },
    buttonText: {
      fontWeight: "bold",
    },
    statusContainer: {
      backgroundColor: COLORS.lightGray4,
      elevation: 3,
      shadowOffset: { width: 1, height: 1 },
      shadowColor: COLORS.shadow,
      shadowOpacity: 0.4,
      shadowRadius: 2,
      padding: 5,
      borderRadius: 15,
      flexDirection: "column",
      alignItems: "center",
    },
  });

  if (!loading) {
    const isEmployee = user && user.type === "employee";
    const isStudent = user && user.type === "student";

    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.content}>
            <View style={styles.header}>
              <Entypo name="book" size={28} color="black" />
              <Pressable
                onLongPress={() =>
                  isEmployee ? alert("Omschrijving Bijwerken") : null
                }
              >
                <Text style={styles.title}>{course.name}</Text>
              </Pressable>
            </View>

            <Text style={styles.text}>{course.description}</Text>
          </View>
        </ScrollView>

        <View style={styles.competences}>
          <Pressable
            style={{ flexDirection: "row" }}
            onLongPress={() =>
              isEmployee
                ? navigation.push("ManageCourse", {
                    courseId: courseId,
                    courseName: course.name,
                  })
                : null
            }
          >
            <Entypo name="rainbow" size={24} color="black" />
            <Text style={styles.title}>Competenties</Text>
          </Pressable>
          <ScrollView style={{ padding: 10 }}>
            {course.competences.map((c, i) => (
              <Text key={i} style={styles.text}>
                {c.name}
              </Text>
            ))}
          </ScrollView>
        </View>
        <View style={styles.lowerContainer}>
          {course && isEmployee && ExemptionsView()}
          {course && isStudent && StudentView()}
          {!user && <Text style={styles.text}>Niet ingelogd</Text>}
        </View>
      </View>
    );
  } else {
    return <Loading />;
  }
};
