import React, { useEffect, useState, useRef } from "react";
import { Text, View, StyleSheet, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import { SendContactEmail } from "../../../api/Api";
import { COLORS } from "../../assets/constants";
import { Button } from "../../components/Button";

export default () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    header: { alignItems: "center", marginBottom: 20 },
    title: {
      fontSize: 18,
      textTransform: "uppercase",
      marginTop: 10,
    },
    inputContainer: {
      width: 220,
      height: 60,
      padding: 5,
      marginVertical: 5,
      shadowOffset: { width: 1, height: 1 },
      shadowColor: COLORS.shadow,
      shadowOpacity: 0.4,
      shadowRadius: 2,
    },
    messageContainer: {
      width: 220,
      height: 170,

      padding: 5,
      marginVertical: 5,

      shadowOffset: { width: 1, height: 1 },
      shadowColor: COLORS.shadow,
      shadowOpacity: 0.4,
      shadowRadius: 2,
    },
    buttonContainer: {
      width: 220,
      height: 100,

      padding: 5,
      marginVertical: 10,
    },
    text: {
      marginBottom: 5,
    },
    inputField: {
      flex: 1,
      borderColor: COLORS.black,
      borderWidth: 1,
      padding: 6,
      borderRadius: 5,
    },
    messageField: {
      flex: 1,
      textAlignVertical: "top",
      justifyContent: "flex-start",
      padding: 6,
      borderColor: COLORS.black,
      borderWidth: 1,
      borderRadius: 5,
    },
    buttonContainer: {
      width: 220,
      justifyContent: "center",
      alignItems: "center",
    },
    button: { alignSelf: "center" },
    feedback: {
      justifyContent: "center",
      alignItems: "center",
    },
    resultText: {},
    error: {
      fontSize: 16,
      color: COLORS.red,
    },
  });

  const handleForm = (field) => (text) => {
    setFormData((state) => ({ ...state, [field]: text }));
  };

  const handleSubmit = () => {
    setLoading(true);
    setError("");
    setResult("Verzenden..");
    SendContactEmail(formData)
      .then(() => {
        setResult("E-mail succesvol verzonden");
        setLoading(false);
      })
      .catch(() => {
        setError("Er is iets fout gegaan");
        setLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Feather name="mail" size={24} color="black" />
        <Text style={styles.title}>Neem contact op met de school</Text>
      </View>
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.text}>Naam</Text>
          <TextInput
            value={formData["name"]}
            onChangeText={handleForm("name")}
            style={styles.inputField}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.text}>E-mail Adres</Text>
          <TextInput
            value={formData["email"]}
            style={styles.inputField}
            onChangeText={handleForm("email")}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.text}>Onderwerp</Text>
          <TextInput
            value={formData["subject"]}
            style={styles.inputField}
            onChangeText={handleForm("subject")}
          />
        </View>
        <View style={styles.messageContainer}>
          <Text style={styles.text}>Bericht</Text>
          <TextInput
            value={formData["message"]}
            style={styles.messageField}
            onChangeText={handleForm("message")}
          />
        </View>
        <View style={styles.butonContainer}>
          <View style={styles.button}>
            <Button
              disabled={loading}
              onPress={() => handleSubmit()}
              theme="contact"
              text="VERZENDEN"
            />
          </View>
        </View>
        <View style={styles.feedback}>
          <Text style={styles.resultText}>{result}</Text>
          <Text style={styles.error}>{error}</Text>
        </View>
      </View>
    </View>
  );
};
