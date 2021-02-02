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
  Alert,
  StyleSheet,
  Button,
  TouchableHighlight,
  Modal,
  CheckBox,
} from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";

import {
  GetCompetences,
  GetAllCompetences,
  AddCompetencesForCourse,
  DeleteCompetencesForCourse,
} from "../../../api/Api";
import Box from "../../components/Flatlist/Box";
import { useAuth } from "../../context/AuthContext";

// for editing competenece and keywords for a specific course

// possibly move this page to the course section

export default ({ navitation, route }) => {
  const [competences, setCompetences] = useState([]);
  const [allCompetences, setAllCompetences] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [toBeAdded, setToBeAdded] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  const { token } = useAuth();
  const { courseId, courseName } = route.params;

  useEffect(() => {
    //Getting competences for course
    console.log("Useffect");
    setError("");
    setLoading(true);
    GetCompetences(token, null, courseId, null)
      .then(({ data }) => {
        setCompetences(data.course);
        setLoading(false);
      })
      .catch((e) => {
        setError("Er is iets fout gegaan");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    GetAllCompetences(token)
      .then(({ data }) =>
        setAllCompetences(
          data.filter(
            (c) =>
              competences.map((course_c) => course_c.id).indexOf(c.id) === -1
          )
        )
      )
      .catch((e) => console.log(e));
  }, [competences]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "flex-start",

      marginHorizontal: 10,
      marginBottom: 50,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      letterSpacing: 2,
      textAlign: "center",
    },
    description: {
      fontSize: 16,
      textAlign: "center",
      paddingVertical: 15,
    },
    addButton: {
      backgroundColor: "green",
      margin: 20,
      paddingHorizontal: 15,
      paddingVertical: 5,
      alignSelf: "center",
      borderColor: "blue",
      borderWidth: 1,
      borderRadius: 5,
    },
    buttonText: {
      fontSize: 22,
      fontWeight: "bold",
      color: "#fff",
      textAlign: "center",
    },
    checboxList: {
      flexDirection: "row",
      height: 25,
    },

    // for the modal:

    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 10,
    },
    modalView: {
      height: "70%",
      margin: 10,
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderRadius: 20,
      padding: 15,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    modalButton: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
      marginHorizontal: 15,
    },

    modalText: {
      marginBottom: 15,
      textAlign: "center",
    },
    buttons: {
      flexDirection: "row",
      marginTop: 20,
    },
  });

  const renderCheckboxList = ({ item }) => {
    return (
      <View style={styles.checboxList}>
        <CheckBox
          value={toBeAdded.includes(item.id)}
          onValueChange={() =>
            setToBeAdded((state) =>
              state.includes(item.id)
                ? state.filter((i) => i !== item.id)
                : [...state, item.id]
            )
          }
        />
        <Text>{item.name}</Text>
      </View>
    );
  };

  const getAllCompetences = () => {
    return (
      <View style={{ height: "80%" }}>
        <FlatList
          data={allCompetences}
          renderItem={renderCheckboxList}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    );
  };

  const addCompetence = () => {
    const context = { competences: toBeAdded };

    setLoading(true);
    AddCompetencesForCourse(token, courseId, context)
      .then(({ data }) => {
        setCompetences(data.competences);
        setLoading(false);
        setToBeAdded([]);
      })
      .catch((r) => console.log(r));
  };

  const deleteCompetence = (id) => {
    setLoading(true);
    DeleteCompetencesForCourse(token, id, courseId)
      .then(({ data }) => {
        setLoading(false);
        setCompetences(data.competences);
      })
      .catch((e) => console.log(e));
  };

  const deleteDialog = (item) =>
    Alert.alert(
      item.name,
      `Wilt u deze competentie verwijderen voor het vak ${courseName}`,
      [
        {
          text: "Annuleer",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => deleteCompetence(item.id) },
      ],
      { cancelable: false }
    );

  if (loading || error) {
    return (
      <View style={styles.container}>
        <Text>Loading..</Text>
        <Text>{error}</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Alle competenties</Text>
            {modalVisible && getAllCompetences()}
            <View style={styles.buttons}>
              <TouchableHighlight
                style={{ ...styles.modalButton, backgroundColor: "#dd3a08" }}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={{ ...styles.buttonText, fontSize: 16 }}>
                  Terug
                </Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={{ ...styles.modalButton, backgroundColor: "#2196F3" }}
                onPress={() => addCompetence()}
              >
                <Text style={{ ...styles.buttonText, fontSize: 16 }}>
                  Opslaan
                </Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
      <Text style={styles.title}>{courseName}</Text>
      <TouchableHighlight
        style={styles.addButton}
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <Text style={styles.buttonText}>Toevoegen</Text>
      </TouchableHighlight>
      <Text style={styles.description}>Momenteel toegewezen:</Text>
      {competences && (
        <Box
          data={competences}
          horizontal={false}
          onPress={(c) => deleteDialog(c)}
          colums={1}
        />
      )}
    </View>
  );
};
