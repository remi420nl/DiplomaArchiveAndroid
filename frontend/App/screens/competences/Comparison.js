import React, {
  useEffect,
  useState,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from "react-native";
import {  TouchableOpacity } from "react-native-gesture-handler";
import { GetCompetences, RegisterGroups } from "../../../api/Api";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/Button";
import { COLORS } from "../../assets/constants";
import { useHeaderHeight } from "@react-navigation/stack";

//Screen to let employee see the course and student competences and which are of them are still requiered or if requierments are met 

export default ({ navigation, route }) => {
  const [studentCompetences, setStudentComp] = useState(null);
  const [courseCompetences, setCourseComp] = useState(null);

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

  const headerHeight = useHeaderHeight();

  const styles = StyleSheet.create({
    container: {
      paddingTop: headerHeight,
      flex: 1,
      marginVertical: 20,
      padding: 3,
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
    colorExplanation: {
      flexDirection: "row",
      height: 40,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
  });

  const RenderItem = ({ item, index }) => (
    <View
      style={{
        ...styles.item,
        backgroundColor: item.match
          ? COLORS["Gematched"]
          : COLORS["Geen Match"],
      }}
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

  const colorExplanation = () => {
    const options = ["Gematched", "Geen Match"];

    return (
      <View style={styles.colorExplanation}>
        {options.map((o) => (
          <View
            style={{
              padding: 5,
              alignItems: "center",
              backgroundColor: COLORS[o],
              flex: 1,
            }}
          >
            <Text style={styles.itemText}>{o}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {colorExplanation()}
      {studentCompetences && courseCompetences && HorizontalScroll()}
    </View>
  );
};
