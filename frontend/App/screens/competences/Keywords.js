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
  Pressable,
  Alert,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  GetKeywordsForCompetence,
  AddKeywordsToCompetence,
  DeleteKeyword,
  UpdateKeywords,
  UpdateCompetenceName,
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
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  button: {
    backgroundColor: COLORS.white,
    marginBottom: 10,
    elevation: 3,
    padding: 10,
    borderRadius: 10,
  },
  title: {},
  competenceName: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ({ navigation, route }) => {
  const [newKeyword, setNewKeyword] = useState([]);
  const [compName, setCompName] = useState(route.params.name || "");
  const [input, setInput] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [keywords, setKeywords] = useState([]);
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const [editTitle, setEditTitle] = useState(false);

  const { competenceId } = route.params;
  const titleRef = useRef();

  const [competences, setCompetences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const ref = useRef();
  const { user, token } = useAuth();

  useEffect(() => {
    fetchKeywords();
  }, []);

  const fetchKeywords = () => {
    GetKeywordsForCompetence(token, competenceId)
      .then(({ data }) => {
        console.log(data);
        setKeywords(data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  const addKeywords = () => {
    if (input === "" || input == null) {
      cancelEdit();
      setModalVisible(false);
      return;
    } else {
      const words = input.split(",");

      const data = {
        competence: competenceId,
        keywords: words,
      };

      AddKeywordsToCompetence(token, data).then(() => {
        setModalVisible(false);
        setEditMode(false);
        fetchKeywords();
      });
    }
  };

  const cancelEdit = () => {
    setInput(null);
    setEditMode(false);
  };

  const updateCompetence = () => {
    //updating keywords
    if (editMode && !editTitle) {
      UpdateKeywords(token, keywords)
        .then(() => {
          fetchKeywords();
          setEditMode(false);
        })
        .catch((e) => console.log(e));
    } else if (!editMode && editTitle) {
      //update title
      UpdateCompetenceName(token, competenceId, { name: compName }).then(() =>
        setEditTitle(false)
      );
    }
  };

  const changeValue = (item, text) => {
    setKeywords((state) => {
      let index = state.findIndex((e) => e["id"] === item.id);
      let copy = { ...state[index] };
      return state.map((i) => (i.id === item.id ? { ...copy, name: text } : i));
    });
  };

  const deleteDialog = (item) =>
    Alert.alert(
      "Verwijder uit systeem",
      `Weet je zeker dat je ${item.name} wilt verwijderen?`,
      [
        {
          text: "Annuleer",
          style: "cancel",
        },
        {
          text: "Bevestigen",
          onPress: () => {
            DeleteKeyword(token, item.id)
              .then(() => alert("Succesvol verwijderd"))
              .then(() => fetchKeywords())
              .catch((e) => console.log(e));
          },
        },
      ],
      { cancelable: false }
    );

  // keywords[keywords.findIndex((e) => e["id"] === item.id)].name
  const renderItem = ({ item, index }) => {
    return (
      <Pressable
        onLongPress={() => {
          deleteDialog(item);
        }}
        onPress={() => {
          if (!editTitle) {
            setEditMode(true);
            setSelectedKeyword(item);
          }
        }}
      >
        <Card>
          <TextInput
            editable={editMode}
            style={[styles.text, { color: editMode ? "darkgray" : "black" }]}
            value={item.name}
            placeholderTextColor={"black"}
            onChangeText={(t) => changeValue(item, t)}
            showSoftInputOnFocus={editMode}
          />
        </Card>
      </Pressable>
    );
  };

  if (!loading) {
    return (
      <View style={styles.container}>
        <View style={styles.title}>
          <Pressable
            onLongPress={() => {
              setEditTitle(!editMode ? true : false);
            }}
          >
            <TextInput
              style={styles.competenceName}
              value={compName}
              editable={editTitle}
              showSoftInputOnFocus={editTitle}
              onChangeText={(t) => setCompName(t)}
            />
          </Pressable>
        </View>
        <View style={styles.buttons}>
          {((editMode && selectedKeyword) || editTitle) && (
            <TouchableOpacity onPress={() => updateCompetence()}>
              <AntDesign
                name="check"
                size={28}
                color="green"
                style={styles.button}
              />
            </TouchableOpacity>
          )}
          {!editMode && !editTitle && (
            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
              <AntDesign
                name="plus"
                size={28}
                color="black"
                style={styles.button}
              />
            </TouchableOpacity>
          )}
          {((editMode && selectedKeyword) || editTitle) && (
            <TouchableOpacity
              onPress={() => {
                setEditMode(false);
                setEditTitle(false);
              }}
            >
              <AntDesign
                name="close"
                size={28}
                color="red"
                style={styles.button}
              />
            </TouchableOpacity>
          )}
        </View>

        <Modal animationType="fade" transparent={true} visible={modalVisible}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalHeaderText}>Voeg trefwoorden toe</Text>
              <Text style={styles.modalText}>
                gebruik een comma om te onderscheiden
              </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  autoCapitalize={"none"}
                  style={styles.inputField}
                  onChangeText={(t) => setInput(t)}
                  value={input}
                  multiline={true}
                  numberOfLines={6}
                />
              </View>
              <View style={styles.buttons}>
                <TouchableHighlight
                  style={{
                    ...styles.modalButton,
                    backgroundColor: COLORS.darkgreen,
                  }}
                  onPress={() => {
                    addKeywords();
                  }}
                >
                  <Text style={styles.buttonText}>Opslaan</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={{
                    ...styles.modalBbutton,
                    backgroundColor: COLORS.red,
                  }}
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
        <FlatList
          data={keywords}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    );
  } else return <Loading />;
};
