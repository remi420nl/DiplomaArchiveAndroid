import React, { useEffect, useState, useRef, useReducer } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  TouchableOpacity,
  ActivityIndicatorComponent,
} from "react-native";
import { Transition, Transitioning } from "react-native-reanimated";
import { GetAllDiplomas, GetAllDiplomasByUser } from "../../../api/Api";
import ListElement from "../../components/List/ListElement";
import StudentPicker from "../../components/Dropdown/StudentPicker";
import { ScrollView } from "react-native-gesture-handler";
import { useAuth } from "../../context/AuthContext";
import { COLORS } from "../../assets/constants";
import { Header } from "react-native/Libraries/NewAppScreen";

export default ({ navigation, route }) => {
  const [diplomas, setDiplomas] = useState();
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState();

  const FETCH_SUCCESS = "FETCH_SUCCESSS";
  const GET_ALL = "GET_ALL";
  const SET_STUDENT = "SET_STUDENT";
  const FETCH_FAILED = "FETCH_FAILED";
  const COLORS_ADDED = "COLORS_ADDED";

  const SingleStudentView = route.params.student;

  const archiveReducer = (state, action) => {
    switch (action.type) {
      case FETCH_SUCCESS:
        return {
          ...state,
          isLoading: true,
          error: false,
          data: action.payload,
          students: action.payload.map((d) => d.student),
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

  const firstRender = useRef(true);
  const colorsAdded = useRef(false);
  const ref = useRef();

  const { token, user } = useAuth();

  useEffect(() => {
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
    return () => {
      setColors();
    };
  });

  const colors = [
    { bg: "#A8DDE9", color: "#3F5B98" },
    { bg: "#086E4B", color: "#FCBE4A" },
    { bg: "#FECBCA", color: "#FD5963" },
    { bg: "#193B8C", color: "#FECBCD" },
    { bg: "#FDBD50", color: "#F5F5EB" },
  ];

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

  const transition = (
    <Transition.Together>
      <Transition.In type="fade" durationMs={200} />
      <Transition.Change />
      <Transition.Out type="fade" durationMs={200} />
    </Transition.Together>
  );

  const styles = StyleSheet.create({
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: COLORS.background2,
      alignItems: "center",
    },
    headerText: {
      marginTop: 15,
      marginHorizontal: 10,
      padding: 10,
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
    },
    headerRow: {
      flexDirection: "row",
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
          <Text style={styles.headerText}>
            Diplomas in systeem: {!isLoading && archive.data.length}
          </Text>
          {!isLoading && archive.students && user.type === "employee" && (
            <View>
              <Text tyle={styles.headerText}>
                Studenten: {archive.students.length}
              </Text>

              <View>
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
