import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  GetAllCompetences,
  UpdateDiploma,
  CheckKeywordsDiploma,
} from "../../../api/Api";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/Button";
import Card from "../../components/Card";
import { COLORS } from "../../assets/constants";
import { useHeaderHeight } from "@react-navigation/stack";

//Screen to let employee manage the competences for a students diploma plus a functionality to read the pdf file to check for matches in the keyword database

export default ({ navigation, route }) => {
  const [competences, setCompetences] = useState(null);
  const [selectedCompetences, setSelectendCompetences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState(null);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const { diplomaId, diplomaName, currentCompetences } = route.params;

  const { token } = useAuth();

  useEffect(() => {
    fetchCompetences();
  }, []);

  const headerHeight = useHeaderHeight();

  const styles = StyleSheet.create({
    container: {
      paddingTop: headerHeight,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    list: {
      width: "100%",
    },
    text: {
      fontSize: 16,
      fontWeight: "bold",
    },
    upperContainer: {
      flex: 1,
      width: "100%",
      justifyContent: "space-between",
      flexDirection: "row",
    },
    lowerContainer: {
      height: "20%",
      padding: 8,
    },
    keywords: {
      flex: 1,
      borderRightWidth: 3,
      borderColor: COLORS.darkgray,
      paddingHorizontal: 25,
    },
    competenceList: {
      flex: 1,
      paddingHorizontal: 35,
    },
    buttons: {
      flexDirection: "row",
      justifyContent: "space-around",
      width: "100%",
    },
    button: {},
    header: {
      height: 40,
      alignItems: "center",
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
    },
  });

  const fetchCompetences = () => {
    setResult(null);
    GetAllCompetences(token)
      .then(({ data }) => {
        setCompetences(
          data.sort((a, b) =>
            a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1
          )
        );
        setSelectendCompetences(currentCompetences.map((c) => c));
        setLoading(false);
      })
      .catch((e) => console.log(e));
  };

  const checkDiploma = () => {
    setResult(null);
    setLoading(true);
    CheckKeywordsDiploma(token, diplomaId)
      .then(({ data: { keywords, matches } }) => {
        setMatches(matches);
        setMatchesForCompetence(matches);
        setLoading(false);
      })

      .catch((e) => {
        if (e.response.status === 404) {
          setError("Geen pdf gevonden");
        } else {
          setError("Er is iets fout gegaan");
        }
        setLoading(false);
      });
  };

  const setMatchesForCompetence = (matches) => {
    setCompetences((state) =>
      state.map((c) => ({
        ...c,
        match: matches.map((m) => m.competence).indexOf(c.id) !== -1,
      }))
    );
  };

  const renderKeyword = ({ item }) => (
    <Pressable style={styles.list}>
      <Card>
        <Text style={styles.text}>{item.name}</Text>
      </Card>
    </Pressable>
  );

  const renderCompetence = ({ item }) => {
    return (
      <Pressable
        style={[styles.list]}
        onLongPress={() => {
          console.log(selectedCompetences);
          setSelectendCompetences((state) => {
            return state.map((s) => s.id).indexOf(item.id) === -1
              ? [...state, item]
              : state.filter((competence) => competence.id !== item.id);
          });
        }}
      >
        <Card
          customStyle={{
            backgroundColor:
              selectedCompetences.map((c) => c.id).indexOf(item.id) !== -1
                ? COLORS.darkgreen
                : COLORS.white,
            borderColor: item.match ? COLORS.red : null,
            borderWidth: item.match ? 5 : null,
          }}
        >
          <Text style={styles.text}>{item.name}</Text>
        </Card>
      </Pressable>
    );
  };

  const resultSection = () => {
    if (matches) {
      return (
        <View>
          <Text style={styles.text}>
            Totaal gematchte trefwoorden: {matches.length}
          </Text>
          <Text style={styles.text}>In compentie(s):</Text>
          {competences.map((c, i) => c.match && <Text key={i}>{c.name}</Text>)}
        </View>
      );
    } else if (!matches && !error) {
      return (
        <Text
          style={[
            styles.text,
            { color: result ? COLORS.black : COLORS.darkgreen },
          ]}
        >
          {result ? result : "Klik hieronder"}
        </Text>
      );
    } else if (error) {
      return <Text style={[styles.text, { color: COLORS.red }]}>{error}</Text>;
    }
  };

  const saveDiploma = () => {
    const data = { competences: selectedCompetences };

    UpdateDiploma(token, diplomaId, data).then(() =>
      setResult("Competenties bijgewerkt")
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            { textTransform: "uppercase", letterSpacing: 2.5 },
          ]}
        >
          {diplomaName}
        </Text>
      </View>
      <View style={styles.upperContainer}>
        <View style={styles.keywords}>
          <FlatList
            data={matches}
            renderItem={renderKeyword}
            keyExtractor={(item, i) => i.toString()}
            ListHeaderComponent={
              <View style={styles.header}>
                <Text style={styles.title}>Trefwoorden</Text>
              </View>
            }
          />
        </View>
        <View style={styles.competenceList}>
          <FlatList
            data={competences}
            renderItem={renderCompetence}
            keyExtractor={(item) => item.id.toString()}
            ListHeaderComponent={
              <View style={styles.header}>
                <Text style={styles.title}>Competenties</Text>
              </View>
            }
          />
        </View>
      </View>
      <View style={styles.lowerContainer}>
        <ScrollView>{resultSection()}</ScrollView>
      </View>

      <View style={styles.buttons}>
        <Button
          text="Diploma Uitlezen"
          onPress={() => checkDiploma()}
          theme="secondary"
        />

        <Button
          text="Opslaan"
          onPress={() => {
            saveDiploma();
          }}
          theme="primary"
        />
      </View>
    </View>
  );
};
