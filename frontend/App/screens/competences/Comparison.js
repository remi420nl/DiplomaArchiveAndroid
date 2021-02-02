import React, {
  useEffect,
  useState,
  createRef,
  useRef,
  useCallback,
} from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight,
  Pressable,
  FlatList,
  Dimensions,
} from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { GetCompetences, RegisterGroups } from "../../../api/Api";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/Button";

export default ({ navigation, route }) => {
  const [studentCompetences, setStudentComp] = useState(null);
  const [courseCompetences, setCourseComp] = useState(null);

  const refs = useRef([]);

  const { student, course } = route.params;

  const { token } = useAuth();

  useEffect(() => {
    GetCompetences(token, student.id, course.id)
      .then(({ data }) => {
        setStudentComp(data.student);

        setCourseComp(data.course);
      })
      .catch((e) => console.log(e));
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginVertical: 20,
    },
    scrollView: {
      flex: 1,
      justifyContent: "space-around",
    },
    itemText: {
      fontSize: 14,
      color: "#fff",
      fontWeight: "bold",
      letterSpacing: 1.4,
      flexShrink: 1,
    },
    item: {
      padding: 5,
      opacity: 0.7,
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      margin: 2,
      height: 100,
      minWidth: 120,
    },
    header: {
      alignItems: "center",
      margin: 20,
      flexDirection: "row",
    },
    headerText: {
      fontFamily: "Roboto-Bold",
      fontSize: 24,
      letterSpacing: -1,
      textAlign: "center",
    },
    button: {},
    topBar: {
      marginRight: 20,
      flexDirection: "row",
      justifyContent: "flex-end",
    },
  });

  const RenderItem = ({ item, index, seperators }) => (
    <View
      style={{ ...styles.item, backgroundColor: item.match ? "green" : "blue" }}
    >
      <Text style={styles.itemText}>{item.name}</Text>
    </View>
  );

  const CountNoMatches = () => {
    let count = 0;

    courseCompetences.forEach((c) => (!c.match ? count++ : null));

    return count;
  };

  const HorizontalScroll = () => {
    const count = CountNoMatches();

    return (
      <View style={styles.scrollView}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.button}>
            <Button
              text="Diploma's inzien"
              onPress={() => navigation.push("Diplomas", { student: student })}
              theme="primary"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            Competenties van: {student.name}
          </Text>
        </View>
        <FlatList
          horizontal={true}
          data={studentCompetences}
          renderItem={RenderItem}
          keyExtractor={(i) => i.name}
        />
        <View style={styles.header}>
          <Text style={styles.headerText}>{course.name}</Text>
        </View>
        <FlatList
          horizontal={true}
          data={courseCompetences}
          renderItem={RenderItem}
          keyExtractor={(i) => i.name}
        />
        <Text style={styles.headerText}>
          {count > 0
            ? `Nog ${count} competenties nodig`
            : "Voldoet aan alle eisen"}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {studentCompetences && courseCompetences && HorizontalScroll()}
    </View>
  );
};
