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
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  CreateNewCompetence,
  GetAllCompetences,
  GetCompetences,
  RegisterGroups,
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
  addButton: {
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
  }, [!editMode]);

  const addRow = () => {
    const copy = [...competences];
    copy.unshift({ name: "", id: "temp" });
    setCompetences(copy);
    setEditMode(true);
  };

  const saveCompetence = () => {
    if (input === "") {
      cancelEdit();
      return;
    }

    CreateNewCompetence(token, { name: input })
      .then((r) => {
        cancelEdit();
      })
      .catch((r) => console.log(r));
  };

  const cancelEdit = () => {
    const copy = [...competences];
    copy.shift();
    setCompetences(copy);
    setEditMode(false);
  };
  const onItemPress = (item, index) => {
    if (!editMode)
      navigation.push("CompetenceDetails", {
        id: item.id,
        keywords: item.keyword_set,
        name: item.name,
      });
  };

  const renderItem = ({ item, index }) => {
    console.log(item);
    console.log(index);
    return (
      <TouchableOpacity onPress={() => onItemPress(item, index)}>
        <Card>
          <TextInput
            editable={editMode}
            style={[styles.text, { color: editMode ? "darkgray" : "black" }]}
            value={index == 0 && editMode ? input : item.name}
            placeholderTextColor={"black"}
            onChangeText={(t) => setInput(t)}
            showSoftInputOnFocus={editMode && index === 0}
          />
        </Card>
      </TouchableOpacity>
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
                style={styles.addButton}
              />
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={() => addRow()} disabled={editMode}>
            <AntDesign
              name="plus"
              size={28}
              color="black"
              style={styles.addButton}
            />
          </TouchableOpacity>

          {editMode && (
            <TouchableOpacity onPress={() => cancelEdit()}>
              <AntDesign
                name="close"
                size={28}
                color="red"
                style={styles.addButton}
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
