import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { GetApprovedExemptions } from "../../../api/Api";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../assets/constants";
import { useHeaderHeight } from "@react-navigation/stack";

//Screen to show logged in student an overview of all approved exemptions which are stored on the blockchain and immutable

export default ({ route }) => {
  const [loading, setLoading] = useState(true);
  const [approved, setApproved] = useState([]);

  const { token } = route.params;

  useEffect(() => {
    GetApprovedExemptions(token)
      .then(({ data }) => {
        setApproved(data.approved);
        setLoading(false);
      })
      .catch((e) => console.log(e));
  }, []);

  const headerHeight = useHeaderHeight();

  const styles = StyleSheet.create({
    container: {
      paddingTop: headerHeight,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      marginTop: 25,
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

  const totalText = () => {
    let total = "";
    approved.length < 1 ? (total = "Geen") : (total = approved.length);
    return total;
  };

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text
          style={[
            styles.itemText,
            { color: COLORS.black, textAlign: "center" },
          ]}
        >{`${totalText()} toegewezen vrijstellingen`}</Text>
      </View>
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          justifyContent: "flex-start",
          marginTop: 30,
        }}
      >
        {loading && <Text>Vrijstellingen van blockchain laden..</Text>}
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
