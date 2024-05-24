import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  RefreshControl,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useProjectContext } from "../hooks/ProjectContext";
import { URL } from "@env";
import * as theme from "../assets/constants/theme";
import Icon from "react-native-vector-icons/MaterialIcons";
import ProjectComponent from "../components/ProjectComponent";
import LoadingComponent from "../components/LoadingComponent";
import BottomSheet, { BottomSheetMethods } from "@devvie/bottom-sheet";
const HomeScreen = ({ navigation, route }) => {
  const { loading, projects, fetchData } = useProjectContext();
  const { isStudent } = route.params;
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedSort, setSelectedSort] = useState("name"); // Default sort
  let previousSort = useRef("");
  const sheetRef = useRef(null);
  const baseUrlWithoutApi = URL.replace("/api", "");
  const [refreshing, setRefreshing] = useState(false); // Refreshing state
  const sortOptions = {
    name: {
      label: "Sort By Name",
      sortFunction: (projectA, projectB) =>
        projectA.job_title.localeCompare(projectB.job_title),
    },
    datePosted: {
      label: "Sort By Date Posted",
      sortFunction: (projectA, projectB) =>
        new Date(projectB.created_at) - new Date(projectA.created_at), // Descending (newest first)
    },
    budget: {
      label: "Sort By Budget",
      sortFunction: (projectA, projectB) =>
        projectA.job_budget_from - projectB.job_budget_from,
    },
  };

  const handleSortSelection = (sortKey) => {
    // Regardless of selection, close the BottomSheet
    sheetRef.current?.close();

    if (sortKey !== previousSort.current) {
      setSelectedSort(sortKey);
      const sortedProjects = filteredProjects
        .slice()
        .sort(sortOptions[sortKey].sortFunction);
      setFilteredProjects(sortedProjects);
      previousSort.current = sortKey;
    }
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProjects(projects.slice()); // Ensure a copy is used to avoid mutation
    } else {
      const filtered = projects.filter(
        (project) =>
          project.job_title &&
          project.job_title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProjects(filtered);
    }
  }, [searchQuery, projects]);

  const handleItemPress = (item) => {
    navigation.navigate("ProjectDetailsScreen", {
      project_id: item.id,
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
              <TouchableOpacity
                style={styles.searchIconContainer}
                onPress={() => sheetRef.current?.open()}
              >
                <Icon name="filter-list" size={30} color={theme.colors.WHITE} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ flex: 1, paddingHorizontal: 20, marginTop: 20 }}>
            <Text style={styles.popularText}>Recent Projects</Text>
            {loading || !filteredProjects || !isStudent ? (
              <LoadingComponent />
            ) : filteredProjects && filteredProjects.length > 0 ? (
              <FlatList
                data={filteredProjects}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleItemPress(item)}>
                    <ProjectComponent item={item} />
                  </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={fetchData}
                  />
                }
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

          <View style={styles.sheet}>
            <BottomSheet
              ref={sheetRef}
              height={200}
              style={{ backgroundColor: "white" }}
            >
              <View style={styles.sheetContent}>
                <Text
                  style={[
                    styles.sort,
                    selectedSort === "name" && styles.selectedSort,
                  ]}
                  onPress={() => handleSortSelection("name")}
                >
                  Sort By Name
                </Text>
                <Text
                  style={[
                    styles.sort,
                    selectedSort === "datePosted" && styles.selectedSort,
                  ]}
                  onPress={() => handleSortSelection("datePosted")}
                >
                  Sort By Date Posted
                </Text>
                <Text
                  style={[
                    styles.sort,
                    selectedSort === "budget" && styles.selectedSort,
                    ,
                    { borderBottomWidth: 1 },
                  ]}
                  onPress={() => handleSortSelection("budget")}
                >
                  Sort By Budget
                </Text>
              </View>
            </BottomSheet>
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
});

export default HomeScreen;
