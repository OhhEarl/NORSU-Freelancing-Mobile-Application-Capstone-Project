import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useState, useEffect, React } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as theme from "../assets/constants/theme";
import Button from "../components/Button";
import { useIsFocused } from "@react-navigation/native";
import { COLORS } from "../assets/constants/index";
import { useAuthContext } from "../hooks/AuthContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import LottieView from "lottie-react-native";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPasswordShown, setIsPasswordShown] = useState(true);

  const {
    error,
    setError,
    onGoogleButtonPress,
    handleSignIn,

    isLoading,
  } = useAuthContext();

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    } else {
      setErrorMessage(null);
    }
  }, [error]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignInWithValidation = () => {
    if (email || password) {
      handleSignIn(email, password);
    } else if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
    } else {
      setErrorMessage("Please enter both email and password.");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setError(null);
    }, 8000);
    return () => {
      clearTimeout(timer);
    };
  }, [isLoading]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ flex: 1, marginHorizontal: 22, justifyContent: "center" }}>
        <View style={{ marginVertical: 22 }}>
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
              fontSize: 24,
              marginVertical: 12,

              color: theme.colors.BLACKS,
              fontFamily: "Roboto-Bold",
            }}
          >
            Hi Welcome Back!
          </Text>

          <Text
            style={{
              fontSize: 16,
              color: theme.colors.BLACKS,
              fontFamily: "Roboto-Bold",
            }}
          >
            You have been missed!
          </Text>
        </View>

        <View style={theme.utilities.inputContainer}>
          <Text style={theme.utilities.title}>Email</Text>
          <TextInput
            placeholder="enter your email address"
            placeholderTextColor={COLORS.black}
            keyboardType="email-address"
            onChangeText={(text) => {
              setEmail(text);
            }}
            value={email}
            autoCapitalize="none"
            style={[theme.utilities.inputField, { height: 50 }]}
          />
        </View>

        <View style={theme.utilities.inputContainer}>
          <Text style={theme.utilities.title}>Password</Text>
          <TextInput
            placeholder="enter your password"
            placeholderTextColor={COLORS.black}
            onChangeText={(text) => {
              setPassword(text); // Update local state
            }}
            value={password}
            style={[theme.utilities.inputField, { height: 50 }]}
            secureTextEntry={isPasswordShown}
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

        {errorMessage || error ? (
          <Text style={{ color: "red", marginTop: 2, marginLeft: 5 }}>
            {errorMessage || error}
          </Text>
        ) : (
          <Text> </Text>
        )}

        <Button
          onPress={handleSignInWithValidation}
          title="Login"
          filled
          style={{
            marginTop: 50,
            marginBottom: 4,
          }}
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 20,
          }}
        >
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: COLORS.grey,
              marginHorizontal: 10,
            }}
          />
          <Text style={{ fontSize: 14 }}>Or Login with</Text>
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: COLORS.grey,
              marginHorizontal: 10,
            }}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            onPress={onGoogleButtonPress}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              height: 60,
              borderWidth: 2,
              borderColor: COLORS.grey,
              marginRight: 4,
              borderRadius: 10,
            }}
          >
            <Image
              source={require("../assets/google.png")}
              style={{
                height: 36,
                width: 36,
                marginRight: 8,
              }}
              resizeMode="contain"
            />

            <Text style={{ fontSize: 18, fontWeight: "500", color: "#696969" }}>
              Login with Google
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginVertical: 22,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: theme.colors.BLACKS,
              fontFamily: "Roboto-Regular",
            }}
          >
            Don't have an account?
          </Text>
          <Pressable onPress={() => navigation.navigate("Signup")}>
            <Text
              style={{
                fontSize: 16,
                color: theme.colors.primary,

                marginLeft: 6,
                textDecorationLine: "underline",
                fontFamily: "Roboto-Bold",
              }}
            >
              Register
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
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
  },
});
