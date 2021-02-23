import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableHighlight,
  Pressable,
  FlatList,
  Dimensions,
} from "react-native";

import { GetAllExemptions, UpdateExemptionById } from "../../../api/Api";
import { COLORS } from "../../assets/constants";
import { Button } from "../../components/Button";
import { useAuth } from "../../context/AuthContext";
import { useHeaderHeight } from "@react-navigation/stack";

const statusarray = [
  { key: "a", text: "Goedkeuren" },
  { key: "r", text: "Afkeuren" },
  { key: "p", text: "In Behandeling" },
];

//Screen to let employee manage all exemption requests that are currently in the system

export default ({ navigation, route }) => {
  const [exemptions, setExemptions] = useState(null);
  const [exemption, setExemption] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [statusChoices] = useState(statusarray);

  const { token } = useAuth();
  const { id } = route.params;

  useEffect(() => {
    if (id) {
      GetAllExemptions(token, id).then(({ data }) => setExemptions(data));
    } else {
      GetAllExemptions(token)
        .then(({ data }) => {
          setExemptions(data);
        })
        .catch((e) => console.log("error", e));
    }
  }, [exemption]);

  const selectExemption = (exemption) => {
    setExemption(exemption);
    setModalVisible(true);
  };

  const setStatus = (status) => {
    setExemption((e) => ({ ...e, status: status }));
  };

  //To save the old status so it can be changed in usestate by the user but keep showing the the oldstatus untill the change is saved
  const oldStatus = React.useMemo(() => exemption && exemption.status, [
    !modalVisible,
  ]);

  const saveExemption = () => {
    UpdateExemptionById(exemption.id, token, exemption).then(() => {
      setExemption(null);
    });
  };

  const headerHeight = useHeaderHeight();

  const styles = StyleSheet.create({
    container: {
      paddingTop: headerHeight,
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
      backgroundColor: COLORS.white,
      opacity: 0.9,
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
      color: COLORS.white,
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
    modalTopButtons: {
      alignItems: "center",
      justifyContent: "space-between",
      borderTopColor: "gray",
      borderTopWidth: 1,
    },
    modalBottomButtons: {
      width: "80%",
      flexDirection: "row",
      justifyContent: "space-evenly",
      marginTop: 20,
    },
    segment: {
      alignSelf: "center",
      flexDirection: "row",
      justifyContent: "center",
    },
    segmentButton: {
      borderRadius: 10,
      padding: 10,
      paddingHorizontal: 8,
      margin: 5,
      elevation: 2,
      flexShrink: 1,
    },
    segmentButtonText: {
      fontWeight: "bold",
    },
    colorExplanation: {
      flexDirection: "row",
      height: 40,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
  });

  //Helper function to create extra empty boxes when the last row is not the same length as the number of colums, otherwise flatlist would spread it out
  const formatData = (data, colums) => {
    data = data.sort((a, b) => a.id - b.id);

    const countFullRows = Math.floor(data.length / colums);

    let lastRowLength = data.length - countFullRows * colums;

    while (lastRowLength !== colums && lastRowLength !== 0) {
      data.push({ id: `emptybox-${lastRowLength}`, empty: true });
      lastRowLength++;
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
        <Text style={[styles.itemText, { color: COLORS.black, fontSize: 18 }]}>
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
            <Text>{oldStatus}</Text>

            <View style={styles.modalTopButtons}>
              <Text style={styles.modalText}>Kies een optie:</Text>
              <View style={styles.segment}>
                {oldStatus !== "Goedgekeurd" &&
                  statusChoices.map(({ key, text }) => (
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
                {oldStatus === "Goedgekeurd" && (
                  <Text>Goedgekeurde vrijstelling niet meer aan te passen</Text>
                )}
              </View>
            </View>
            <View style={styles.modalBottomButtons}>
              <Button
                text="Opslaan"
                type="modal"
                theme="submit"
                onPress={() => {
                  setModalVisible(false);
                  saveExemption();
                }}
              />
              <Button
                text="Terug"
                type="modal"
                theme="cancel"
                onPress={() => {
                  setModalVisible(false);
                  setExemption(null);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const colorExplanation = () => {
    const options = ["Goedgekeurd", "Afgewezen", "In Behandeling"];

    return (
      <View style={styles.colorExplanation}>
        {options.map((o, i) => (
          <View
            key={i}
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
      {exemptions && (
        <FlatList
          data={formatData(exemptions, 3)}
          numColumns={3}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
      {exemption && Popup()}
    </View>
  );
};
