import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableHighlight,
  Pressable,
  FlatList,
  Dimensions,
} from "react-native";
// import { Drizzle, generateStore } from "drizzle";
// import "./shims";
//  import ExemptionStore from '../../../../blockhain/build/contracts/Exemptions.json';
// const options = {
//     contracts: [ExemptionStore]
//   };

export default () => {
  const [loading, setLoading] = useState(false);
 const [state ,setState] = useState(null);
const [drizzleState, setDrizzleState] = useState(null);

//   useEffect(() => {
//     const drizzleStore = generateStore(options);
//     const drizzle = new Drizzle(options, drizzleStore);
//     setDrizzleState(drizzle);

//     const unsubscribe = drizzle.store.subscribe(() => {
//         const drizzleState = drizzle.store.getState();
  
//         if (drizzleState.drizzleStatus.initialized) {
//           setLoading(false);
//         setState(drizzleState);
//         }
//       });

//       return () => unsubscribe;
//   }, []);


// const test = () => {


//     const contract = drizzleState.contracts.Exemptions;
//     const dataKey = contract.methods["exemptions"].cacheCall();

//     const { Exemptions } = state.contracts;

//     console.log(Exemptions)

//     const testtt = MyStringStore.Exemptions[dataKey];

//     console.log(testtt)
// }

  return (
    <View>
      {loading && <Text>Laden..</Text>}

    </View>
  );
};
