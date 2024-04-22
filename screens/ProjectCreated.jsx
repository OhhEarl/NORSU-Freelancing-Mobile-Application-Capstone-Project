import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as theme from "../assets/constants/theme";
import axios from "axios";
import LoadingComponent from "../components/LoadingComponent";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Feather from "react-native-vector-icons/Feather";
import Entypo from "react-native-vector-icons/Entypo";

dayjs.extend(relativeTime);

const ProjectCreated = ({ route, navigation }) => {
  const initialToken = route?.params?.token;
  const { id } = route?.params;
  const [token, setToken] = useState(initialToken);
  const [user, setUser] = useState(route?.params?.user);
  const [allProjects, setAllProjects] = useState(null);
  const [ongoingProjects, setOngoingProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showOptionsIndex, setShowOptionsIndex] = useState(null);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "all", title: "All Projects" },
    { key: "ongoing", title: "On Going" },
    { key: "completed", title: "Completed" },
  ]);

  useEffect(() => {
    // Reset the showOptionsIndex when the tab changes
    setShowOptionsIndex(null);
  }, [index]);
  const toggleOptions = (index) => {
    setShowOptionsIndex((prev) => (prev === index ? null : index));
  };
  const fetchProposalSubmitted = async (userId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://10.0.2.2:8000/api/project/created/show/${userId}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const allData = response.data.data;
      const ongoingData = allData.filter(
        (project) => project.job_finished === 0
      );
      const completedData = allData.filter(
        (project) => project.job_finished === 1
      );

      setAllProjects(allData);
      setOngoingProjects(ongoingData);
      setCompletedProjects(completedData);
    } catch (error) {
      alert(error, "Please close the application and open again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposalSubmitted(id);
  }, [id]);

  const deleteCreatedProject = async (projectID) => {
    let url = `http://10.0.2.2:8000/api/project/delete/${projectID}`;

    Alert.alert(
      "Delete Project",
      "Are you sure you want to delete this project?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              setLoading(true);
              const response = await axios.post(url, null, {
                headers: {
                  Accept: "application/json",
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${token}`,
                },
              });

              if (response.status === 200) {
                await fetchProposalSubmitted();
                await navigation.navigate("ProjectCreated");
                Alert.alert("Project deleted successfully.");
              }
            } catch (error) {
              Alert.alert(
                "Error:",
                error.response ? error.response.data : error.message
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const renderItem = ({ item, index }) => {
    const startDate = dayjs(item?.job_start_date);
    const endDate = dayjs(item?.job_end_date);
    const durationInDays = endDate.diff(startDate, "day");

    return (
      <View style={styles.item}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.title}>{item.job_title}</Text>
          <TouchableOpacity onPress={() => toggleOptions(index)}>
            <Entypo
              name={"dots-three-horizontal"}
              color={"black"}
              size={25}
              right={10}
            />
          </TouchableOpacity>
          {showOptionsIndex === index && (
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() =>
                  navigation.navigate("ProjectDetailsScreen", {
                    project: item,
                    id: user.id,
                    token: token,
                  })
                }
              >
                <Text style={styles.optionText}>View</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => deleteCreatedProject(item.id)}
              >
                <Text style={styles.optionText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Text style={styles.description}>{item.job_description}</Text>

        <View
          style={{
            flexDirection: "row",
            alignContent: "center",
          }}
        >
          <View
            style={{
              marginTop: 5,
            }}
          >
            <Text style={styles.budget}>Budget </Text>
            <Text style={styles.budgetPrice}>
              ₱{item.job_budget_from} - ₱{item.job_budget_to}
            </Text>
          </View>

          <View
            style={{
              marginTop: 5,
              position: "absolute",
              right: 20,
              width: 80,
            }}
          >
            <Text style={styles.budget}>Status </Text>
            <Text style={styles.statusJob}>
              {item?.job_finished == 0 ? "On Going" : "Completed"}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.proposal}
          onPress={() =>
            navigation.navigate("ProposalListScreen", {
              projectId: item.id,
              token: token,
            })
          }
        >
          <Text style={styles.proposalText}>View Proposals</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "all":
        return <ProjectList data={allProjects} />;
      case "ongoing":
        return <ProjectList data={ongoingProjects} />;
      case "completed":
        return <ProjectList data={completedProjects} />;
      default:
        return null;
    }
  };

  const renderTabBar = (props) => {
    const activeColor = theme.colors.primary;
    const inactiveColor = "white";
    const borderRadius = 10;

    return (
      <TabBar
        {...props}
        indicatorStyle={{
          backgroundColor: activeColor,
          borderRadius: borderRadius,
        }}
        style={{
          backgroundColor: inactiveColor,
          borderRadius: borderRadius,
          marginTop: 15,
        }}
        labelStyle={{
          fontSize: 14,
          fontFamily: "Roboto-Medium",
          color: inactiveColor,
        }}
        activeColor={activeColor}
        inactiveColor={inactiveColor}
        renderLabel={({ route, focused }) => (
          <Text
            style={{
              color: "black",
              fontFamily: "Roboto-Medium",
              fontSize: 14,
            }}
          >
            {route.title}
          </Text>
        )}
      />
    );
  };

  const ProjectList = ({ data }) => {
    return (
      <View style={styles.container}>
        {loading ? (
          <LoadingComponent />
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.flatList}
          />
        )}
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
          Projects Created
        </Text>
        <Text></Text>
      </View>
      <TabView
        lazy
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: 300 }}
        renderTabBar={renderTabBar}
        activeColor={theme.colors.primary}
        inactiveColor={"white"}
      />
    </SafeAreaView>
  );
};

export default ProjectCreated;

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
    padding: 10,
    marginVertical: 8,
    paddingVertical: 15,
  },
  title: {
    fontSize: theme.sizes.h3 + 2,
    fontFamily: "Roboto-Medium",
    color: "black",
    width: "85%",
  },
  category: {
    fontFamily: "Roboto-Regular",
    color: "black",
    fontSize: theme.sizes.h2 + 2,
  },
  description: {
    fontSize: theme.sizes.h2 + 1,
    fontFamily: "Roboto-Light",
    marginVertical: 10,
  },
  flatList: {
    flex: 1,
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
  showDetails: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
  },

  tabBar: {
    backgroundColor: "white",
    color: "black",
    marginTop: 10,
  },

  statusJob: {
    padding: 6,
    backgroundColor: theme.colors.secondary,
    borderRadius: 5,
    fontFamily: "Roboto-Medium",
    color: "white",
    fontSize: theme.sizes.h1 + 2,
    marginTop: 5,
    textAlign: "center",
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
});
