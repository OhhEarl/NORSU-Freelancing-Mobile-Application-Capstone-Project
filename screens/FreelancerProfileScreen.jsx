import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";

import Feather from "react-native-vector-icons/Feather";
import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { COLORS, UTILITIES } from "../assets/constants/index";
import { SafeAreaView } from "react-native-safe-area-context";

import * as theme from "../assets/constants/theme";

const PortfolioScreen = ({ user }) => (
  <View style={styles.containerPortfolio}>
    <View style={styles.portfolioContainer}>
      {user?.portfolio?.map((image, index) => (
        <View key={index} style={styles.portfolioImageContainer}>
          <Image
            source={{ uri: image.student_portfolio_path }}
            style={styles.portfolioImage}
          />
        </View>
      ))}
    </View>
  </View>
);

const ResumeScreen = ({ user }) => (
  <ScrollView showsVerticalScrollIndicator={false}>
    <View style={styles.inputFieldContainer}>
      <View style={{ marginVertical: 6 }}>
        <Text style={styles.title}>Year Level</Text>
        <Text style={styles.content}>{user?.year_level}</Text>
      </View>
      <View style={{ marginVertical: 6 }}>
        <Text style={styles.title}>About Me</Text>
        <Text style={styles.content}>{user?.about_me}</Text>
      </View>
      <View style={{ marginVertical: 6 }}>
        <Text style={styles.title}>Skill Tags</Text>
        <View style={styles.tagsContainer}>
          {user?.student_tags?.map((tags, index) => (
            <Text key={index} style={styles.tags}>
              {tags?.student_skills}
            </Text>
          ))}
        </View>
      </View>
    </View>
  </ScrollView>
);
const FreelancerProfileScreen = ({ navigation, route }) => {
  const { user } = route?.params;
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "portfolio", title: "Portfolio" },
    { key: "resume", title: "Resume" },
  ]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "portfolio":
        return <PortfolioScreen user={user.freelancer} />;
      case "resume":
        return <ResumeScreen user={user.freelancer} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
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
        <Image
          style={styles.image}
          source={
            user?.freelancer?.user_avatar
              ? { uri: user?.freelancer?.user_avatar }
              : {
                  uri: "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?w=740&t=st=1670148608~exp=1670149208~hmac=bc57b66d67d2b9f4929c8e592ff17e8c8660721608add2f18fc20d19c1aab7e4",
                }
          }
        />

        <Text style={styles.userText}>{user?.freelancer?.user_name}</Text>
        <Text style={styles.course}>{user?.freelancer?.area_of_expertise}</Text>
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
    marginTop: 40,
  },

  userText: {
    marginHorizontal: 50,
    fontSize: 20,
    color: "black",
    fontFamily: "Roboto-Bold",
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
    fontFamily: "Roboto-Regular",
    fontSize: theme.sizes.h3,
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
});
