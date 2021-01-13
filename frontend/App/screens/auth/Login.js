import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, Button } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { COLORS } from "../../assets/constants";

import { useAuth } from "../../context/AuthContext";

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.darkgray,
    flex: 1,
    justifyContent: "space-evenly",

    borderColor: "black",
    borderWidth: 5,
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
  const { loginUser } = useAuth();

  const [login, setLogin] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const submitLogin = () => {
    if (login.email.length > 0 && login.password.length > 0) {
      loginUser(login, (value) => setError(value));
    } else {
      setError("Beide velden invullen svp..");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Inloggen</Text>
      <View style={styles.form}>
        <Text style={styles.error}>{error}</Text>
        <TextInput
          value={login.email}
          onChangeText={(e) => setLogin({ ...login, ["email"]: e })}
          autoCapitalize="none"
          style={styles.textInput}
          placeholder="info@example.com"
        ></TextInput>

        <TextInput
          value={login.password}
          onChangeText={(e) => setLogin({ ...login, ["password"]: e })}
          autoCapitalize="none"
          style={styles.textInput}
          placeholder="password"
          secureTextEntry={true}
        ></TextInput>

        <TouchableOpacity>
          <Text
            title="login"
            onPress={() => submitLogin()}
            style={styles.button}
          >
            Log In
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Sign Up")}>
          <Text>No account? Sign up first</Text>
        </TouchableOpacity>
      </View>
      <View></View>
    </View>
  );
};
