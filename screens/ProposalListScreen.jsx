import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";

import * as theme from "../assets/constants/theme";
import Feather from "react-native-vector-icons/Feather";
import Entypo from "react-native-vector-icons/Entypo";

import LoadingComponent from "../components/LoadingComponent";
import dayjs from "dayjs";
import "dayjs/locale/en";
const ProposalListScreen = ({ route, navigation }) => {
  const { projectId } = route.params;
  const { token } = route.params;
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProposals = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://10.0.2.2:8000/api/proposals/${projectId}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProposals(response.data.data);
    } catch (error) {
      console.error("Error fetching proposals:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.item}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 5,
          }}
        >
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("FreelancerProfileScreen", {
                user: item,
              })
            }
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                height={32}
                width={32}
                style={{ borderRadius: 50 }}
                source={
                  item?.freelancer?.user_avatar
                    ? { uri: item?.freelancer?.user_avatar }
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
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>{item.job_title}</Text>
        <Text style={styles.description}>{item.expertise_explain}</Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View>
            <Text style={styles.budget}>Budget </Text>
            <Text style={styles.budgetPrice}>₱{item.job_amount_bid}</Text>
          </View>

          <View
            style={{
              position: "absolute",
              right: 0,
              width: 130,
            }}
          >
            <Text style={styles.budget}>Due Date </Text>
            <Text style={styles.dueDate}>
              {dayjs(item.due_date).format("MMMM D, YYYY")}
            </Text>
          </View>
        </View>
      </View>
    );
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
          Proposal Lists
        </Text>
        <Text></Text>
      </View>
      {loading ? (
        <LoadingComponent />
      ) : (
        <View style={styles.container}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={proposals}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.flatList}
          />
        </View>
      )}
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
    fontSize: theme.sizes.h2,
    fontFamily: "Roboto-Light",
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
    fontFamily: "Roboto-Light",
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
    fontFamily: "Roboto-Regular",
    fontSize: theme.sizes.h1 + 3,
    padding: 0,
    margin: 0,
  },
});
