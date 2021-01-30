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
  Modal,
  TouchableHighlight,
  Pressable,
  FlatList,
  Dimensions,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  GetAllExemptions,
  GetAllExemptionsForCourse,
  RegisterGroups,
  UpdateExemptionById,
} from "../../../api/Api";
import { COLORS, FONTS } from "../../assets/constants";
import { useAuth } from "../../context/AuthContext";

const statusarray = [
  { key: "a", text: "Goedkeuren" },
  { key: "r", text: "Afkeuren" },
  { key: "p", text: "In Behandeling" },
];

export default ({ navigation, route }) => {
  const [exemptions, setExemptions] = useState(null);
  const [exemption, setExemption] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [statusChoices] = useState(statusarray);

  const { token } = useAuth();
  const { id } = route.params;

  useEffect(() => {
    if (id) {
      GetAllExemptionsForCourse(id, token).then(({ data }) =>
        setExemptions(data)
      );
    } else {
      GetAllExemptions(token)
        .then(({ data }) => {
          setExemptions(data);
        })
        .catch((e) => console.log("ERROR", e));
    }
  }, [exemption]);

  const selectExemption = (exemption) => {
    setModalVisible(true);
    setExemption(exemption);
  };

  const setStatus = (status) => {
    setExemption((e) => ({ ...e, status: status }));
  };

  const saveExemption = () => {
    UpdateExemptionById(exemption.id, token, exemption).then((r) => {
      setExemption(null);
    });
  };

  const styles = StyleSheet.create({
    container: {
      padding: 5,
      backgroundColor: COLORS.offwhite,
      flex: 1,
    },
    item: {
      padding: 5,
      opacity: 0.7,
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      margin: 2,
      height: Dimensions.get("window").width / 4, // approximate a square
    },
    itemInvisible: {
      backgroundColor: "transparent",
    },
    itemText: {
      fontSize: 14,
      color: "#fff",
      fontWeight: "bold",
      letterSpacing: 1.4,
      flexShrink: 1,
    },
    //Below is for modal
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 10,
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
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
    openButton: {
      backgroundColor: "#F194FF",
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center",
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center",
    },
    modalTitle: {
      fontWeight: "bold",
    },
    modalButtons: {
      alignItems: "center",
      justifyContent: "space-between",
      borderTopColor: "gray",
      borderTopWidth: 1,
      margin: 4,
    },
    segment: {
      flexDirection: "row",
      justifyContent: "center",
    },
    segmentButton: {
      borderRadius: 10,
      padding: 5,
      paddingHorizontal: 10,
      margin: 5,
      elevation: 2,
    },
    segmentButtonText: {
      fontFamily: "Roboto-Bold",
    },
  });

  //TODO
  const formatData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);

    let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;

    while (
      numberOfElementsLastRow !== numColumns &&
      numberOfElementsLastRow !== 0
    ) {
      data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
      numberOfElementsLastRow++;
    }

    return data;
  };

  const renderItem = ({ item, index }) => {
    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }

    return (
      <Pressable
        onLongPress={() => selectExemption(item)}
        onPress={() =>
          navigation.navigate("Competences", {
            student: item.student,
            course: item.course,
          })
        }
        style={[styles.item, { backgroundColor: COLORS[item.status] }]}
      >
        <Text style={[styles.itemText, { color: "darkgray" }]}>
          {item.student.name}
        </Text>
        <Text style={styles.itemText}>{item.course.name}</Text>
      </Pressable>
    );
  };

  const segmentBackground = (key) => {
    return key === exemption.status ? COLORS.lightBlue : COLORS.offwhite;
  };

  const Popup = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>
              Student: {exemption.student.name}
            </Text>
            <Text style={styles.modalTitle}>Vak: {exemption.course.name}</Text>
            <Text>{exemption.status}</Text>

            <View style={styles.modalButtons}>
              <Text style={styles.modalText}>Kies een optie:</Text>
              <View style={styles.segment}>
                {statusChoices.map(({ key, text }) => (
                  <TouchableHighlight
                    key={key}
                    style={[
                      styles.segmentButton,
                      { backgroundColor: segmentBackground(key) },
                      { borderColor: COLORS.lightBlue, borderWidth: 1 },
                    ]}
                    onPress={() => setStatus(key)}
                  >
                    <Text style={styles.segmentButtonText}>{text}</Text>
                  </TouchableHighlight>
                ))}
              </View>
              <TouchableHighlight
                onPress={() => alert("todo..")}
                style={[styles.segmentButton, { backgroundColor: COLORS.red }]}
              >
                <Text style={styles.segmentButtonText}>Verwijder</Text>
              </TouchableHighlight>
            </View>
            <View style={{ ...styles.segment, marginTop: 25 }}>
              <TouchableHighlight
                style={{ ...styles.segmentButton, backgroundColor: "#2196F3" }}
                onPress={() => {
                  setModalVisible(false);
                  setExemption(null);
                }}
              >
                <Text style={styles.textStyle}>Terug</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={{
                  ...styles.segmentButton,
                  backgroundColor: COLORS.darkgreen,
                }}
                onPress={() => {
                  setModalVisible(false);
                  saveExemption();
                }}
              >
                <Text style={styles.textStyle}>Opslaan</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      {exemptions && (
        <FlatList
          data={exemptions}
          numColumns={3}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}
      {exemption && Popup()}
    </View>
  );
};
