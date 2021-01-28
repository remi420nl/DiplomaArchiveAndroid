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
import { RegisterGroups } from "../../../api/Api";

const fields = [
  { key: "A", student: "Student", course: "Programming", approved: true },
  {
    key: "B",
    student: "Student Twee",
    course: "ProgrammingBLaablaa",
    approved: true,
  },
  {
    key: "C",
    student: "Student Drie",
    course: "Programming ggggggggggggggggggggggggggggggggggg",
    approved: true,
  },
  {
    key: "D",
    student: "Student Vier",
    course: "Programming BLabla",
    approved: true,
  },

  // { key: 'K' },
  // { key: 'L' },
];

export default () => {
  const [data, setData] = useState(fields);
  const [width, setWidth] = useState({});
  const widthBox = useRef();
  const widthText = useRef();

  const refs = useRef([]);

  useEffect(() => {
    if (refs.current.length !== data.length) {
      refs.current = Array(data.length)
        .fill()
        .map((e, i) => refs.current[i] || createRef());
    }
  });

  const setHyphen = (index, value) => {
    const key = Object.keys(value)[0];
    value = value[key];

    refs.current[index] = { ...refs.current[index], [key]: value };
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginVertical: 20,
    },
    item: {
      opacity: 0.7,
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      margin: 2,
      height: Dimensions.get("window").width / 4, // approximate a square
    },
    itemInvisible: {
      backgroundColor: "transparent",
    },
    itemText: {
      fontSize: 10,
      color: "#fff",
      fontWeight: "bold",
      letterSpacing: 1.4,
      flexShrink: 1,
    },
  });

  const formatData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);
  };

  const renderItem = ({ item, index }) => {
    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }

    return (
      <Pressable
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;
          setHyphen(index, { box: width });
        }}
        onLongPress={() => console.log(refs.current[index])}
        style={[
          styles.item,
          { backgroundColor: item.approved ? "green" : "darkred" },
        ]}
      >
        <Text
          style={styles.itemText}
          onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            setHyphen(index, { student: width });
          }}
        >
          {item.student}
        </Text>
        <Text
          onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            setHyphen(index, { course: width });
          }}
          style={styles.itemText}
        >
          {item.course}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.table}>
      {data && <FlatList data={data} numColumns={3} renderItem={renderItem} />}
    </View>
  );
};
