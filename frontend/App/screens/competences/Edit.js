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

import { GetCompetences, GetAllCompetences } from "../../../api/Api";
import Box from "../../components/Flatlist/Box";
import { useAuth } from "../../context/AuthContext";

// for editing competenece and keywords for a specific course

export default ({ navitation, route }) => {
  const [competences, setCompetences] = useState(null);
  const [allCompetences, setAllCompetences] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [toBeAdded, setToBeAdded] = useState([]);

  const { token } = useAuth();
  //const { courseId, courseName } = route.params;

  useEffect(() => {
    //Getting competences for course
    GetCompetences(token, null, 1, null)
      .then(({ data }) => {
        setCompetences(data.course);
      })
      .catch((e) => console.log(e));
  }, []);

  useEffect(() => {
    GetAllCompetences(token).then(({ data }) => setAllCompetences(data));
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "flex-start",

      marginHorizontal: 10,
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

  const renderCheckboxList = ({ item, index }) => {
    return (
      <View style={styles.checboxList}>
        <CheckBox
          value={toBeAdded.includes(index)}
          onValueChange={() =>
            setToBeAdded((state) =>
              state.includes(index)
                ? state.filter((i) => i !== index)
                : [...state, index]
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
          keyExtractor={(item) => item.id}
        />
      </View>
    );
  };

  const deleteDialog = (text) =>
    Alert.alert(
      text,
      `Wilt u deze competentie verwijderren voor het vak ${"coursName"}`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ],
      { cancelable: false }
    );

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
                onPress={() => {
                  alert("opslaan..");
                }}
              >
                <Text style={{ ...styles.buttonText, fontSize: 16 }}>
                  Opslaan
                </Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableHighlight
        style={styles.addButton}
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <Text style={styles.buttonText}>Toevoegen</Text>
      </TouchableHighlight>
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
