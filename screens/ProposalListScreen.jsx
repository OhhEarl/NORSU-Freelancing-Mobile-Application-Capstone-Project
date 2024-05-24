import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";

import * as theme from "../assets/constants/theme";
import Feather from "react-native-vector-icons/Feather";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import LoadingComponent from "../components/LoadingComponent";
import dayjs from "dayjs";
import "dayjs/locale/en";
import { URL } from "@env";
import { Rating } from "react-native-ratings";
import { useAuthContext } from "../hooks/AuthContext";
const ProposalListScreen = ({ route, navigation }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(false);
  const { token } = useAuthContext();
  const { project } = route.params;

  const baseUrlWithoutApi = URL.replace("/api", "");
  console.log(JSON.stringify(data));
  const fetchSubmittedList = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${URL}/project/freelancer/outputs/fetch/${project}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const data = response.data.data;
        setData(data);
      }
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Something Went Wrong, Please Try again!",
        button: "Close",
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSubmittedList();
  }, []);
  const renderItem = ({ item, project }) => {
    return (
      <View style={styles.item}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              maxWidth: 300,
            }}
          >
            <Image
              height={32}
              width={32}
              style={{ borderRadius: 50 }}
              source={
                item?.freelancer?.user_avatar
                  ? {
                      uri: `${baseUrlWithoutApi}/storage/${item?.freelancer?.user_avatar}`,
                    }
                  : {
                      uri: "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?w=740&t=st=1670148608~exp=1670149208~hmac=bc57b66d67d2b9f4929c8e592ff17e8c8660721608add2f18fc20d19c1aab7e4",
                    }
              }
            />
            <View style={{ flexDirection: "column", marginStart: 10 }}>
              <Text style={styles.freelancerName}>
                {item?.freelancer?.user_name}
              </Text>
              <Text style={styles.freelancerExpertise}>
                {item?.freelancer?.area_of_expertise}
              </Text>
            </View>
          </View>
        </View>
        <Text
          style={{
            width: "100%",
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.GRAY_LIGHT,
            marginTop: -10,
            marginBottom: 10,
          }}
        ></Text>

        <View style={styles.jobTagsContainer}>
          {item?.freelancer?.student_skills.map((skill) => (
            <Text key={skill.id} style={styles.jobTag}>
              {skill.student_skills}
            </Text>
          ))}
        </View>

        <View>
          <TouchableOpacity
            style={styles.proposal}
            onPress={() => {
              navigation.navigate("OutputScreen", {
                userID: item.freelancer_id,
                enabled: true,
                projectId: item.project_id,
                project: item,
              });
            }}
          >
            <Text style={styles.proposalText}>Check Outputs</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <AlertNotificationRoot style={styles.notification}>
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
              marginRight: 10,
              fontFamily: "Roboto-Medium",
              color: theme.colors.BLACKS,
              fontSize: 18,
            }}
          >
            Output Lists
          </Text>
          <Text></Text>
        </View>
        {loading ? (
          <LoadingComponent />
        ) : (
          <View style={styles.container}>
            {(data && (
              <>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={data}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.id.toString()}
                  style={styles.flatList}
                />
              </>
            )) || (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
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
                    NO OUTPUTS FOUND
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}
      </AlertNotificationRoot>
    </SafeAreaView>
  );
};

export default ProposalListScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: theme.colors.WHITE,
    padding: 18,
  },
  container: {
    flex: 1,
    marginVertical: 15,
  },
  item: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: theme.colors.GRAY_LIGHT,
    padding: 20,
    marginVertical: 8,
  },
  ProjectTitle: {
    fontFamily: "Roboto-Medium",
  },
  title: {
    fontSize: theme.sizes.h3,
    fontFamily: "Roboto-Medium",
    color: "black",
  },
  description: {
    fontFamily: "Roboto-Light",
    color: theme.colors.gray,
    marginVertical: 10,
  },
  flatList: {
    flex: 1,
  },

  due: {
    fontSize: theme.sizes.h2,
    fontFamily: "Roboto-Medium",
    color: "black",
    marginBottom: 2,
  },
  detailsContainer: {
    marginVertical: 4,
  },

  dueDate: {
    fontSize: theme.sizes.h2,
    paddingLeft: 20,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: theme.colors.inputField,
    color: "black",
    fontFamily: "Roboto-Medium",
    borderRadius: 5,
  },

  optionsContainer: {
    position: "absolute",
    right: 0,
    top: 25, // adjust this value to position the rectangle correctly
    backgroundColor: "white",
    borderRadius: 5,
    elevation: 5,
    zIndex: 1,
  },
  optionButton: {
    paddingHorizontal: 30,
    paddingVertical: 8,
    borderBottomColor: "#e0e0e0",
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: theme.sizes.h3,
    fontFamily: "Roboto-Medium",
    color: "black",
  },

  budget: {
    fontFamily: "Roboto-Regular",
    fontSize: theme.sizes.h2,
    color: "black",
  },
  budgetPrice: {
    fontFamily: "Roboto-Medium",
    fontSize: theme.sizes.h4,
    color: "black",
    marginTop: 5,
  },

  dueDate: {
    fontSize: theme.sizes.h3,
    fontFamily: "Roboto-Medium",
    color: "black",
    marginTop: 7,
  },

  freelancerName: {
    fontFamily: "Roboto-Medium",
    color: "black",
    fontSize: theme.sizes.h3,
    padding: 0,
    margin: 0,
  },
  freelancerExpertise: {
    fontFamily: "Roboto-Light",
    fontSize: theme.sizes.h1 + 3,
    padding: 0,
    color: theme.colors.gray,
    margin: 0,
  },
  proposal: {
    width: "100%",
    backgroundColor: theme.colors.primary,
    padding: 10,
    marginTop: 15,
    borderRadius: 10,
  },
  proposalText: {
    textAlign: "center",
    color: "white",
    fontSize: theme.sizes.h3 + 2,
    fontFamily: "Roboto-Medium",
    alignSelf: "center",
  },

  memberSinceText: {
    fontFamily: "Roboto-Regular",
    color: "black",
  },

  memberSinceData: {
    fontFamily: "Roboto-Light",
    color: "black",
  },

  jobTag: {
    marginEnd: 10,
    borderRadius: 10,
    backgroundColor: theme.colors.primary,
    paddingVertical: 2,
    paddingHorizontal: 10,
    fontSize: theme.sizes.h2 - 1,
    color: theme.colors.WHITE,
    fontFamily: "Roboto-Light",
  },
  jobTagsContainer: {
    flexDirection: "row",
    paddingHorizontal: 8,
    marginTop: 10,
    width: "100%",
  },
});
