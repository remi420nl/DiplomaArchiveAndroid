import React from "react";
import { View, Text, Alert } from "react-native";

export default () =>
  Alert.alert(
    "Diploma Archive Android",
    "2021 Remi Peerlings",

    [
      {
        text: "Verbergen",
        style: "cancel",
      },
    ],
    { cancelable: true }
  );
