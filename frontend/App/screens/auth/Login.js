import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Button } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { COLORS } from "../../assets/constants";

import { useAuth } from "../../context/AuthContext";

//Login screen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
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
  },
  textInput: {
    fontSize: 20,
    width: 220,
    borderRadius: 5,
    borderBottomColor: "black",
    borderBottomWidth: 1,
    marginBottom: 5,
    backgroundColor: "white",
    padding: 4,
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
  signUp: {
    marginTop: 10,
  },
});

export default ({ navigation }) => {
  const { loginUser } = useAuth();

  const [login, setLogin] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submitLogin = () => {
    if (login.email.length > 0 && login.password.length > 0) {
      setError("");
      setLoading(true);
      loginUser(login, (value) => setError(value))
        .then(() => setLoading(false))
        .catch((e) => console.log(e));
    } else {
      setError("Beide velden invullen svp..");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Inloggen</Text>
      <View style={styles.form}>
        <Text style={styles.error}>{error}</Text>
        {loading && <Text>Laden..</Text>}
        <TextInput
          value={login.email}
          onChangeText={(t) => setLogin({ ...login, ["email"]: t })}
          autoCapitalize="none"
          style={styles.textInput}
          placeholder="info@voorbeeld.nl"
        />

        <TextInput
          value={login.password}
          onChangeText={(t) => setLogin({ ...login, ["password"]: t })}
          autoCapitalize="none"
          style={styles.textInput}
          placeholder="wachtwoord"
          secureTextEntry={true}
        />

        <TouchableOpacity>
          <Text
            title="login"
            onPress={() => submitLogin()}
            style={styles.button}
          >
            Log In
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.signUp}
          onPress={() => navigation.navigate("Sign Up")}
        >
          <Text>Nog geen account? Registreer eerst</Text>
        </TouchableOpacity>
      </View>
      <View></View>
    </View>
  );
};
