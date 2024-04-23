import React, { useState, useEffect } from "react";
import AppNavigation from "./navigation/AppNavigation";
import { useGetIsStudent } from "./hooks/dataHooks/useGetIsStudent";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import NetInfo from "@react-native-community/netinfo";
//SHA1: 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
// SHA1: 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
// WEbClientID: 1070570385371-oki1o1e7h9mph2qnk0evo7l22k80683c.apps.googleusercontent.com
export default function App() {
  // const [isConnected, setIsConnected] = useState(true); // Initial state set to true

  // useEffect(() => {
  //   // Subscribe to network state changes
  //   const unsubscribe = NetInfo.addEventListener(state => {
  //     setIsConnected(state.isConnected);
  //   });

  //   // Cleanup subscription on unmount
  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);

  // // Render No Connection screen if not connected
  // if (!isConnected) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <Text>No Connection</Text>
  //     </View>
  //   );
  // }
  return <AppNavigation />;
}
