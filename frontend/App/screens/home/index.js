import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { COLORS, FONTS, SIZES } from "../../assets/constants";
import { Entypo } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/Button";

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
});

export default Home = ({ navigation }) => {
  const [searchText, setSearchText] = useState("Zoek Vak");
  const { token, user } = useAuth();

  useEffect(() => {
    console.log("user", user);
    console.log("token", token);
  });

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
      <View style={styles.search}>
        <TouchableOpacity
          style={styles.upperbutton}
          onPress={() => {
            setSearchText("");
            console.warn("clicked");
          }}
        >
          <AntDesign name="search1" size={24} color="darkred" />
          <Text style={styles.pressabletext}>{searchText}</Text>
        </TouchableOpacity>
      </View>

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
