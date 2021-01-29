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

export default ({ route }) => {
  const [course, setCourse] = useState();
  const [loading, setLoading] = useState(true);
  const [exemptions, setExemptions] = useState(null);

  const { token, user } = useAuth();
  const refs = useRef([]);

  useEffect(() => {
    if (user.type === "employee") {
      const id = route.params.id;
      GetAllExemptionsForCourse(id, token)
        .then(({ data }) => setExemptions(data))
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
        <Text style={styles.header}>Vrijstellingen</Text>
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

  useEffect(() => {
    const id = route.params.id;

    // user has to be logged in for this
    GetCourseById(id, token)
      .then(({ data }) => {
        setCourse(data);
      })
      .then(() => setLoading(false))
      .catch((e) => console.log(e));
  }, []);

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
    header: {
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
    const isEmployee = user.type === "employee";

    return (
      <View style={styles.view}>
        <View style={styles.container}>
          <View style={styles.subContainer}>
            <TouchableHighlight
              onPress={() =>
                isEmployee ? alert("Omschrijving Bijwerken") : null
              }
            >
              <Text style={styles.header}>{course.name}</Text>
            </TouchableHighlight>
            <Text>{course.context}</Text>
          </View>
          <View style={styles.subContainer}>
            <TouchableHighlight
              onPress={() =>
                isEmployee ? alert("Competenties Bijwerken") : null
              }
            >
              <Text style={styles.header}>Competenties</Text>
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
          {user && course && isEmployee && ExemptionsView()}
        </View>
      </View>
    );
  }

  return <Text>Loading..</Text>;
};
