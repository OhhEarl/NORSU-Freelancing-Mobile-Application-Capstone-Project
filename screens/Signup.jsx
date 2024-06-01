import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import React, { useState, useEffect } from "react";

import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import * as theme from "../assets/constants/theme";
import auth from "@react-native-firebase/auth";
import Ionicons from "react-native-vector-icons/Ionicons";
import { COLORS } from "../assets/constants/index";
import LottieView from "lottie-react-native";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import LoadingComponent from "../components/LoadingComponent";
const Signup = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPasswordShown, setIsPasswordShown] = useState(true);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignupButtonClick = () => {
    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please enter both email and password.");
    } else if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
    } else if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
    } else {
      handleSignup();
    }
  };
  const handleSignup = async () => {
    try {
      setLoading(true);
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password
      );

      const user = userCredential.user;
      if (user && !user.emailVerified) {
        await user.sendEmailVerification();
        await Toast.show({
          type: ALERT_TYPE.WARNING,
          title: "WARNING",
          textBody: "Please verify your email before logging in.",
          button: "Close",
          autoClose: 10000,
        });
      }
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setErrorMessage("Email address is already in use!");
      } else if (error.code === "auth/invalid-email") {
        setErrorMessage("Email address is invalid!");
      } else {
        setErrorMessage(error.message); // Use error.message to display a human-readable error message
      }
    } finally {
      setEmail("");
      setPassword("");
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.red }}>
      <AlertNotificationRoot style={styles.notification}>
        {loading ? (
          <LoadingComponent />
        ) : (
          <View
            style={{ flex: 1, marginHorizontal: 22, justifyContent: "center" }}
          >
            <View>
              <View style={{ alignItems: "center" }}>
                <View style={styles.overlay}>
                  <LottieView
                    source={require("../assets/astronautAnimation.json")}
                    style={styles.lottie}
                    speed={2}
                    autoPlay
                    loop
                  />
                </View>
                <Text
                  style={{
                    fontSize: 35,
                    fontWeight: "bold",
                    marginVertical: 12,
                    color: theme.colors.BLACKS,
                  }}
                >
                  Create an account
                </Text>

                <Text
                  style={{
                    fontSize: 16,
                    color: theme.colors.BLACKS,
                  }}
                >
                  Get paid for passion!
                </Text>
              </View>

              <View style={theme.utilities.inputContainer}>
                <Text style={theme.utilities.title}>Email</Text>
                <TextInput
                  placeholder="enter your email address"
                  placeholderTextColor={COLORS.black}
                  onChangeText={(text) => setEmail(text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={[theme.utilities.inputField, { height: 50 }]}
                />
              </View>

              <View style={theme.utilities.inputContainer}>
                <Text style={theme.utilities.title}>Password</Text>
                <TextInput
                  placeholder="enter your password"
                  placeholderTextColor={COLORS.black}
                  onChangeText={(text) => setPassword(text)}
                  style={[theme.utilities.inputField, { height: 50 }]}
                  secureTextEntry={isPasswordShown}
                  value={password}
                />

                <TouchableOpacity
                  onPress={() => setIsPasswordShown(!isPasswordShown)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                  }}
                >
                  {isPasswordShown == true ? (
                    <Ionicons name="eye-off" size={24} color={COLORS.black} />
                  ) : (
                    <Ionicons name="eye" size={24} color={COLORS.black} />
                  )}
                </TouchableOpacity>
              </View>

              {errorMessage ? (
                <Text style={{ color: "red", marginTop: 2, marginLeft: 5 }}>
                  {errorMessage || error}
                </Text>
              ) : (
                <Text> </Text>
              )}

              <Button
                onPress={handleSignupButtonClick}
                title="Sign Up"
                filled
                style={{
                  marginTop: 18,
                  marginBottom: 4,
                }}
              />

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  marginVertical: 22,
                }}
              >
                <Text style={{ fontSize: 16, color: theme.colors.BLACKS }}>
                  Already have an account?
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("Login");
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: theme.colors.primary,
                      fontWeight: "bold",
                      marginLeft: 6,
                      textDecorationLine: "underline",
                    }}
                  >
                    Login
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </AlertNotificationRoot>
    </SafeAreaView>
  );
};

export default Signup;
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
  },
  lottie: {
    position: "absolute",
    right: -100,
    width: 300,
    height: 300,
    top: -170,
  },

  notification: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
});
