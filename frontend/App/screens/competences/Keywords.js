import React, { useEffect, useState, createRef, useRef } from "react";
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
  InteractionManager,
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
    padding: 10,
    backgroundColor: COLORS.background3,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
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
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    alignSelf: "center",
    width: "100%",
  },
  modalButtons: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  button: {
    backgroundColor: COLORS.white,
    marginBottom: 10,
    elevation: 3,
    padding: 10,
    borderRadius: 10,
  },
  headerText: {
    alignSelf: "center",
    fontSize: 20,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: COLORS.primary,
    marginVertical: 10,
  },
  title: {
    backgroundColor: COLORS.primary,
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginBottom: 20,
    alignItems: "center",
    borderRadius: 5,
    alignSelf: "center",
  },
  competenceName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
});

export default ({ navigation, route }) => {
  const [compName, setCompName] = useState(route.params.name || "");
  const [input, setInput] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [keywords, setKeywords] = useState([]);
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const [editTitle, setEditTitle] = useState(false);

  const { competenceId } = route.params;

  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const { user, token } = useAuth();

  const textInputRef = useRef([]);

  useEffect(() => {
    fetchKeywords();
  }, []);

  const fetchKeywords = () => {
    GetKeywordsForCompetence(token, competenceId)
      .then(({ data }) => {
        setKeywords(data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const addKeywords = () => {
    if (input === "" || input == null) {
      cancelEdit();
      setModalVisible(false);
      return;
    } else {
      const words = input.split(",").filter((w) => w !== "");

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

  const keywordsLength = keywords && keywords.length;

  if (keywordsLength !== textInputRef.length) {
    textInputRef.current = Array(keywordsLength)
      .fill()
      .map((e, i) => textInputRef.current[i] || createRef());
  }

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
            setTimeout(() => textInputRef.current[index].focus(), 200);
          }
        }}
      >
        <Card>
          <TextInput
            ref={(r) => (textInputRef.current[index] = r)}
            editable={editMode && selectedKeyword.id == item.id}
            style={[
              styles.text,
              {
                color:
                  editMode && selectedKeyword.id == item.id
                    ? "darkgray"
                    : "black",
              },
            ]}
            value={item.name}
            placeholderTextColor={"black"}
            onChangeText={(t) => changeValue(item, t)}
            showSoftInputOnFocus={true}
            multiline={true}
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
              multiline={true}
            />
          </Pressable>
        </View>
        <View style={styles.buttonContainer}>
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
              <View style={styles.modalButtons}>
                <Button
                  text="Opslaan"
                  type="modal"
                  theme="submit"
                  onPress={() => addKeywords()}
                />

                <Button
                  text="Terug"
                  type="modal"
                  theme="cancel"
                  onPress={() => setModalVisible(!modalVisible)}
                />
              </View>
            </View>
          </View>
        </Modal>
        <Text style={styles.headerText}>Trefwoorden</Text>
        <FlatList
          data={keywords}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          removeClippedSubviews={false}
        />
      </View>
    );
  } else return <Loading />;
};
