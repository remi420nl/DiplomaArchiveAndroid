import React from "react";
import { Alert } from "react-native";

//Alert popup 

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
