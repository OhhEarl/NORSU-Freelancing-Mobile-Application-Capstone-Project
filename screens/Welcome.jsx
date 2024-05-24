import { View, Text, Image } from "react-native";
import React from "react";
import LinearGradient from "react-native-linear-gradient";
import * as theme from "../assets/constants/theme";
import Button from "../components/Button";

const Welcome = ({ navigation }) => {
  return (
    <LinearGradient
      style={{
        flex: 1,
      }}
      colors={[theme.colors.secondary, theme.colors.primary]}
    >
      <View style={{ flex: 1 }}>
        <View style={{ justifyContent: "center" }}>
          <Image
            source={require("../assets/welcome.png")}
            style={{
              height: 400,
              width: 400,
              borderRadius: 20,
              position: "absolute",
              top: 20,
              left: -10,
            }}
          />
        </View>

        <View
          style={{
            paddingHorizontal: 25,
            position: "absolute",
            top: 370,
            width: "100%",
          }}
        >
          <Text
            style={{
              fontSize: 50,
              fontWeight: 800,
              color: theme.colors.WHITE,
            }}
          >
            Let's Get
          </Text>
          <Text
            style={{
              fontSize: 46,
              fontWeight: 800,
              color: theme.colors.WHITE,
            }}
          >
            Started
          </Text>

          <View style={{ marginVertical: 20 }}>
            <Text
              style={{
                fontSize: 20,
                color: theme.colors.WHITE,
                marginVertical: 4,
              }}
            >
              The Hustle Hub: Connect & Get Paid.
            </Text>
            <Text
              style={{
                fontSize: 20,
                color: theme.colors.WHITE,
              }}
            >
              Find the perfect freelancer, every time.
            </Text>
          </View>
        </View>
      </View>
      <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
        <Button
          title="Login"
          onPress={() => navigation.navigate("Login")}
          style={{
            width: "100%",
          }}
        />

        <Button
          title="Sign up"
          onPress={() => navigation.navigate("Signup")}
          style={{
            marginTop: 10,
            width: "100%",
            backgroundColor: "#ffe4c4",
          }}
        />
      </View>
    </LinearGradient>
  );
};

export default Welcome;
