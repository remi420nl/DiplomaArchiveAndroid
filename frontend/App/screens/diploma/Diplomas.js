import React, { useEffect, useState, useRef, useReducer } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Transition, Transitioning } from "react-native-reanimated";
import { GetAllDiplomas, GetAllDiplomasByUser } from "../../../api/Api";
import ListElement from "../../components/List/ListElement";
import StudentPicker from "../../components/Dropdown/StudentPicker";
import { ScrollView } from "react-native-gesture-handler";
import { useAuth } from "../../context/AuthContext";
import { COLORS } from "../../assets/constants";

//Screen to display either all the diploma's or from the loggid in student

export default ({ navigation, route }) => {
  const [currentIndex, setCurrentIndex] = useState();

  const FETCH_SUCCESS = "FETCH_SUCCESSS";
  const GET_ALL = "GET_ALL";
  const SET_STUDENT = "SET_STUDENT";
  const FETCH_FAILED = "FETCH_FAILED";
  const COLORS_ADDED = "COLORS_ADDED";

  const SingleStudentView = route.params.student;

  //Reduce function for useReducer to manage a more complex state
  const archiveReducer = (state, action) => {
    switch (action.type) {
      case FETCH_SUCCESS:
        return {
          ...state,
          isLoading: true,
          error: false,
          data: action.payload,
          students: action.payload
            .map((d) => d.student)
            .filter(
              (student, index) =>
                action.payload.map((d) => d.student.id).indexOf(student.id) ===
                index
            ),
        };
      case COLORS_ADDED:
        return {
          ...state,
          isLoading: false,
          error: false,
          data: action.payload,
          diplomas: SingleStudentView
            ? action.payload.filter(
                (d) => d.student.id === SingleStudentView.id
              )
            : action.payload,
        };
      case FETCH_FAILED:
        return {
          ...state,
          isLoading: false,
          error: action.payload,
        };
      case GET_ALL:
        return {
          ...state,
          diplomas: state.data,
        };
      case SET_STUDENT:
        return {
          ...state,
          diplomas: state.data.filter(
            (d) => d.student.id === action.payload.student_id
          ),
        };
      default:
        return {
          ...state,
          error: "Er is iets fout gegaan",
        };
    }
  };

  const [archive, dispatch] = useReducer(archiveReducer, {
    isLoading: true,
    error: false,
    data: null,
    diplomas: null,
    students: null,
  });

  const colorsAdded = useRef(false);
  const ref = useRef();
  const { token, user } = useAuth();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getDiplomas();
    });

    return () => unsubscribe();
  }, [navigation]);

  useEffect(() => {
    setColors();
  });

  //Color array for background and text colors
  const colors = [
    { bg: "#A8DDE9", color: "#3F5B98" },
    { bg: "#086E4B", color: "#FCBE4A" },
    { bg: "#FECBCA", color: "#FD5963" },
    { bg: "#193B8C", color: "#FECBCD" },
    { bg: "#FDBD50", color: "#F5F5EB" },
  ];

  //Setting collors which will stop from adjusting the state when the ref is set to true, otherwise it causes an infinite loop
  const setColors = () => {
    if (!colorsAdded.current && archive.data) {
      colorsAdded.current = true;
      let arr = [];
      let length = colors.length - 1;
      let count = 0;
      archive.data.forEach((diploma) => {
        arr.push({ ...diploma, ...colors[count] });
        count === length ? (count = 0) : count++;
      });
      dispatch({ type: COLORS_ADDED, payload: arr });
    }
  };

  //Depending on which kind of user is logged in either all diploma's get fetched or just the ones from the student
  const getDiplomas = () => {
    if (!colorsAdded.current && user) {
      if (user.type === "employee") {
        GetAllDiplomas(token)
          .then(({ data }) => {
            dispatch({ type: FETCH_SUCCESS, payload: data });
          })

          .catch((e) => dispatch({ type: FETCH_FAILED, payload: e }));
      } else if (user.type === "student") {
        GetAllDiplomasByUser(token)
          .then(({ data }) => dispatch({ type: FETCH_SUCCESS, payload: data }))
          .catch((e) => dispatch({ type: FETCH_FAILED, payload: e }));
      }
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
    container: {
      flex: 1,
    },
    header: {
      paddingTop: 25,
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: COLORS.background2,
      alignItems: "center",
    },
    headerText: {
      marginHorizontal: 10,
      padding: 5,
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
    },
    headerRow: {
      marginTop: 5,
      flexDirection: "row",
      marginBottom: 5,
    },
    leftHeader: {
      justifyContent: "center",
      alignItems: "center",
    },
    rightHeader: {
      alignItems: "center",
    },
  });

  const Header = () => {
    if (SingleStudentView) {
      return (
        <View style={styles.header}>
          <Text style={styles.headerText}>{SingleStudentView.name}</Text>
        </View>
      );
    }

    return (
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.leftHeader}>
            <Text style={styles.headerText}>Diplomas in systeem:</Text>
            <Text style={styles.headerText}>
              {!isLoading && archive.data.length.toString()}
            </Text>
          </View>
          {!isLoading && archive.students && user.type === "employee" && (
            <View style={styles.rightHeader}>
              <Text style={styles.headerText}>
                Studenten: {archive.students.length}
              </Text>
              <StudentPicker
                SingleStudentView={SingleStudentView}
                data={archive.students}
                onPress={(student) => {
                  dispatch({
                    type: student.id ? SET_STUDENT : GET_ALL,
                    payload: { student_id: student.id },
                  });
                }}
              />
            </View>
          )}
        </View>
      </View>
    );
  };

  const { isLoading, error } = archive;

  return (
    <ScrollView>
      {Header()}
      {error && <Text>{error}</Text>}
      <Transitioning.View
        ref={ref}
        transition={transition}
        style={styles.container}
      >
        {!isLoading &&
          archive.diplomas.map(({ id, ...rest }, i) => (
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
