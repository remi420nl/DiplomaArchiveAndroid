import React, { useEffect, useState, useRef } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { COLORS } from "../../assets/constants";
import { CreateNewCourse } from "../../../api/Api";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/Button";

export default ({ route }) => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [succes, setSuccess] = useState(null);

  const { token } = useAuth();

  const handleSubmit = () => {
    setSuccess(null);
    setError(null);

    if (checkFields() < 2) {
      setError("Beide velden invullen svp");
    } else {
      CreateNewCourse(token, formData)
        .then(() => setSuccess("Vak aangemakt"))
        .catch((e) => {
          if (e.response.status === 409) {
            setError("Vak bestaat al");
          }
        });
    }
  };

  const onChangeHandler = (field) => (text) => {
    setFormData((state) => ({ ...state, [field]: text }));
  };

  const checkFields = () => {
    let count = 0;
    const form = { ...formData };
    for (let field in form) {
      if (form.hasOwnProperty(field)) {
        if (form[field] !== "") {
          ++count;
        }
      }
    }
    return count;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nieuw vak toevoegen</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.feedbackmessages}>
          {error && <Text style={styles.error}>{error}</Text>}
          {succes && <Text style={styles.success}>{succes}</Text>}
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Naam</Text>

          <TextInput
            value={formData["name"]}
            style={styles.textInput}
            onChangeText={onChangeHandler("name")}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Omschrijving</Text>

          <TextInput
            value={formData["description"]}
            style={styles.textInput}
            onChangeText={onChangeHandler("description")}
          />
        </View>

        <View style={styles.button}>
          <Button text="Opslaan" theme="primary" onPress={handleSubmit} />
        </View>
      </View>
      <View></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
  },
  header: {
    width: "90%",
    top: 5,
    color: "white",
    fontSize: 38,
    fontWeight: "bold",
    alignSelf: "center",
    height: 100,
  },
  title: {
    textTransform: "uppercase",
    fontSize: 26,
    fontWeight: "bold",
    letterSpacing: -1,
    textAlign: "center",
  },
  form: {
    alignItems: "center",
  },
  row: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 20,
    height: 30,
  },
  textInput: {
    fontSize: 20,
    width: "60%",
    borderRadius: 5,
    paddingHorizontal: 8,
    borderBottomColor: "black",
    borderBottomWidth: 1,
    marginBottom: 5,
    backgroundColor: "white",
  },

  button: {
    alignItems: "center",
    marginTop: 25,
  },
  feedbackmessages: {
    marginBottom: 10,
    alignItems: "center",
  },
  error: {
    color: "darkred",
    fontSize: 20,
  },
  success: {
    color: "darkgreen",
    fontSize: 20,
  },
});
