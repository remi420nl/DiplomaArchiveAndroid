import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableHighlight,
  Pressable,
  FlatList,
  ScrollView,
} from "react-native";
import { GetAllExemptions, GetApprovedExemptions } from "../../../api/Api";
import { useAuth } from "../../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../assets/constants";

export default ({ route }) => {
  const [loading, setLoading] = useState(true);
  const [approved, setApproved] = useState([]);
  const [error, setError] = useState(null);

  const { token } = route.params;

  useEffect(() => {
    GetApprovedExemptions(token)
      .then(({ data }) => {
        setApproved(data.approved);
        setLoading(false);
      })
      .catch((e) => console.log(e));
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    item: {
      alignItems: "center",
      flexDirection: "row",
      margin: 5,
      backgroundColor: COLORS.primary,
      borderRadius: 10,
      paddingHorizontal: 15,
      paddingVertical: 6,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5,
      shadowRadius: 2,
      elevation: 2,
    },
    itemText: {
      marginLeft: 10,
      fontSize: 24,
      textTransform: "uppercase",
      color: COLORS.white,
      fontWeight: "bold",
      letterSpacing: 2,
    },
  });

  return (
    <View style={styles.container}>
      <View>
        <Text>Toegewezen vrijstellingen</Text>
      </View>
      <ScrollView contentContainerStyle={{ flex: 1, justifyContent: "center" }}>
        {loading && <Text>Laden..</Text>}
        {approved.map((course, i) => (
          <View style={styles.item} key={i}>
            <Ionicons name="checkmark-done-sharp" size={38} color="#9AF000" />
            <Text style={styles.itemText}>{course}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
