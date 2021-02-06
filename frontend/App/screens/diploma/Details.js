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
import { ScrollView } from "react-native-gesture-handler";

export default ({ navigation, route }) => {
  const [diploma, setDiploma] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState();

  const { token, id } = route.params;

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      GetDiplomaById(id, token)
        .then(({ data }) => {
          setDiploma(data);
        })
        .catch((e) => {
          console.log("error", e);
        });
    });

    return unsubscribe;
  }, [navigation]);

  const styles = StyleSheet.create({
    container: {
      marginTop: 40,
      margin: 10,
      flex: 1,
      padding: 10,
      justifyContent: "space-evenly",
    },
    content: {
      flex: 1,
    },
    competences: {
      flex: 2,
    },
    header: {
      fontSize: 22,
      fontWeight: "bold",
      textTransform: "uppercase",
    },
    text: {
      fontSize: 18,
      height: 25,
    },
    buttons: {
      flex: 3,
    },
    button: {
      marginVertical: 15,
    },
    competenseList: { marginTop: 10 },
    competence: { fontSize: 20 },
  });

  if (diploma) {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.content}>
            <Text style={styles.header}>
              Diploma van {diploma.student.name}
            </Text>
            <Text style={styles.text}>{diploma.name}</Text>
            <Text style={styles.text}>{diploma.context}</Text>
            <Text style={styles.text}>{diploma.name}</Text>
            <Text style={styles.text}>Behaald op {diploma.date}</Text>
          </View>
        </ScrollView>
        <View style={styles.competences}>
          <ScrollView>
            <Text style={styles.header}>Competenties:</Text>
            {diploma.competences &&
              diploma.competences.map(({ id, name }) => (
                <Text key={id} style={styles.text}>
                  {name}
                </Text>
              ))}
          </ScrollView>
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.button}>
            <Button
              text="Competenties beheren"
              onPress={() =>
                navigation.push("ManageDiploma", {
                  diplomaId: id,
                  diplomaName: diploma.name,
                  currentCompetences: diploma.competences,
                })
              }
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
