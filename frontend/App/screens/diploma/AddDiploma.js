import React, { useEffect, useState, useRef } from "react";
import { View, Text, TextInput, StyleSheet, Button } from "react-native";
import { COLORS } from "../../assets/constants";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as DocumentPicker from "expo-document-picker";
import { CreateNewDiploma } from "../../../api/Api";
import CheckBox from "expo-checkbox";

const fields = [
  { text: "Naam diploma", field: "name", type: "text" },
  { text: "Datum behaald", field: "date", type: "date" },
  { text: "Omschrijving", field: "context", type: "text" },
  { text: "Voorkant", field: "front_img", type: "file" },
  { text: "Achterkant", field: "back_img", type: "file" },
];

export default ({ route }) => {
  const [formFields, setFormFields] = useState(fields);
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({});
  const [pdf, setPdf] = useState([]);
  const [error, setError] = useState("foutmelding gregregreghre");
  const [succes, setSuccess] = useState("succes!");
  const [checked, setChecked] = useState(false);

  // const { token, user } = route.params;
  const token = "efewfgewgfew";
  const user = { name: "ezel" };

  const buttonDisabled = useRef(false);

  useEffect(() => {
    checked
      ? setFormFields(fields)
      : setFormFields((fields) => fields.filter((f) => f.field !== "back_img"));
  }, [checked]);

  const handleSubmit = () => {
    setError(null);
    if (checkFields() && pdf.length > 0) {
    } else {
      setError("Alle verplichte velden invullen svp");
      return;
    }

    CreateNewDiploma(pdf, formData, token)
      .then(() => setSuccess("Diploma Succesvol Verstuurd"))
      .catch((e) => {
        e.response.data.error;
        setError(e.response.data.error);
      });
    if (checkFields()) {
      console.log("all fields entered");
    } else {
      setError("Alle verplichte velden invullen svp");
    }
  };

  const checkFields = () => {
    let enteredFields = [];
    for (const [key, value] of Object.entries(formData)) {
      if (value !== "") {
        enteredFields.push(key);
      }
    }
    for (let obj in formFields) {
      if (!enteredFields.includes(formFields[obj].field)) {
        // buttonDisabled.current = true;
        return false;
      }
    }
    // buttonDisabled.current = false;
    return true;
  };

  const picker = async (field) => {
    let result = await DocumentPicker.getDocumentAsync({});
    formData[field] = result.name;

    result.field = field;
    setPdf((pdf) => [...pdf, result]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text>Diploma toevoegen voor {user && user.name}</Text>
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
      {succes && <Text style={styles.success}>{succes}</Text>}
      <View style={styles.form}>
        {formFields.map(({ field, text, type }, i) => (
          <View style={styles.row} key={i}>
            <Text style={styles.label}>{text}</Text>

            <TextInput
              value={formData[field] && formData[field].toString()}
              onFocus={() => {
                type === "date" ? setShow(true) : setShow(false);
                type === "file" ? picker(field) : null;
              }}
              style={styles.textInput}
              onChangeText={(t) => {
                setFormData({ ...formData, [field]: t });
              }}
            />
          </View>
        ))}
        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.label]}>Achterkant Toevoegen</Text>
          <CheckBox value={checked} onValueChange={setChecked} />
        </View>

        <Button
          title="Opslaan"
          style={styles.button}
          onPress={() => handleSubmit()}
          disabled={buttonDisabled.current}
        ></Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.darkgray,
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
  row: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {},
  textInput: {
    fontSize: 20,
    width: "70%",
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
  success: {
    color: "darkgreen",
    fontSize: 20,
  },
});
