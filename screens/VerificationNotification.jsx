import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Buttons/Button";
import { React, useEffect, alert } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthContext } from "../hooks/AuthContext";

const VerificationNotification = ({ navigation }) => {
  const { userData, setUserData, isLoading } = useAuthContext();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const fetchUserData = await AsyncStorage.getItem("userInformation");
        if (fetchUserData !== null) {
          await setUserData(JSON.parse(fetchUserData));
        }
      } catch (error) {
        alert(error);
      }
    };

    loadUserData();
  }, []); // Empty dependency array for one-time data fetch

  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.indicator} />;
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
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
            You just need to fill up some information which will help us to
            build a secure system together
          </Text>
        </View>

        <View>
          <Button
            title="Verify"
            onPress={() =>
              navigation.navigate("VerificationScreen", { userID: userData })
            }
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  content: {
    paddingHorizontal: 30,
  },
  header: {
    textAlign: "center",
    fontWeight: "500",
    fontSize: 20,
    color: "#0d0a0b",
  },
  firstParagraphHeader: {
    marginVertical: 24,
  },
  firstParagraph: {
    textAlign: "center",
    marginBottom: 24,
    fontSize: 16,
  },
  secondParagraphHeader: {
    textAlign: "center",
    marginBottom: 24,
    fontSize: 16,
  },
});
