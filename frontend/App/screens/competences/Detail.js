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
  TouchableOpacity,
  FlatList,
  Dimensions,
  Modal,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  GetAllCompetences,
  GetCompetences,
  RegisterGroups,
} from "../../../api/Api";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/Button";
import Loading from "../loading";
import Card from "../../components/Card";
import { AntDesign } from "@expo/vector-icons";
import { COLORS } from "../../assets/constants";
import { Colors } from "react-native/Libraries/NewAppScreen";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    margin: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: COLORS.white,
    marginBottom: 10,
    elevation: 3,

    padding: 10,
    borderRadius: 10,
    alignSelf: "center",
  },
  buttonContainer: {
    shadowOffset: { width: 2, height: 6 },
    shadowColor: COLORS.black,
    shadowOpacity: 0.4,
    shadowRadius: 2,
    alignItems: "center",
  },

  /////
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  button: {
    backgroundColor: "#F194FF",
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  buttons: {
    width: 200,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  inputContainer: {},
  inputField: {
    width: 200,
    textAlignVertical: "top",
    justifyContent: "flex-start",
    margin: 15,
    padding: 15,
    borderWidth: 1,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default ({ navigation, route }) => {
  const [newKeyword, setNewKeyword] = useState([]);
  const [compName, setCompName] = useState(route.params.name || "");
  const [input, setInput] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const { user, token } = useAuth();

  const { id, keywords } = route.params;

  useEffect(() => {}, []);

  const addKeywords = () => {};

  return (
    <View style={styles.container}>
      <TextInput value={compName} />
      <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
        <AntDesign
          name="plus"
          size={28}
          color="black"
          style={styles.addButton}
        />
      </TouchableOpacity>
      <FlatList
        data={keywords}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => alert("DDDD")}>
            <Card>
              <Text style={styles.text}>{item.name}</Text>
            </Card>
          </TouchableOpacity>
        )}
      />
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalHeaderText}>Voeg trefwoorden toe</Text>
            <Text style={styles.modalText}>
              gebruik een comma om te onderscheiden
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputField}
                onChangeText={(t) => setInput(t)}
                value={input}
                multiline={true}
                numberOfLines={6}
              />
            </View>
            <View style={styles.buttons}>
              <TouchableHighlight
                style={{ ...styles.button, backgroundColor: COLORS.darkgreen }}
                onPress={() => {
                  addKeywords();
                }}
              >
                <Text style={styles.buttonText}>Opslaan</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={{ ...styles.button, backgroundColor: COLORS.red }}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.buttonText}>Terug</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
