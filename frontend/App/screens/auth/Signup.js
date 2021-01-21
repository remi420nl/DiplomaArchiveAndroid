import React, { useEffect, useState, useRef } from "react";
import { View, Text, TextInput, StyleSheet, Button } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { COLORS } from "../../assets/constants";
import { RegisterGroups } from "../../../api/Api";
import { RadioButton } from "react-native-paper";
import { useAuth } from "../../context/AuthContext";

const styles = StyleSheet.create({
  container: {
  
    flex: 1,
    justifyContent: "space-evenly",

  
  },
  header: {
    top: 4,
    color: "white",
    fontSize: 38,
    fontWeight: "bold",
    alignSelf: "center",
  },
  form: {
    alignItems: "center",
  },
  textInput: {
    fontSize: 20,
    width: 200,
    borderRadius: 5,
    paddingHorizontal: 8,
    borderBottomColor: "black",
    borderBottomWidth: 1,
    marginBottom: 5,
    backgroundColor: "white",
  },

  button: {
    marginTop: 10,
    padding: 10,
    backgroundColor: COLORS.blue,
    borderRadius: 5,
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.lightGray,
    opacity: 0.9,
  },
  error: {
    color: "darkred",
    fontSize: 20,
  },
});

export default ({ navigation }) => {
  const [groups, setGroups] = useState(null);
  const [checked, setChecked] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup, user } = useAuth();

  useEffect(() => {
    RegisterGroups()
      .then(({ data }) => setGroups(data.groups))
      .catch((error) => console.log(error));
  }, []);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordconfirm: "",
  });

  const submitSignup = async (e) => {

    setLoading(true);
    const user = { ...form, group: checked };

    await signup(user)
      .then(() => navigation.navigate('Login'))
      .catch((e) => {
        setError(e.response.data.error);
        setLoading(false);
      });
  };

  if (groups) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Registreren</Text>
     
        <Text style={styles.header}>{loading && "Loading..."}</Text>
        <View style={styles.form}>
          <Text style={styles.error}>{error}</Text>
          <TextInput
            value={form.name}
            onChangeText={(e) => setForm({ ...form, ["name"]: e })}
            autoCapitalize="none"
            style={styles.textInput}
            placeholder="Voornaam Achternaam"
          ></TextInput>

          <TextInput
            value={form.email}
            onChangeText={(e) => setForm({ ...form, ["email"]: e })}
            autoCapitalize="none"
            style={styles.textInput}
            placeholder="info@example.com"
          ></TextInput>

          <TextInput
            value={form.password}
            onChangeText={(e) => setForm({ ...form, ["password"]: e })}
            autoCapitalize="none"
            style={styles.textInput}
            placeholder="password"
            secureTextEntry={true}
          ></TextInput>

          <TextInput
            value={form.passwordconfirm}
            onChangeText={(e) => setForm({ ...form, ["passwordconfirm"]: e })}
            autoCapitalize="none"
            style={styles.textInput}
            placeholder="password"
            secureTextEntry={true}
          ></TextInput>

          {groups.map((g, i) => (
            <View style={{ flexDirection: "row" }} key={i}>
              <Text>{g.value}</Text>
              <RadioButton
                value={g.name}
                status={
                  checked && checked.name === g.name ? "checked" : "unchecked"
                }
                onPress={() => setChecked(g)}
              />
            </View>
          ))}

          <TouchableOpacity disabled={loading}>
            <Text
              title="Voltooi"
              onPress={() => submitSignup()}
              style={styles.button}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
        <View></View>
      </View>
    );
  } else {
    return (
      <View>
        <Text>Loading groups..</Text>
      </View>
    );
  }
};
