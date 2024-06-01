import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Alert,
} from "react-native";

import Feather from "react-native-vector-icons/Feather";

import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { COLORS } from "../assets/constants/index";
import { SafeAreaView } from "react-native-safe-area-context";
import * as theme from "../assets/constants/theme";
import { URL } from "@env";
import { Rating } from "react-native-ratings";
import LoadingComponent from "../components/LoadingComponent";
import axios from "axios";
import { usePeopleContext } from "../hooks/PeopleContext";
import dayjs from "dayjs";
import "dayjs/locale/en";
const PortfolioScreen = ({ portfolio }) => {
  return (
    <View style={styles.containerPortfolio}>
      <View style={styles.portfolioContainer}>
        {portfolio?.length > 0 ? (
          <>
            {portfolio?.map((image, index) => (
              <View key={index} style={styles.portfolioImageContainer}>
                <Image
                  source={{
                    uri: `${baseUrlWithoutApi}/storage/${image.student_portfolio_path}`,
                  }}
                  style={styles.portfolioImage}
                />
              </View>
            ))}
          </>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 250,
            }}
          >
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Image
                source={require("../assets/no-data-found.jpg")}
                style={{ height: 100, width: 100 }}
              />
              <Text
                style={{
                  fontFamily: "Roboto-Bold",
                  fontSize: 18,
                  color: "black",
                }}
              >
                NO PORTFOLIO ADDED
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  ); // Close the return statement
};
const ResumeScreen = ({ resume }) => (
  <ScrollView showsVerticalScrollIndicator={false}>
    <View style={styles.inputFieldContainer}>
      <View style={{ marginVertical: 6 }}>
        <Text style={styles.title}>Year Level</Text>
        <Text style={styles.content}>
          {resume?.year_level === 1
            ? "First Year"
            : resume?.year_level === 2
            ? "Second Year"
            : resume?.year_level === 3
            ? "Third Year"
            : resume?.year_level === 4
            ? "Fourth Year"
            : resume?.year_level === 5
            ? "Fifth Year"
            : "Unknown Year Level"}
        </Text>
      </View>
      <View style={{ marginVertical: 6 }}>
        <Text style={styles.title}>About Me</Text>
        <Text style={styles.content}>{resume?.about_me}</Text>
      </View>
      <View style={{ marginVertical: 6 }}>
        <Text style={styles.title}>Skill Tags</Text>
        <View style={styles.tagsContainer}>
          {resume?.student_skills?.map((tags, index) => (
            <Text key={index} style={styles.tags}>
              {tags?.student_skills}
            </Text>
          ))}
        </View>
      </View>
    </View>
  </ScrollView>
);

