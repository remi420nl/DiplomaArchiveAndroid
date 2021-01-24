import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Modal,
  TouchableOpacity,
  TextInput,
  TouchableHighlight,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { COLORS, FONTS, SIZES } from "../../assets/constants";
import { Entypo } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/Button";
import {
  SearchCourseByName,
  GetDiplomaById,
  GetCourseById,
} from "../../../api/Api";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  main: {
    width: "100%",
    height: "100%",
    marginLeft: 20,
    marginTop: "10%",
    justifyContent: "space-around",
  },
  usercontent: {
    marginBottom: 200,
  },
  search: {},
  title: {
    ...FONTS.h1,
    fontSize: 60,
    color: "#1c86ee",
    width: "60%",
    margin: 15,
  },
  upperbutton: {
    backgroundColor: "#fff",
    width: "55%",
    borderRadius: 20,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
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
  error: {},
});

export default Home = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { token, user } = useAuth();

  useEffect(() => {});

  const submitSearch = () => {
    SearchCourseByName(searchText, token)
      .then(({ data }) => {
        setSearchResult(data);
      })
      .then(() => setModalVisible(true))
      .catch((e) => {
        console.log(e);
        setError("ERROR");
      });
  };

  const StudentContent = () => (
    <View>
      <Button
        text={"Diplomas"}
        onPress={() =>
          navigation.push("Diplomas", { token: token, user: user })
        }
        theme="secondary"
      />
      <Button
        text="Diploma Toevoegen"
        theme="primary"
        onPress={() =>
          navigation.push("AddDiploma", { token: token, user: user })
        }
      />
    </View>
  );

  const EmployerContent = () => (
    <View>
      <Button text="Vrijstellingen" theme="secondary" />
      <Button
        text="Vakken"
        onPress={() => navigation.push("Courses")}
        theme="primary"
      />
      <Button
        text={"Diplomas"}
        onPress={() =>
          navigation.push("Diplomas", { token: token, user: user })
        }
        theme="secondary"
      />
    </View>
  );

  const SearchResultModal = () => (
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
          <Text style={styles.modalText}>Gevonden:</Text>
          {searchResult.map((c, i) => (
            <TouchableHighlight
              key={i}
              onPress={() => navigation.push("Course", { id: c.id })}
            >
              <Text>{c.name}</Text>
            </TouchableHighlight>
          ))}

          <TouchableHighlight
            style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
            onPress={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <Text style={styles.textStyle}>Terug</Text>
          </TouchableHighlight>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            alert("todo");
          }}
        >
          <Entypo name="cog" size={32} color={COLORS.white} />
        </TouchableOpacity>
      </View>
      <View style={styles.upperbutton}>
        <TouchableOpacity
          onPress={() => {
            submitSearch();
          }}
        >
          <AntDesign name="search1" size={24} color="darkred" />
        </TouchableOpacity>
        <TextInput
          onChangeText={(v) => setSearchText(v)}
          placeholder="Zoe een vak"
        />
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
      {SearchResultModal()}
      <View style={styles.main}>
        <View style={{}}>
          <Text>{user ? `Hallo ${user.name}!` : "Niet Ingelogd"}</Text>

          <Text style={styles.title}>Diploma Archive</Text>
        </View>
        <View style={styles.usercontent}>
          {user && user.type == "student" && StudentContent()}
          {user && user.type == "employee" && EmployerContent()}
        </View>
      </View>
    </View>
  );
};
