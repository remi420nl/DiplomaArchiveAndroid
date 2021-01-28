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
  Button,
  TouchableHighlight,
  Pressable,
  FlatList,
  Dimensions,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { GetCompetences, RegisterGroups } from "../../../api/Api";
import { useAuth } from "../../context/AuthContext";

export default ({ navigation, route }) => {
  const [data, setData] = useState(null);

  const refs = useRef([]);

  const { student, course } = route.params;
  const { token } = useAuth();

  useEffect(() => {
    GetCompetences(token, student.id, course.id)
      .then(({ data }) => console.log(data))
      .catch((e) => console.log(e));
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginVertical: 20,
    },
  });

  return (
    <View style={styles.container}>
      <Text>competenties</Text>
    </View>
  );
};
