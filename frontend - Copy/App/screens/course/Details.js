import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  TouchableHighlight,
  Pressable,
} from "react-native";

import { GetAllExemptionsForCourse, GetCourseById } from "../../../api/Api";
import { useAuth } from "../../context/AuthContext";

export default ({ route }) => {
  const [course, setCourse] = useState();
  const [loading, setLoading] = useState(true);
  const [exemptions, setExemptions] = useState(null);
  const { token, user } = useAuth();

  useEffect(() => {
    if (user.type === "employee") {
      const id = route.params.id;
      GetAllExemptionsForCourse(id, token)
        .then(({ data }) => setExemptions(data))
        .catch((e) => console.log(e));
    }
  }, [course]);

  const ExemptionsView = () => (
    <View style={styles.subContainer}>
      <Text style={styles.header}>Vrijstellingen</Text>
      {exemptions &&
        exemptions.map((e, i) => (
          <Pressable>
            {" "}
            <Text key={i}>{e.student.name}</Text>
          </Pressable>
        ))}
    </View>
  );

  useEffect(() => {
    const id = route.params.id;

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
    },
    header: {
      fontWeight: "bold",
    },
  });

  if (!loading)
    return (
      <View style={styles.view}>
        <View style={styles.container}>
          <View style={styles.subContainer}>
            <Text style={styles.header}>{course.name}</Text>
            <Text>{course.context}</Text>
          </View>
          <View style={styles.subContainer}>
            <Text style={styles.header}>Competenties</Text>
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
          {user && course && user.type === "employee" && ExemptionsView()}
        </View>
      </View>
    );

  return <Text>Loading..</Text>;
};
