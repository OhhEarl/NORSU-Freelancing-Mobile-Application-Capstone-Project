import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useState, useEffect, React } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "../components/Button";
import { useIsFocused } from "@react-navigation/native";
import { COLORS, UTILITIES } from "../assets/constants/index";
import { useAuthContext } from "../hooks/AuthContext";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const isFocused = useIsFocused();
  const {
    error,
    onGoogleButtonPress,
    handleSignIn,
    setEmailLogin,
    setPasswordLogin,
  } = useAuthContext(); // Access

  useEffect(() => {
    if (!isFocused) {
      setEmail("");
      setPassword("");
    }
  }, [isFocused]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ flex: 1, marginHorizontal: 22, justifyContent: "center" }}>
        <View style={{ marginVertical: 22 }}>
          <Text
            style={{
              fontSize: 24,
              marginVertical: 12,
              color: COLORS.black,
              fontFamily: "Roboto-Bold",
            }}
          >
            Hi Welcome Back ! 👋
          </Text>

          <Text
            style={{
              fontSize: 16,
              color: COLORS.black,
              fontFamily: "Roboto-Regular",
            }}
          >
            Hello again you have been missed!
          </Text>
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text style={UTILITIES.title}>Email address</Text>

          <View>
            <TextInput
              placeholder="Enter your email address"
              placeholderTextColor={COLORS.black}
              keyboardType="email-address"
              onChangeText={(text) => {
                setEmail(text); // Update local state
                setEmailLogin(text);
              }}
              value={email}
              autoCapitalize="none"
              style={UTILITIES.inputField}
            />
          </View>
        </View>

        <View style={{ marginBottom: 18, marginTop: 18 }}>
          <Text style={UTILITIES.title}>Password</Text>

          <View>
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor={COLORS.black}
              onChangeText={(text) => {
                setPassword(text); // Update local state
                setPasswordLogin(text);
              }}
              value={password}
              style={UTILITIES.inputField}
            />

            {/* <TouchableOpacity
                    onPress={() => setIsPasswordShown(!isPasswordShown)}
                    style={{
                        position: "absolute",
                        right: 12
                    }}
                >
                    {
                        isPasswordShown == true ? (
                            <Ionicons name="eye-off" size={24} color={COLORS.black} />
                        ) : (
                            <Ionicons name="eye" size={24} color={COLORS.black} />
                        )
                    }

                </TouchableOpacity> */}
          </View>

          {error && (
            <Text
              style={{
                fontSize: 14,
                fontWeight: 400,
                marginVertical: 8,
                color: "red",
                marginLeft: 3,
              }}
            >
              {error}
            </Text>
          )}
        </View>

        {/* <View style={{
            flexDirection: 'row',
            marginVertical: 6
        }}>
            <Checkbox
                style={{ marginRight: 8 }}
                value={isChecked}
                onValueChange={setIsChecked}
                color={isChecked ? COLORS.primary : undefined}
            />

            <Text>Remenber Me</Text>
        </View> */}

        <Button
          onPress={handleSignIn}
          title="Login"
          filled
          style={{
            marginTop: 18,
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
              color: COLORS.black,
              fontFamily: "Roboto-Regular",
            }}
          >
            Don't have an account?
          </Text>
          <Pressable onPress={() => navigation.navigate("Signup")}>
            <Text
              style={{
                fontSize: 16,
                color: COLORS.primary,

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
  indicator: {
    flex: 1,
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
