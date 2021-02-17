import React, { useEffect, useState, useRef } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { COLORS } from "../../assets/constants";
import { RegisterGroups } from "../../../api/Api";
import { RadioButton } from "react-native-paper";
import { useAuth } from "../../context/AuthContext";
import {
  isPasswordValid,
  passwordValidation,
  PasswordValidationText,
} from "../../util/PasswordCheck";
import { IsEmailValid } from "../../util/EmailCheck";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 55,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  header: {
    top: 4,
    color: COLORS.steelblue,
    fontSize: 38,
    fontWeight: "bold",
    alignSelf: "center",
  },
  form: {
    alignItems: "center",
    flexGrow: 1,
  },
  textInput: {
    fontSize: 20,
    width: 220,
    borderRadius: 5,
    padding: 4,
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
  groupChoice: {
    margin: 10,
    flexDirection: "row",
    justifyContent: "space-between",
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
    //fetcher the available user groups from the api
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

    const validPassword = isPasswordValid(form);

    const validEmail = IsEmailValid(form.email);
    if (!validEmail) {
      setError("email adres niet geldig");
      setLoading(false);
      return;
    }

    if (form.password === form.passwordconfirm && validPassword && checked) {
      const user = { ...form, group: checked };

      await signup(user)
        .then(() => navigation.navigate("Login"))
        .catch((e) => {
          setError(e.response.data.error);
          setLoading(false);
        });
    } else if (!validPassword) {
      setError("Wachtwoord voldoet niet aan eisen");
      setLoading(false);
    } else if (!checked) {
      setError("Kies medewerker of student");
      setLoading(false);
    } else {
      setError("Wachtwoorden komen niet overeen");
      setLoading(false);
    }
  };

  if (groups) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <Text style={styles.header}>Registreren</Text>
          <Text style={styles.header}>{loading && "Loading..."}</Text>
          {error.length > 0 && <Text style={styles.error}>{error}</Text>}
          <View style={styles.form}>
            <TextInput
              value={form.name}
              onChangeText={(t) => setForm({ ...form, ["name"]: t })}
              autoCapitalize="none"
              style={styles.textInput}
              placeholder="voornaam achternaam"
            />
            <TextInput
              value={form.email}
              onChangeText={(t) => setForm({ ...form, ["email"]: t })}
              autoCapitalize="none"
              style={styles.textInput}
              placeholder="info@email.com"
            />
            <TextInput
              value={form.password}
              onChangeText={(t) => setForm({ ...form, ["password"]: t })}
              autoCapitalize="none"
              style={styles.textInput}
              placeholder="wachtwoord"
              secureTextEntry={true}
            />
            <TextInput
              value={form.passwordconfirm}
              onChangeText={(t) => setForm({ ...form, ["passwordconfirm"]: t })}
              autoCapitalize="none"
              style={styles.textInput}
              placeholder="herhaal wachtwoord"
              secureTextEntry={true}
            />
            <View style={styles.groupChoice}>
              {groups.map((g, i) => (
                <View
                  style={{ flexDirection: "row", alignItems: "center" }}
                  key={i}
                >
                  <Text>{g.value}</Text>
                  <RadioButton
                    value={g.name}
                    status={
                      checked && checked.name === g.name
                        ? "checked"
                        : "unchecked"
                    }
                    onPress={() => setChecked(g)}
                  />
                </View>
              ))}
            </View>
            <PasswordValidationText passwordForm={form} />
            <TouchableOpacity disabled={loading} style={{ margin: 15 }}>
              <Text onPress={() => submitSignup()} style={styles.button}>
                Registreren
              </Text>
            </TouchableOpacity>
          </View>
          <View></View>
        </View>
      </ScrollView>
    );
  } else {
    return (
      <View>
        <Text>Loading groups..</Text>
      </View>
    );
  }
};
