import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { GetDiplomaById } from "../../../api/Api";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/Button";
import Loading from "../loading";

export default ({ navigation, route }) => {
  const [diploma, setDiploma] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState();

  const { token, id } = route.params;

  useEffect(() => {
    GetDiplomaById(id, token)
      .then(({ data }) => {
        setDiploma(data);
      })
      .catch((e) => {
        console.log("error", e);
      });
  }, []);

  const styles = StyleSheet.create({
    container: {
      marginTop: 40,
      margin: 10,
      flex: 1,

      justifyContent: "space-evenly",
    },
    content: {
      height: "25%",
    },
    competences: {
      flex: 1,
    },
    header: {
      fontSize: 22,
      fontWeight: "bold",
      textTransform: "uppercase",
    },
    text: {
      fontSize: 18,
    },
    buttons: {
      flexGrow: 1,
    },
    button: {
      marginVertical: 25,
    },
    competenseList: { marginTop: 10 
    },
    competence: { fontSize: 20 
    },
  });

  if (diploma) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.text}>Diploma van {diploma.student.name}</Text>
          <Text style={styles.text}>{diploma.context}</Text>
          <Text style={styles.header}>{diploma.name}</Text>
          <Text style={styles.text}>Behaald op {diploma.date}</Text>
        </View>
        <View style={styles.competences}>
          <Text style={styles.header}>Competenties:</Text>
          {diploma.competences &&
            diploma.competences.map(({ id, name }) => (
              <Text key={id} style={styles.text}>
                {name}
              </Text>
            ))}
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.button}>
            <Button
              text="Competenties beheren"
              onPress={() => navigation.push("ManageDiploma")}
              theme="secondary"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <Button
              text="Diploma Downloaden"
              onPress={() => {}}
              theme="primary"
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  } else {
    return <Loading />;
  }
};
