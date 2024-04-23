import React from "react";
import { StyleSheet, View, Text, Image, SafeAreaView } from "react-native";

const VerificationConfirmation = ({ navigation }) => {
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
            of Negros Oriental State University (NORSU) Dumaguete City.
          </Text>
          <Text style={styles.secondParagraphHeader}>
            Your information has been submitted, and it is currently being
            reviewed.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default VerificationConfirmation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  content: {
    paddingHorizontal: 30,
  },
  header: {
    textAlign: "center",
    fontFamily: "Roboto-Bold",
    fontSize: 20,
    color: "black",
  },
  firstParagraphHeader: {
    marginVertical: 24,
  },
  firstParagraph: {
    textAlign: "center",
    marginBottom: 24,
    fontSize: 18,
    fontFamily: "Roboto-Regular",
  },
  secondParagraphHeader: {
    textAlign: "center",
    marginBottom: 24,
    fontSize: 18,
    fontFamily: "Roboto-Regular",
  },
});
