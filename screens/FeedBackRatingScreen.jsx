import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, ScrollView } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";
import * as theme from "../assets/constants/theme";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import LottieView from "lottie-react-native";
import { Rating } from "react-native-ratings";
import Button from "../components/Button";
import { URL } from "@env";
import axios from "axios";
import LoadingComponent from "../components/LoadingComponent";
const FeedBackRatingScreen = ({ navigation, route }) => {
  const { freelancer_id } = route.params;
  const { token } = route.params.isStudent;
  const [rating, setRating] = useState(0);
  const [feedBack, setFeedBack] = useState("");
  const [loading, setLoading] = useState(false);

  const submitRating = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${URL}/feedback`,
        {
          rating,
          user_id: freelancer_id,
          feedback: feedBack,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        await navigation.navigate("HomeScreen");
        await Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "SUCCESS",
          textBody: "Feedback submitted successfully.",
          button: "Close",
        });
      }
    } catch (error) {
      console.log(error);
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Something Went Wrong, Please Try again.",
        button: "Close",
      });
    } finally {
      setLoading(false);
      setRating(0);
      setFeedBack("");
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <AlertNotificationRoot style={styles.notification}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 18,
            paddingHorizontal: 18,
          }}
        >
          <Feather
            name="arrow-left"
            size={24}
            color={theme.colors.BLACKS}
            onPress={() => {
              navigation.navigate("ProfileScreen");
            }}
          />
          <Text
            style={{
              marginRight: 25,
              fontFamily: "Roboto-Medium",
              color: theme.colors.BLACKS,
              fontSize: 18,
            }}
          >
            Feedback
          </Text>
          <Text></Text>
        </View>
        {loading ? (
          <LoadingComponent />
        ) : (
          <ScrollView showVerticalScrollIndicator={false} style={{ flex: 1 }}>
            <>
              <View style={styles.container}>
                <LottieView
                  source={require("../assets/vIsAgoA7C2.json")}
                  autoPlay
                  loop
                  style={styles.lottie}
                  speed={1.5}
                />
                <Rating
                  type="star"
                  startingValue={0}
                  ratingCount={5}
                  imageSize={50}
                  onFinishRating={(value) => setRating(value)}
                  style={{ paddingVertical: 10 }}
                  showRating={true}
                />
                <View style={theme.utilities.inputContainer}>
                  <Text style={theme.utilities.title}>FeedBack</Text>
                  <TextInput
                    style={[theme.utilities.inputField, { height: 200 }]}
                    placeholderTextColor="#a9a9a9"
                    placeholder="Input feedback. "
                    type="text"
                    value={feedBack}
                    onChangeText={(text) => {
                      if (text?.length <= 300) {
                        setFeedBack(text);
                      }
                    }}
                    multiline
                    autoCorrect={false}
                    numberOfLines={6}
                    maxHeight={200}
                    maxLength={40}
                    textAlignVertical="top"
                  />
                  <View style={{ alignItems: "flex-end", marginRight: 5 }}>
                    <Text>{feedBack?.length} / 300</Text>
                  </View>
                </View>
              </View>
            </>
          </ScrollView>
        )}
      </AlertNotificationRoot>

      <View style={styles.applyNow}>
        {loading ? (
          <Text></Text>
        ) : (
          <Button
            title="Submit Rating"
            filled
            style={{ width: "100%", borderRadius: 10 }}
            onPress={submitRating}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default FeedBackRatingScreen;
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: theme.colors.WHITE,
  },
  container: {
    flex: 1,
    marginHorizontal: 24,
    justifyContent: "center",
    alignContent: "center",
  },

  lottie: {
    width: 300,
    height: 300,
    justifyContent: "center",
    alignSelf: "center",
  },

  applyNow: {
    position: "absolute",
    alignItems: "center",
    width: "100%",
    bottom: 0,
    paddingHorizontal: 20,
  },

  notification: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
});
