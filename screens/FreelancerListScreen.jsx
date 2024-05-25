import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  useFocusEffect,
  ScrollView,
  RefreshControl,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import * as theme from "../assets/constants/theme";
import Icon from "react-native-vector-icons/MaterialIcons";

import LoadingComponent from "../components/LoadingComponent";

import { usePeopleContext } from "../hooks/PeopleContext";
import { Rating } from "react-native-ratings";
const FreelancerListScreen = ({ navigation, route }) => {
  const { isStudent } = route.params;
  const ownID = isStudent.studentInfo.id;

  const { peopleError, peopleLoading, peoples, fetchPeopleData } =
    usePeopleContext();

  const peopleRender = peoples.filter((people) => people.id !== ownID);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(
    peopleRender ? peopleRender : []
  );
  const [refreshing, setRefreshing] = useState(false); // Refreshing state

  const handleSearch = (text) => {
    setSearchTerm(text);

    if (!text.trim()) {
      // If search term is empty, reset search results to all peoples
      setSearchResults(peoples);
      return;
    }

    const filteredResults = peoples.filter(
      (item) =>
        (item.user_name.toLowerCase().includes(text.toLowerCase()) ||
          item.area_of_expertise.toLowerCase().includes(text.toLowerCase())) &&
        item.id !== ownID // Exclude user with matching ID
    );

    setSearchResults(filteredResults);
  };
  const renderItem = ({ item }) => {
    const rating = item?.average_rating ? parseFloat(item?.average_rating) : 0;
    return (
      <View style={{ flex: 1, paddingHorizontal: 24 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("FreelancerProfileScreen", {
                  id: item.id,
                  isStudent: item,
                })
              }
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
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
                      item?.user_avatar
                        ? {
                            uri: `${baseUrlWithoutApi}/storage/${item?.user_avatar}`,
                          }
                        : {
                            uri: "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?w=740&t=st=1670148608~exp=1670149208~hmac=bc57b66d67d2b9f4929c8e592ff17e8c8660721608add2f18fc20d19c1aab7e4",
                          }
                    }
                  />

                  <View style={{ flexDirection: "column", marginStart: 10 }}>
                    <Text style={styles.freelancerName}>{item?.user_name}</Text>
                    <Text style={styles.freelancerExpertise}>
                      {item?.area_of_expertise}
                    </Text>
                  </View>
                </View>
                <Rating
                  type="star"
                  ratingCount={5}
                  imageSize={18}
                  readonly
                  startingValue={rating}
                  fractions={2} // Allows half-star ratings
                />
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

              <View>
                <Text style={{ fontFamily: "Roboto-Medium", color: "black" }}>
                  About Me
                </Text>
                <Text style={{ fontFamily: "Roboto-Light", color: "black" }}>
                  {item?.about_me?.substring(0, 120)}
                  {item?.about_me?.length > 100 && "..."}
                </Text>
              </View>
              <View style={{ flexDirection: "row", marginTop: 10 }}>
                {item?.student_skills?.map((skills, index) => (
                  <Text key={index} style={styles.tag}>
                    {skills.student_skills}
                  </Text>
                ))}
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.WHITE }}>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.hey}>Hey, </Text>
              <Text style={styles.titleName}>
                {isStudent?.studentInfo?.first_name}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate("ProfileScreen")}
            >
              <Image
                source={
                  isStudent?.studentInfo?.user_avatar
                    ? {
                        uri: `${baseUrlWithoutApi}/storage/${isStudent?.studentInfo?.user_avatar}`,
                      }
                    : {
                        uri: "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?w=740&t=st=1670148608~exp=1670149208~hmac=bc57b66d67d2b9f4929c8e592ff17e8c8660721608add2f18fc20d19c1aab7e4",
                      }
                }
                style={{ width: 30, height: 30, borderRadius: 50 }}
              />
            </TouchableOpacity>
          </View>

          <View>
            <Text style={[theme.utilities.header, { marginLeft: 20 }]}>
              Find Your Dream Freelancer
            </Text>

            <View style={styles.searchContainer}>
              <View style={styles.searchInputContainer}>
                <Icon name="search" size={30} color={theme.colors.silver} />
                <TextInput
                  value={searchTerm}
                  onChangeText={handleSearch}
                  placeholder="Search for freelancer expertise or username.."
                  style={{ flex: 1 }}
                />
              </View>
            </View>
          </View>

          {peopleLoading ? (
            <LoadingComponent />
          ) : (
            <FlatList
              data={searchResults}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={fetchPeopleData}
                />
              }
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.WHITE,
  },
  container: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    marginTop: 10,
    borderWidth: 1,
    borderColor: theme.colors.GRAY_LIGHT,
    borderRadius: 5,
  },

  titleName: {
    fontFamily: "Roboto-Bold",
    fontSize: theme.sizes.h3,
    color: theme.colors.primary,
  },
  hey: {
    fontFamily: "Roboto-Bold",
    fontSize: theme.sizes.h3,
    color: theme.colors.BLACKS,
  },
  searchContainer: {
    marginTop: 15,
    marginLeft: 20,
    paddingRight: 20,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  searchInputContainer: {
    flex: 1,
    height: 50,
    borderRadius: 5,
    paddingStart: 8,
    alignItems: "center",
    flexDirection: "row",
    shadowColor: "000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 1.41,
    elevation: 2,
    backgroundColor: theme.colors.inputField,
  },
  searchIconContainer: {
    padding: 8,
    marginLeft: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
  },
  popularContainer: {
    paddingTop: 20,
  },
  popularText: {
    marginBottom: 15,
    fontFamily: "ProximaNova-Bold",
    fontSize: theme.sizes.h4,
    color: theme.colors.BLACKS,
  },
  sheetContent: {
    padding: 25,
    paddingTop: -5,
  },
  sort: {
    paddingVertical: 14,
    fontFamily: "Roboto-Bold",
    color: "black",
    borderTopWidth: 1,
    borderColor: theme.colors.GRAY_LIGHT,
  },
  selectedSort: {
    borderTopWidth: 1,
    paddingVertical: 14,
    fontFamily: "Roboto-Bold",
    color: theme.colors.primary,
    borderColor: theme.colors.GRAY_LIGHT,
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

  tag: {
    marginEnd: 10,
    borderRadius: 10,
    backgroundColor: theme.colors.primary,
    paddingVertical: 2,
    paddingHorizontal: 10,
    fontSize: theme.sizes.h2 - 1,
    color: theme.colors.WHITE,
    fontFamily: "Roboto-Light",
  },
});

export default FreelancerListScreen;
