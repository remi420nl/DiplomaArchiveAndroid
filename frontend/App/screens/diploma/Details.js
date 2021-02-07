import React, { useEffect, useState, useRef } from "react";
import { View, Text, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { DeleteDiploma, GetDiplomaById } from "../../../api/Api";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/Button";
import Loading from "../loading";
import { ScrollView } from "react-native-gesture-handler";

export default ({ navigation, route }) => {
  const [diploma, setDiploma] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { token, id } = route.params;
  const { user } = useAuth();

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

  const deleteDialog = () =>
    Alert.alert(
      "Verwijder uit systeem",
      `Weet je zeker dat je ${diploma.name} wilt verwijderen?`,
      [
        {
          text: "Annuleer",
          style: "cancel",
        },
        {
          text: "Bevestigen",
          onPress: () =>
            DeleteDiploma(token, diploma.id)
              .then(() => alert("Succesvol verwijderd"))
              .then(() => navigation.goBack())
              .catch((e) => console.log(e)),
        },
      ],
      { cancelable: false }
    );

  const buttons = () => {
    const isEmployee = user.type === "employee";
    const isStudent = user.type === "student";

    return (
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button}>
          {isEmployee && (
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
          )}
          {isStudent && (
            <Button
              text="Diploma Verwijderen"
              onPress={() => deleteDialog()}
              theme="secondary"
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Button
            text="Diploma Downloaden"
            onPress={() => {}}
            theme="primary"
          />
        </TouchableOpacity>
      </View>
    );
  };

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
        {buttons()}
      </View>
    );
  } else {
    return <Loading />;
  }
};
