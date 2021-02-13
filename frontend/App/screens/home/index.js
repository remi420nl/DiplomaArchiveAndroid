import React, { useEffect, useState, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Keyboard,
  TouchableOpacity,
  TextInput,
  TouchableHighlight,
  TouchableWithoutFeedback,
  StatusBar,
} from "react-native";

import { COLORS, FONTS, SIZES } from "../../assets/constants";
import { Entypo } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/Button";
import { GetAllCourses, SearchCourseByName } from "../../../api/Api";
import Menu, { MenuItem, MenuDivider } from "react-native-material-menu";
import showApplicationDetails from "../../components/Home/ApplicationDetails";

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
  mainContent: {},
  usercontent: {
    marginBottom: 200,
    zIndex: 0,
  },
  search: {},

  title: {
    ...FONTS.h1,
    fontSize: 60,
    color: COLORS.steelblue,
    fontWeight: "bold",
    margin: 15,
  },
  welcomeText: {
    marginLeft: 15,
    fontSize: 18,
    color: COLORS.steelblue,
    fontWeight: "bold",
  },
  searchField: {
    backgroundColor: COLORS.gray2,
    opacity: 0.8,
    width: 200,
    borderRadius: 10,
    padding: 10,
    flexDirection: "row",
  },
  textInput: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 2.5,
    width: "100%",
    textAlign: "center",
  },

  searchResult: {
    height: 300,
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 1,
    borderRadius: 15,
  },
  searchItem: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 10,
    opacity: 0.95,
    zIndex: 2,
  },
  searchItemText: {
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  error: {},
});

export default Home = ({ navigation }) => {
  const [searchResult, setSearchResult] = useState([]);
  const [error, setError] = useState(null);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const { token, user } = useAuth();

  const ref = useRef(null);

  useEffect(() => {
    GetAllCourses().then(({ data }) => {
      setCourses(data);
    });
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardOpen(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardOpen(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  });

  const searchCourses = (text) => {
    setSearchResult(() =>
      courses.filter((c) => c.name.toLowerCase().includes(text))
    );
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

  const EmployeeContent = () => (
    <View>
      <Button
        text="Vrijstellingen"
        theme="secondary"
        onPress={() => navigation.push("Exemptions", {})}
      />
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

  const TopButton = () => (
    <Menu
      ref={(r) => (ref.current = r)}
      button={
        <TouchableOpacity
          style={{ margin: 5 }}
          onPress={() => {
            ref.current.show();
          }}
        >
          <Entypo name="cog" size={32} color={COLORS.steelblue} />
        </TouchableOpacity>
      }
    >
      <MenuItem onPress={() => navigation.navigate("Contact")}>
        Contact
      </MenuItem>
      {isEmployee && (
        <>
          <MenuItem onPress={() => navigation.push("EditCompetences")}>
            Competencies bewerken
          </MenuItem>
          <MenuItem onPress={() => navigation.push("CreateCourse")}>
            Vak toevoegen
          </MenuItem>
        </>
      )}
      <MenuDivider />
      <MenuItem onPress={() => showApplicationDetails()}>Informatie</MenuItem>
      <MenuDivider />
      <MenuItem onPress={() => ref.current.hide()}>Verberg</MenuItem>
    </Menu>
  );

  const isStudent = user && user.type == "student";
  const isEmployee = user && user.type == "employee";

  const renderItem = ({ item, index }) => (
    <TouchableHighlight
      style={[
        styles.searchItem,
        {
          backgroundColor: index % 2 == 0 ? COLORS.white : COLORS.gray2,
        },
      ]}
      onPress={() => navigation.push("Course", { id: item.id })}
    >
      <Text
        style={[
          styles.searchItemText,
          { color: index % 2 == 0 ? COLORS.black : COLORS.white },
        ]}
      >
        {item.name}
      </Text>
    </TouchableHighlight>
  );

  return (
    <TouchableWithoutFeedback
      style={{ flex: 1 }}
      onPressOut={() => {
        setSearchResult(null);
        Keyboard.dismiss();
      }}
    >
      <View style={styles.container}>
        <View style={styles.header}>{TopButton()}</View>
        <View>
          <View style={styles.searchField}>
            <TextInput
              style={styles.textInput}
              onChangeText={(v) => searchCourses(v)}
              placeholderTextColor={COLORS.white}
              placeholder="Zoek een vak"
              onFocus={() => {
                setSearchResult(courses);
              }}
            />
          </View>
          <View>
            {searchResult && (
              <View
                style={{
                  ...styles.searchResult,
                  height: keyboardOpen ? 300 : 600,
                }}
              >
                <FlatList
                  data={searchResult}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.id.toString()}
                />
              </View>
            )}
          </View>
        </View>
        {error && <Text style={styles.error}>{error}</Text>}

        <View style={styles.main}>
          <View style={styles.mainContent}>
            <Text style={styles.welcomeText}>
              {user ? `Hallo ${user.name}!` : "Niet Ingelogd"}
            </Text>

            <Text style={styles.title}>DIPLOMA ARCHIVE</Text>
          </View>
          <View style={styles.usercontent}>
            {isStudent && StudentContent()}
            {isEmployee && EmployeeContent()}
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
