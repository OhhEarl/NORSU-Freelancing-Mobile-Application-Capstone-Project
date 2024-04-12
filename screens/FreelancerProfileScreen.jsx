import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";

import Feather from "react-native-vector-icons/Feather";
import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { COLORS, UTILITIES } from "../assets/constants/index";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthContext } from "../hooks/AuthContext";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useGetIsStudent } from "../hooks/dataHooks/useGetIsStudent";
import auth from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as theme from "../assets/constants/theme";

const PortfolioScreen = () => (
  <View>
    <Text>Portfolio Screen</Text>
  </View>
);

const ResumeScreen = ({ isStudent }) => (
  <View>
    <Text>{isStudent.studentInfo?.first_name}</Text>
  </View>
);

const FreelancerProfileScreen = ({ navigation }) => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "portfolio", title: "Portfolio" },
    { key: "resume", title: "Resume" },
  ]);
  const [error, loading, isStudent] = useGetIsStudent();
  const { userData, setUserData, isLoading } = useAuthContext();
  console.log(isStudent);
  const renderScene = ({ route }) => {
    switch (route.key) {
      case "portfolio":
        return <PortfolioScreen />;
      case "resume":
        return <ResumeScreen isStudent={isStudent} />;
      default:
        return null;
    }
  };
  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      await auth().signOut();
      let url = "http://10.0.2.2:8000/api/google-callback/auth/google-signout";
      let response = await axios.post(url, isStudent?.token, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${isStudent?.token}`,
        },
      });

      if ((response.status = 200)) {
        await AsyncStorage.removeItem("userInformation");
        await setUserData(null);
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.logoutContainer}>
        <Feather
          name="arrow-left"
          size={24}
          color={COLORS.black}
          onPress={() => {
            navigation.goBack();
          }}
        />

        <TouchableOpacity onPress={signOut}>
          <View style={styles.log}>
            <Entypo
              name="log-out"
              size={20}
              color="white"
              style={{ alignSelf: "center", marginLeft: 5 }}
            />
            <Text style={styles.logout}>LOGOUT</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.innerContainer}>
        <Image
          style={styles.image}
          source={
            isStudent?.studentInfo?.user_avatar
              ? { uri: isStudent?.studentInfo?.user_avatar }
              : {
                  uri: "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?w=740&t=st=1670148608~exp=1670149208~hmac=bc57b66d67d2b9f4929c8e592ff17e8c8660721608add2f18fc20d19c1aab7e4",
                }
          }
        />

        <Text style={styles.userText}>
          {isStudent?.studentInfo?.first_name +
            " " +
            isStudent?.studentInfo?.last_name}
        </Text>
        <Text style={styles.course}>{isStudent?.course}</Text>
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            style={{ backgroundColor: "white" }}
            inactiveColor={"black"}
            activeColor={"black"}
            indicatorStyle={{ backgroundColor: theme.colors.primary }}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default FreelancerProfileScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    padding: 24,
  },
  container: {
    paddingHorizontal: 24,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover", // or 'stretch' or 'contain'
    justifyContent: "center",
  },
  image: {
    height: 80,
    width: 80,
    borderRadius: 70,
    borderWidth: 1,
    marginBottom: 10,
  },
  innerContainer: {
    marginHorizontal: 30,
    alignItems: "center",
  },

  course: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Roboto-Medium",
    color: COLORS.primary,
  },

  textField: {
    fontFamily: "Raleway-Medium",
    fontSize: 16,
    color: "black",
  },

  userText: {
    marginHorizontal: 50,
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },

  logoutContainer: {
    flexDirection: "row",
    justifyContent: "space-between",

    paddingBottom: 24,
    alignItems: "center",
  },
  log: {
    flexDirection: "row",
    alignSelf: "center", // Center the button horizontally
    borderRadius: 50,
    borderColor: "#D6E6FF",
    padding: 6,
    backgroundColor: COLORS.primary,
  },
  logout: {
    margin: 5,
    color: COLORS.white,
    fontWeight: "600",
  },
  seperateContainer: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 3,
    paddingStart: 15,
    borderRadius: 10,
    elevation: 3,
    marginTop: 15,
    alignItems: "center",
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },

  seperateText: {
    margin: 18,
    fontSize: 18,
    fontFamily: "ProximaNova-Bold",
    color: "#212121",
  },
});
