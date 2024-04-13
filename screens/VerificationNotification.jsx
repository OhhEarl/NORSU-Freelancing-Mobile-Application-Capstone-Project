import { View, Text, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import { React } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const VerificationNotification = ({ navigation }) => {
  const removeData = async () => {
    try {
      const data = await AsyncStorage.getItem("userInformation");
      console.log("the data is ", data);
    } catch (error) {
      console.error("Error removing datas:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <Image
            source={require("../assets/images/norsu-logo.png")}
            style={{
              height: 140,
              width: 140,
            }}
          />
        </View>

        <View>
          <Text style={styles.header}>
            We need to verify your identification
          </Text>
        </View>

        <View style={styles.firstParagraphHeader}>
          <Text style={styles.firstParagraph}>
            In order to proceed, we need to be 100% sure that you are a student
            of Negros Oriental State University (NORSU), Dumaguete City.
          </Text>
          <Text style={styles.secondParagraphHeader}>
            You just need to fill up some information which will help us to
            build a secure system together.
          </Text>
        </View>

        <View
          style={{
            position: "absolute",
            bottom: 35,
            width: "100%",
          }}
        >
          <Button
            title="Verify"
            onPress={() => navigation.navigate("MultiStepForm")}
            filled
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default VerificationNotification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    marginTop: -130,
  },
  header: {
    textAlign: "center",
    fontWeight: "500",
    fontSize: 20,
    color: "#0d0a0b",
    fontFamily: "Roboto-Bold",
  },
  firstParagraphHeader: {
    marginVertical: 24,
  },
  firstParagraph: {
    textAlign: "center",
    marginBottom: 24,
    fontSize: 16,
    fontFamily: "Roboto-Medium",
    color: "black",
  },
  secondParagraphHeader: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Roboto-Medium",
    color: "black",
  },
});
