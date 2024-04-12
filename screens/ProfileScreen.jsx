import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";

import Feather from "react-native-vector-icons/Feather";

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
import LoadingComponent from "../components/LoadingComponent";

const ProfileScreen = ({ navigation }) => {
  const [error, loading, isStudent] = useGetIsStudent();
  const { userData, setUserData, isLoading } = useAuthContext();
  const [modalVisible, setModalVisible] = useState(false);

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
      {loading ? (
        <LoadingComponent />
      ) : (
        <>
          <View>
            <Feather
              name="arrow-left"
              size={24}
              color={COLORS.black}
              onPress={() => {
                navigation.goBack();
              }}
            />
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
            <Text style={styles.areaExpertise}>
              {isStudent?.studentInfo?.area_of_expertise}
            </Text>
          </View>

          <View style={styles.anotherContainer}>
            <TouchableOpacity>
              <View style={styles.seperateContainer}>
                <Text style={styles.seperateText}>Projects Completed</Text>
                <AntDesign name="arrowright" size={20} color="black" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={styles.seperateContainer}>
                <Text style={styles.seperateText}>Proposals Submitted</Text>
                <AntDesign name="arrowright" size={20} color="black" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={styles.seperateContainer}>
                <Text style={styles.seperateText}>Accepted Proposals</Text>
                <AntDesign name="arrowright" size={20} color="black" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("EditProfileScreen", {
                  project: isStudent?.studentInfo,
                })
              }
            >
              <View style={styles.seperateContainer}>
                <Text style={styles.seperateText}>Edit Profile</Text>
                <AntDesign name="arrowright" size={20} color="black" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <View
                style={[
                  styles.seperateContainer,
                  { backgroundColor: theme.colors.primary, borderWidth: 0 },
                ]}
              >
                <Text style={[styles.seperateText, { color: "white" }]}>
                  Logout
                </Text>
                <AntDesign name="arrowright" size={20} color="white" />
              </View>
            </TouchableOpacity>
            <Modal
              animationType="fade "
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(!modalVisible);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <TouchableOpacity
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setModalVisible(!modalVisible)}
                  >
                    <AntDesign name={"closecircle"} size={30} />
                  </TouchableOpacity>
                  <Text style={styles.modalText}>
                    Are you Sure You Want To Logout?
                  </Text>
                  <TouchableOpacity onPress={signOut} style={styles.logout}>
                    <Text style={styles.logoutText}>Yes</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default ProfileScreen;

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
    height: 120,
    width: 120,
    borderRadius: 70,
    borderWidth: 1,
    marginBottom: 10,
  },
  innerContainer: {
    marginHorizontal: 30,
    alignItems: "center",
  },

  anotherContainer: {
    alignItems: "center",
    marginTop: 20,
  },

  areaExpertise: {
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

  seperateContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    borderColor: theme.colors.BLACKS,
    elevation: 3,
    borderWidth: 1,
    marginTop: 15,
    alignItems: "center",
  },
  seperateText: {
    fontSize: 18,
    fontFamily: "ProximaNova-Bold",
    color: "#212121",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    paddingVertical: 50,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: 300,
    height: 250,
  },

  button: {
    position: "absolute",
    right: 20,
    top: 20,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },

  modalText: {
    fontFamily: "Roboto-Medium",
    color: "black",
    fontSize: 18,
    marginBottom: 15,
    textAlign: "center",
    marginTop: 20,
  },
  logout: {
    width: "100%",
    backgroundColor: theme.colors.primary,
    padding: 15,
    marginTop: 20,
    borderRadius: 10,
  },
  logoutText: {
    fontFamily: "Roboto-Bold",
    color: "white",
    fontSize: 24,
    textAlign: "center",
  },
});
