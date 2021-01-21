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
import { Button } from "../../components/Button"

export default ({ route }) => {
  const [diploma, setDiploma] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState();

  // const { token, id } = route.params;

  // useEffect(() => {
  //   console.log("token", token);
  //   GetDiplomaById(id, token)
  //     .then(({ data }) => {
  //       setDiploma(data);
  //     })
  //     .catch((e) => {
  //       console.log("error", e);
  //     });
  // }, []);

  const styles = StyleSheet.create({
    container: {
      marginTop: 40,
      margin: 10,
      flex: 1,
 
      justifyContent: 'space-evenly'
      
    },
    content: {
      
   
      height: '25%'
     
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
      marginVertical: 25
    },
    competenseList: { marginTop: 10 },
    competence: { fontSize: 20 },
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>"Naam diploma"</Text>
        <Text style={styles.text}>"Omschrijving"</Text>
        <Text style={styles.text}>"01-02-2010"</Text>
        <Text style={styles.text}>"Naam student"</Text>
        </View>
        <View style={styles.competences}>
          <Text style={styles.header}>Competenties:</Text>
          <Text style={styles.text}>Programmeren</Text>
          <Text style={styles.text}>Designing</Text>
        </View>
        <View style={styles.buttons}>
         
          <TouchableOpacity style={styles.button}>
          <Button
        text="Diploma Uitlezen"
        onPress={() =>
          {}
        }
        theme="secondary"
      />
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
          <Button
        text="Diploma Downloaden"
        onPress={() =>
       {}
        }
        theme="primary"
      />
          </TouchableOpacity>
        </View>
      
    </View>
  );
};
