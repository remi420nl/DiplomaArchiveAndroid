import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableHighlight,
} from "react-native";
import { COLORS } from "../../assets/constants";

// Used for competence comparison to render a flatlist

const Box = ({ data, horizontal, onPress, colums }) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginVertical: 20,
    },
    scrollView: {
      flex: 1,
      justifyContent: "space-around",
    },
    itemText: {
      fontSize: 22,
      color: COLORS.white,
      textTransform: "uppercase",
      fontWeight: "bold",
      letterSpacing: 1.4,
      flexShrink: 1,
    },
    item: {
      padding: 5,
      opacity: 0.7,
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      margin: 2,
      height: 100,
      minWidth: 120,
    },
    header: {
      alignItems: "center",
      marginVertical: 20,
    },
    headerText: {
      fontFamily: "Roboto-Bold",
      fontSize: 24,
      letterSpacing: -1,
    },
  });

  const renderItem = ({ item }) => (
    <TouchableHighlight
      onLongPress={() => onPress(item)}
      style={{
        ...styles.item,
        backgroundColor: item.match ? "green" : "#009B77",
      }}
    >
      <Text style={styles.itemText}>{item.name}</Text>
    </TouchableHighlight>
  );

  return (
    <View>
      <FlatList
        horizontal={horizontal}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={colums}
      />
    </View>
  );
};

export default React.memo(Box);
