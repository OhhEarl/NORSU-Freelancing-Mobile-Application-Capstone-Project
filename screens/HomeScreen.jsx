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
} from "react-native";
import * as theme from "../assets/constants/theme";
import Icon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";

import ProjectComponent from "../components/ProjectComponent";
import useGetProjectList from "../hooks/dataHooks/useGetProjectList";
import LoadingComponent from "../components/LoadingComponent";

const HomeScreen = ({ navigation, route }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [update, setUpdate] = useState(false);
  const { items, projectError, listLoading, isStudent, fetchJobs } =
    useGetProjectList();
  const projectUpdateRef = useRef(route?.params?.projectUpdate); // Using useRef

  useEffect(() => {
    if (route?.params?.projectUpdate !== projectUpdateRef.current) {
      projectUpdateRef.current = route?.params?.projectUpdate;
      setUpdate(route?.params?.projectUpdate);
    }

    const unsubscribe = navigation.addListener("focus", () => {
      if (update) {
        fetchJobs();
        setUpdate(false); // Reset the update state
      }
    });

    return () => {
      unsubscribe(); // Cleanup the listener
    };
  }, [navigation, route]); // Removed update from the dependency array

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(
        (item) =>
          item.job_title &&
          item.job_title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [searchQuery, items]);

  const handleItemPress = (item) => {
    navigation.navigate("ProjectDetailsScreen", {
      project: item,
      user_avatar: isStudent?.studentInfo?.user_avatar,
      user_id: isStudent?.studentInfo?.user_id,
      id: isStudent?.studentInfo?.id,
      token: isStudent?.token,
    });
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
                    ? { uri: isStudent?.studentInfo?.user_avatar }
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
              Find Your Dream Project
            </Text>

            <View style={styles.searchContainer}>
              <View style={styles.searchInputContainer}>
                <Icon name="search" size={30} color={theme.colors.silver} />
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search for project title.."
                  style={{ flex: 1 }}
                />
              </View>
              <TouchableOpacity style={styles.searchIconContainer}>
                <Icon name="filter-list" size={30} color={theme.colors.WHITE} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ flex: 1, paddingHorizontal: 20, marginTop: 20 }}>
            <Text style={styles.popularText}>Recent Projects</Text>

            {listLoading ? (
              <LoadingComponent />
            ) : filteredItems && filteredItems.length > 0 ? (
              <FlatList
                data={filteredItems}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleItemPress(item)}>
                    <ProjectComponent item={item} />
                  </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
              />
            ) : (
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
                    NO PROJECTS FOUND
                  </Text>
                </View>
              </View>
            )}
          </View>
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
    backgroundColor: theme.colors.WHITE,
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
});

export default HomeScreen;
