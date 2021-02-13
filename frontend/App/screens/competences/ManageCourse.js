import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  TouchableHighlight,
  Modal,
  CheckBox,
} from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { Button } from "../../components/Button";
import {
  GetCompetences,
  GetAllCompetences,
  AddCompetencesForCourse,
  DeleteCompetencesForCourse,
} from "../../../api/Api";
import Box from "../../components/List/Box";
import { useAuth } from "../../context/AuthContext";
import { COLORS } from "../../assets/constants";

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
    setError("");
    setLoading(true);
    GetCompetences(token, null, courseId, null)
      .then(({ data }) => {
        setCompetences(data.course);
        setLoading(false);
      })
      .catch(() => {
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
      marginBottom: 200,
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
    button: {
      margin: 10,
      alignItems: "center",
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
      <View style={styles.button}>
        <Button
          text="Toevoegen"
          theme="primary"
          onPress={() => {
            setModalVisible(true);
          }}
          extraStyles={{ backgroundColor: COLORS.blue }}
        />
      </View>
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
