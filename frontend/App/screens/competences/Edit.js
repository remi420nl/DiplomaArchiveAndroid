import React, {
  useEffect,
  useState,
  createRef,
  useRef,
  useCallback,
  isValidElement,
} from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Pressable,
  Alert,
} from "react-native";
import {
  CreateNewCompetence,
  DeleteCompetence,
  GetAllCompetences,
} from "../../../api/Api";
import { AntDesign } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/Button";
import Loading from "../loading";
import Card from "../../components/Card";
import { COLORS } from "../../assets/constants";

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
});

export default ({ navigation, route }) => {
  const [competences, setCompetences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [input, setInput] = useState("");

  const ref = useRef();
  const { user, token } = useAuth();

  useEffect(() => {
    // Added eventlistener to refresh when the user navigates back to this screen so the course gets updated
    const unsubscribe = navigation.addListener("focus", () => {
      fetchCompetences();
    });

    // user has to be logged in for this
    return unsubscribe;
  }, [!editMode, navigation]);

  const addRow = () => {
    const copy = [...competences];
    copy.unshift({ name: "", id: "temp" });

    setCompetences(copy);
    setEditMode(true);
  };

  const fetchCompetences = () => {
    GetAllCompetences(token)
      .then(({ data }) => {
        setCompetences(
          data.sort((a, b) =>
            a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1
          )
        );
        setLoading(false);
      })
      .catch((e) => console.log(e));
  };

  const saveCompetence = () => {
    if (input === "") {
      cancelEdit();
      return;
    }

    CreateNewCompetence(token, { name: input })
      .then(() => {
        cancelEdit();
      })
      .catch((r) => console.log(r));
  };

  const cancelEdit = () => {
    const copy = [...competences];
    copy.shift();
    setCompetences(copy);
    setInput(null);
    setEditMode(false);
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
          onPress: () =>
            DeleteCompetence(token, item.id)
              .then(() => alert("Succesvol verwijderd"))
              .then(() => fetchCompetences())
              .catch((e) => console.log(e)),
        },
      ],
      { cancelable: false }
    );

  const onItemPress = (item, index) => {
    if (!editMode)
      navigation.push("Keywords", {
        id: item.id,
        competenceId: item.id,
        name: item.name,
      });
  };

  const renderItem = ({ item, index }) => {
    return (
      <Pressable
        onPress={() => onItemPress(item, index)}
        onLongPress={() => deleteDialog(item)}
      >
        <Card>
          <TextInput
            editable={editMode}
            style={[styles.text, { color: editMode ? "darkgray" : "black" }]}
            value={index == 0 && editMode ? input : item.name}
            placeholderTextColor={"black"}
            onChangeText={(t) => setInput(t)}
            showSoftInputOnFocus={editMode && index === 0}
            multiline={true}
          />
        </Card>
      </Pressable>
    );
  };

  if (!loading)
    return (
      <View style={styles.container}>
        <View style={styles.buttons}>
          {editMode && (
            <TouchableOpacity onPress={() => saveCompetence()}>
              <AntDesign
                name="check"
                size={28}
                color="green"
                style={styles.button}
              />
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={() => addRow()} disabled={editMode}>
            <AntDesign
              name="plus"
              size={28}
              color="black"
              style={styles.button}
            />
          </TouchableOpacity>

          {editMode && (
            <TouchableOpacity onPress={() => cancelEdit()}>
              <AntDesign
                name="close"
                size={28}
                color="red"
                style={styles.button}
              />
            </TouchableOpacity>
          )}
        </View>
        <FlatList
          taps
          data={competences}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    );

  return <Loading />;
};
