import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Pressable,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  GetCompetences,
  GetAllCompetences,
  UpdateDiploma,
  CheckKeywordsDiploma,
} from "../../../api/Api";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/Button";
import Card from "../../components/Card";
import { COLORS } from "../../assets/constants";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    width: "100%",
  },

  upperContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  lowerContainer: {
    height: 60,
  },

  keywords: {
    borderRightWidth: 3,
    borderColor: COLORS.darkgray,
    paddingHorizontal: 25,
  },
  competenceList: {
    paddingHorizontal: 35,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  button: {},
});

export default ({ navigation, route }) => {
  const [competences, setCompetences] = useState(null);
  const [keywordsFound, setKeywordsFound] = useState(null);
  const [selectedCompetences, setSelectendCompetences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState(null);

  const { diplomaId } = route.params;

  const { token } = useAuth();

  useEffect(() => {
    fetchCompetences();
  }, []);

  const fetchCompetences = () => {
    GetAllCompetences(token)
      .then(({ data }) => {
        setCompetences(
          data.sort((a, b) =>
            a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1
          )
        );
        setLoading(false);
      })
      .catch((e) => console.log(e));
  };

  const checkDiploma = () => {
    CheckKeywordsDiploma(token, diplomaId)
      .then(({ data: { keywords, matches } }) => {
        setMatches(matches);
        setMatchesForCompetence(matches);
        console.log(keywords);
      })

      .catch((e) => console.log(e));
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
        <Text>{item.name}</Text>
      </Card>
    </Pressable>
  );

  const renderCompetence = ({ item }) => {
    return (
      <Pressable
        style={[styles.list]}
        onLongPress={() =>
          setSelectendCompetences((state) => [...state, item.id])
        }
      >
        <Card
          customStyle={{
            backgroundColor:
              selectedCompetences.indexOf(item.id) !== -1
                ? COLORS.darkgreen
                : COLORS.white,
            borderColor: item.match ? COLORS.red : null,
            borderWidth: item.match ? 5 : null,
          }}
        >
          <Text>{item.name}</Text>
        </Card>
      </Pressable>
    );
  };

  const resultSection = () => {
    if (matches) {
      return (
        <View>
          <Text>Totaal gematchte trefwoorden: {matches.length}</Text>
          <Text>In compentie(s):</Text>
          {competences.map((c) => c.match && <Text>{c.name}</Text>)}
        </View>
      );
    } else {
      return <Text>Klik hieronder</Text>;
    }
  };

  const saveDiploma = () => {
    UpdateDiploma(token, diplomaId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.upperContainer}>
        <View style={styles.keywords}>
          <FlatList
            data={matches}
            renderItem={renderKeyword}
            keyExtractor={(item, i) => i.toString()}
          />
        </View>
        <View style={styles.competenceList}>
          <FlatList
            data={competences}
            renderItem={renderCompetence}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      </View>
      <View style={styles.lowerContainer}>{resultSection()}</View>
      <View style={styles.buttons}>
        <Button
          text="Diploma Uitlezen"
          onPress={() => checkDiploma()}
          theme="secondary"
        />

        <Button
          text="Opslaan"
          onPress={() => {
            console.log(keywords);
            saveDiploma;
          }}
          theme="primary"
        />
      </View>
    </View>
  );
};
