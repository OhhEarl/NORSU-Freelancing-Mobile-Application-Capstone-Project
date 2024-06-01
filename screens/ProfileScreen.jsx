import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
  Switch,
  ScrollView,
} from "react-native";

import AntDesign from "react-native-vector-icons/AntDesign";
import { AirbnbRating, Rating } from "react-native-ratings";
import { COLORS } from "../assets/constants/index";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthContext } from "../hooks/AuthContext";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { URL } from "@env";
import auth from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as theme from "../assets/constants/theme";
import LoadingComponent from "../components/LoadingComponent";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";

const ProfileScreen = ({ navigation, route }) => {
  const { isStudent, fetchIsStudent } = useAuthContext();
  const [isOnline, setIsOnline] = useState(isStudent?.studentInfo?.is_online);

  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const baseUrlWithoutApi = URL.replace("/api", "");
  const rating = isStudent.studentInfo.student_rating
    ? parseFloat(isStudent.studentInfo.student_rating)
    : 0;

  useEffect(() => {
    setIsOnline(isStudent?.studentInfo?.is_online);
  });

  const signOut = async () => {
    try {
      setLoading(true);
      let url = `${URL}/google-callback/auth/google-signout`;
      let response = await axios.post(url, isStudent?.token, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${isStudent?.token}`,
        },
      });
      if (response.status === 200) {
        AsyncStorage.removeItem("userInformation");
        GoogleSignin.signOut();
        auth().signOut();
      }
    } catch (error) {
      Alert.alert("Something Went Wrong. Logout Failed.");
    } finally {
      setLoading(false);
    }
  };

  const confirmToggle = () => {
    Alert.alert(
      "Confirm Status Change",
      `Are you sure you want to change your status to ${
        isOnline ? "Available" : "Unavailable"
      }?`,
      [
        {
          text: "Cancel",

          style: "cancel",
        },
        { text: "OK", onPress: handleToggle },
      ]
    );
  };

  const handleToggle = async () => {
    try {
      const response = await axios.post(
        `${URL}/user/status`,
        { is_online: !isOnline, id: isStudent.studentInfo.id },
        {
          headers: {
            Authorization: `Bearer ${isStudent?.token}`, // Use appropriate auth mechanism
          },
        }
      );
      setIsOnline(!isOnline);
      if (response.status === 200) {
        await fetchIsStudent();
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "SUCCESS",
          textBody: "Status updated successfully.",
          button: "Close",
        });
      }
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "ERROR",
        textBody: "Something Went Wrong Please Try Again.",
        button: "Close",
      });
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {loading ? (
          <LoadingComponent />
        ) : (
          <>
            <View style={styles.innerContainer}>
              <Image
                style={styles.image}
                source={
                  isStudent.studentInfo.user_avatar
                    ? {
                        uri: `${baseUrlWithoutApi}/storage/${isStudent?.studentInfo?.user_avatar}`,
                      }
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

              <AirbnbRating
                type="star"
                defaultRating={rating}
                size={20}
                isDisabled={true}
                showRating={false}
              />
            </View>

            <View style={styles.anotherContainer}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("ProjectCreated", {
                    token: isStudent?.token,
                    id: isStudent?.studentInfo?.id,
                  })
                }
              >
                <View style={styles.seperateContainer}>
                  <Text style={styles.seperateText}>Projects Created</Text>
                  <AntDesign name="arrowright" size={20} color="black" />
                </View>
              </TouchableOpacity>

              {/* Projects Applied */}

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("ProposalSubmitted", {
                    user: isStudent?.studentInfo,
                    token: isStudent?.token,
                    id: isStudent?.studentInfo?.id,
                  })
                }
              >
                <View style={styles.seperateContainer}>
                  <Text style={styles.seperateText}>Projects Applied</Text>
                  <AntDesign name="arrowright" size={20} color="black" />
                </View>
              </TouchableOpacity>

              {/* ProposalSubmitted */}
              <TouchableOpacity
                onPress={() => navigation.navigate("ProposalSubmittedScreen")}
              >
                <View style={styles.seperateContainer}>
                  <Text style={styles.seperateText}>Proposals Submitted</Text>
                  <AntDesign name="arrowright" size={20} color="black" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("ProposalRequestedScreen")}
              >
                <View style={styles.seperateContainer}>
                  <Text style={styles.seperateText}>Proposals Requested</Text>
                  <AntDesign name="arrowright" size={20} color="black" />
                </View>
              </TouchableOpacity>

              {/* Edit PRofile */}

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("EditProfileScreen", {
                    project: isStudent?.studentInfo,
                    token: isStudent?.token,
                  })
                }
              >
                <View style={styles.seperateContainer}>
                  <Text style={styles.seperateText}>Edit Profile</Text>
                  <AntDesign name="arrowright" size={20} color="black" />
                </View>
              </TouchableOpacity>

              {/* Terms and Conditions  */}

              <TouchableOpacity
                onPress={() => navigation.navigate("TermsAndConditions")}
              >
                <View style={styles.seperateContainer}>
                  <Text style={[styles.seperateText, { width: "90%" }]}>
                    Terms and Conditions And Privacy Policy
                  </Text>
                  <AntDesign name="arrowright" size={20} color="black" />
                </View>
              </TouchableOpacity>

              {/* Status */}

              <View>
                <View style={styles.seperateContainer}>
                  <Text style={[styles.seperateText, { width: "90%" }]}>
                    Status
                  </Text>
                  <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={isOnline ? "#f5dd4b" : "#f4f3f4"}
                    onValueChange={confirmToggle}
                    value={isOnline === 1 ? true : false}
                    style={{ width: "10%" }}
                  />
                </View>
              </View>

              {/* Logout */}
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
                    <TouchableOpacity
                      onPress={() => {
                        signOut;
                      }}
                      style={styles.logout}
                    >
                      <Text style={styles.logoutText}>Yes</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
          </>
        )}
      </ScrollView>
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
    marginTop: 20,
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
    color: "#008DDA",
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
    padding: 15,
    borderRadius: 5,
    borderColor: theme.colors.gray,
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
