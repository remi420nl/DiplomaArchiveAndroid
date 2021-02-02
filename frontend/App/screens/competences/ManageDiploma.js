import React, {
  useEffect,
  useState,
  createRef,
  useRef,
  useCallback,
} from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { GetCompetences, RegisterGroups } from "../../../api/Api";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/Button";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  upperContainer: {
    flexGrow: 1,
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
    borderColor: "red",
    borderWidth: 3,
  },

  keywords: {
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderTopWidth: 2,
    paddingHorizontal: 25,
  },
  competenceList: {
    paddingHorizontal: 35,
  },
  buttons: {
    borderColor: "green",
    borderWidth: 5,
    flexDirection: "row",
    justifyContent: 'space-around',
    width: "100%",
  },
  button: {},
});

const c = [{ name: "comp1" }, { name: "comp2" }, { name: "comp2" }];

export default ({ navigation, route }) => {
  const [competences, setCompetences] = useState(c);

  return (
    <View style={styles.container}>
      <View style={styles.upperContainer}>
        <View style={styles.keywords}>
          <Text>java</Text>
          <Text>python</Text>
          <Text>bdgbrfvgre</Text>
          <Text>java</Text>
          <Text>python</Text>
          <Text>bdgbrfvgre</Text>
          <Text>java</Text>
          <Text>python</Text>
          <Text>bdgbrfvgre</Text>
          <Text>java</Text>
          <Text>python</Text>
          <Text>bdgbrfvgre</Text>
          <Text>java</Text>
          <Text>python</Text>
          <Text>bdgbrfvgre</Text>
          <Text>java</Text>
        </View>
        <View style={styles.competenceList}>
          {competences.map((c, i) => (
            <TouchableHighlight key={i}>
              <Text>{c.name}</Text>
            </TouchableHighlight>
          ))}
        </View>
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button}>
          <Button
            text="Diploma Uitlezen"
            onPress={() => {}}
            theme="secondary"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Button text="Opslaan" onPress={() => {}} theme="primary" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
