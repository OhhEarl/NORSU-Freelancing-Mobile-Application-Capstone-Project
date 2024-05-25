import React, { useState, useEffect } from "react";
import AppNavigation from "./navigation/AppNavigation";
import { useGetIsStudent } from "./hooks/dataHooks/useGetIsStudent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NoConnection from "./components/NoConnection";
import Echo from "laravel-echo";
import Pusher from "pusher-js/react-native";
import { Alert } from "react-native";
import { NetInfoCellularGeneration } from "@react-native-community/netinfo";

//
//SHA1: 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
// SHA1: 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
// WEbClientID: 1070570385371-oki1o1e7h9mph2qnk0evo7l22k80683c.apps.googleusercontent.com

export default function App() {
  // const [token, setToken] = useState(null);
  // const getToken = async () => {
  //   try {
  //     const userInfo = await AsyncStorage.getItem("userInformation");
  //     const parsedUserInfo = JSON.parse(userInfo);
  //     const token = parsedUserInfo?.token;
  //     if (token) {
  //       await setToken(token);
  //     }
  //   } catch (error) {
  //     setError(error.message);
  //   }
  // };
  // useEffect(() => {
  //   getToken();
  // }, []);

  // console.log(token);
  return <AppNavigation />;
}