const FeedBackScreen = ({ feedback }) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.inputFieldContainer}>
        <View style={{ marginVertical: 6 }}>
          <Text style={styles.title}>Feedbacks</Text>
          {feedback?.feedback?.map((feedback, index) => (
            <View style={styles.feedBackContainer} key={index}>
              <Text style={styles.feedback}>{feedback.feedback}</Text>
              <Text style={styles.createdAt}>
                {dayjs(feedback.created_at).format("MMMM DD, YYYY")}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const FreelancerProfileScreen = ({ navigation, route }) => {
  const baseUrlWithoutApi = URL.replace("/api", "");
  const { peopleError, peopleLoading, peoples, fetchPeopleData } =
    usePeopleContext();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const { id } = route.params;
  const filteredProfile = peoples.filter((people) => people.id === id);

  const averageRating = filteredProfile?.average_rating
    ? parseFloat(averageRating?.average_rating)
    : 0;

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "portfolio":
        return (
          <PortfolioScreen portfolio={filteredProfile?.student_portfolio} />
        );
      case "resume":
        return <ResumeScreen resume={filteredProfile[0]} />;
      case "feedback":
        return <FeedBackScreen feedback={filteredProfile[0]} />;
      default:
        return null;
    }
  };

  const [routes] = useState([
    { key: "portfolio", title: "Portfolio" },
    { key: "resume", title: "Resume" },
    { key: "feedback", title: "FeedBack" },
  ]);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Feather
            name="arrow-left"
            size={24}
            color={theme.colors.BLACKS}
            onPress={() => {
              navigation.goBack();
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
            Freelancer Profile
          </Text>
          <Text></Text>
        </View>
        <View style={styles.innerContainer}>
          <View>
            <Image
              style={styles.image}
              source={
                filteredProfile[0]?.user_avatar
                  ? {
                      uri: `${baseUrlWithoutApi}/storage/${filteredProfile[0]?.user_avatar}`,
                    }
                  : {
                      uri: "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?w=740&t=st=1670148608~exp=1670149208~hmac=bc57b66d67d2b9f4929c8e592ff17e8c8660721608add2f18fc20d19c1aab7e4",
                    }
              }
            />
            {filteredProfile[0]?.is_online ? (
              <Text
                style={{
                  position: "relative",
                  top: -30,
                  right: -100,
                  color: "green",
                  fontFamily: "Roboto-Medium",
                }}
              >
                Available
              </Text>
            ) : (
              <Text
                style={{
                  position: "relative",
                  top: -30,
                  right: -100,
                  fontFamily: "Roboto-Medium",
                }}
              >
                Unavailable
              </Text>
            )}
          </View>

          <View style={{ marginTop: -25 }}>
            <Text style={styles.userText}>
              {filteredProfile?.[0]?.user_name}
            </Text>
            <Text style={styles.areaExpertise}>
              {filteredProfile?.[0]?.area_of_expertise}
            </Text>
            <Rating
              type="star"
              ratingCount={5}
              imageSize={18}
              style={{ marginTop: 4 }}
              readonly
              startingValue={averageRating}
              fractions={2} // Allows half-star ratings
            />

            {filteredProfile[0]?.is_online ? (
              <TouchableOpacity
                style={styles.hireMeContainer}
                onPress={() => {
                  navigation.navigate("CreateProjectScreenHire", {
                    freelancer_id: id,
                  });
                }}
              >
                <Text style={styles.hireMe}>HIRE ME</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.hireMeContainerOffline}>
                <Text style={styles.hireMe}>HIRE ME</Text>
              </View>
            )}
          </View>
        </View>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              style={{
                backgroundColor: "white",
                fontFamily: "Roboto-Medium",
                marginTop: 15,
              }}
              inactiveColor={"black"}
              activeColor={"black"}
              indicatorStyle={{ backgroundColor: theme.colors.primary }}
            />
          )}
        />
      </>
    </SafeAreaView>
  );
};

export default FreelancerProfileScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    padding: 24,
  },
  container: {
    paddingHorizontal: 24,
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
    marginTop: 20,
  },

  userText: {
    fontSize: 22,
    color: "black",
    fontFamily: "Roboto-Bold",
    maxWidth: 400,
    textAlign: "center",
  },

  inputFieldContainer: {
    marginVertical: 10,
    width: "100%",
    paddingHorizontal: 10,
    marginTop: 10,
  },

  containerPortfolio: {
    marginVertical: 10,
    width: "100%",
  },

  portfolioContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  portfolioImageContainer: {
    position: "relative",
    width: 110,
    height: 110,
    marginHorizontal: 2,
    marginBottom: 5,
  },
  portfolioImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 10,
  },

  title: {
    fontFamily: "Roboto-Medium",
    fontSize: theme.sizes.h3,
    color: "black",
    marginVertical: 5,
  },

  content: {
    fontFamily: "Roboto-Light",
    fontSize: theme.sizes.h3,
    color: "black",
  },

  tagsContainer: {
    width: "100%",
    position: "relative",
    flexDirection: "row",
    flexWrap: "wrap",
  },

  tags: {
    padding: 5,
    paddingHorizontal: 10,
    backgroundColor: theme.colors.primary,
    fontFamily: "Roboto-Light",
    margin: 5,
    color: "white",
    borderRadius: 10,
  },

  areaExpertise: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Roboto-Medium",
    color: "#008DDA",
  },

  feedBackContainer: {
    width: "100%",
    borderWidth: 1,
    borderColor: theme.colors.grey,
    marginVertical: 8,
    padding: 5,
    borderRadius: 10,
  },

  feedback: {
    fontFamily: "Roboto-Light",
    color: "black",
    padding: 5,
  },

  createdAt: {
    alignSelf: "flex-end",
    fontFamily: "Roboto-Thin",
    fontSize: 10,
    color: "black",
  },

  hireMeContainer: {
    marginTop: 7,
    color: "white",
    padding: 10,
    paddingHorizontal: 15,
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  hireMeContainerOffline: {
    marginTop: 7,
    color: "white",
    padding: 10,
    paddingHorizontal: 15,
    backgroundColor: theme.colors.grey,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.grey,
  },
  hireMe: {
    fontFamily: "Roboto-Medium",
    color: "white",
    textAlign: "center",
  },
});
