import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
  Button,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as theme from "../assets/constants/theme";
import axios from "axios";
import LoadingComponent from "../components/LoadingComponent";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";
import CurrencyInput from "react-native-currency-input";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import Ionicons from "react-native-vector-icons/Ionicons";
import { URL } from "@env";
import { useProjectContext } from "../hooks/ProjectContext";
import { useAuthContext } from "../hooks/AuthContext";

dayjs.extend(relativeTime);

const ProjectCreated = ({ route, navigation }) => {
  const { projectError, loading, projects, fetchData } = useProjectContext();
  const { peopleError, peopleLoading, peoples, fetchPeopleData } =
    useProjectContext();
  const { token, isStudent } = useAuthContext();
  const [allProjects, setAllProjects] = useState(null);
  const [ongoingProjects, setOngoingProjects] = useState([]);
  const [hiredData, setHiredData] = useState([]);

  const id = isStudent.studentInfo.id;
  const filteredProjects = projects.filter(
    (project) => project.student_user_id === id
  );

  useEffect(() => {
    let allData = filteredProjects.filter(
      (project) => project.job_finished === 0
    );
    let ongoingData = filteredProjects.filter(
      (project) => project.job_finished === 1
    );
    let hiredData = filteredProjects.filter(
      (project) => project.job_finished === 2 || project.job_finished === 3
    );

    setAllProjects(allData);
    setOngoingProjects(ongoingData);
    setHiredData(hiredData);
  }, [projects]);

  const [isLoading, setLoading] = useState(false);
  const [showOptionsIndex, setShowOptionsIndex] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // State to manage modal visibility
  const [index, setIndex] = useState(0);

  const handleShowModal = (itemId) => {
    setIsModalVisible(true); // Show the modal when the button is pressed
    setSelectedItemId(itemId);
  };

  const [routes] = useState([
    { key: "all", title: "On Going" },
    { key: "ongoing", title: "Awarded" },
    { key: "hired", title: "Requested" },
  ]);

  const toggleOptions = (index) => {
    setShowOptionsIndex((prev) => (prev === index ? null : index));
  };

  const handleDeleteProject = () => {
    if (selectedItemId) {
      deleteCreatedProject(selectedItemId); // Call deletion function with the ID
    }
    setIsModalVisible(false); // Close the modal after deletion
  };

  const deleteCreatedProject = async (projectID) => {
    let url = `${URL}/project/delete/${projectID}`;
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
        await fetchProposalSubmitted(id);
        await fetchData();
        setSelectedItemId(null);
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "SUCCESS",
          textBody: "Project Deleted Successfully.",
          button: "Close",
        });
      }
    } catch (error) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Something Went Wrong, Please Try again.",
        button: "Close",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item, index }) => {
    const filteredProjectOutputs = item.project_outputs.filter(
      (output) => output.status === 2
    );

    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("ProjectDetailsScreen", {
            project_id: item.id,
          });
        }}
      >
        <View style={styles.item}>
          <Text style={styles.title}>{item.job_title}</Text>
          <Text
            style={[
              styles.title,
              { fontSize: 12, fontFamily: "Roboto-Regular" },
            ]}
          >
            {item.job_category}
          </Text>

          <Text style={styles.description}>{item.job_description}</Text>

          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              borderBottomWidth: 1,
              paddingBottom: 12,
              borderColor: theme.colors.GRAY_LIGHT,
            }}
          >
            <View
              style={{
                marginTop: 5,
              }}
            >
              <Text style={styles.budget}>Budget </Text>
              <CurrencyInput
                style={styles.budgetPrice}
                value={item.job_budget_from}
                prefix="₱"
                delimiter=","
                separator="."
                precision={2}
                minValue={0}
                editable={false} // Add this line
              />
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

              {item?.job_finished === 0 ? (
                <Text style={styles.ongoing}>On Going</Text>
              ) : item?.job_finished === 1 ? (
                <Text style={styles.requested}>Awarded</Text>
              ) : item?.job_finished === 2 &&
                item?.proposals?.[0]?.status === 3 ? (
                <Text style={styles.awarded}>Awarded</Text>
              ) : item?.proposals?.[0]?.status === 4 ? (
                <Text style={styles.awarded}>Rejected</Text>
              ) : item?.proposals?.[0]?.status === 2 &&
                item?.job_finished === 2 ? (
                <Text style={styles.awarded}>On Going</Text>
              ) : (
                <Text style={styles.awarded}>On Going</Text>
              )}
            </View>
          </View>

          {item.job_finished === 0 ? (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  { backgroundColor: theme.colors.primary },
                ]}
                onPress={() =>
                  navigation.navigate("ProposalListScreen", {
                    project: item.id,
                  })
                }
              >
                <Text style={[styles.optionText, { color: "white" }]}>
                  View Outputs
                </Text>
              </TouchableOpacity>
            </View>
          ) : item?.job_finished === 2 && item?.proposals[0].status === 2 ? (
            <View style={[styles.optionButton, { marginTop: 10 }]}>
              <Text style={[styles.optionText, { color: "black" }]}>
                Waiting for Confirmation
              </Text>
            </View>
          ) : item?.job_finished === 1 ? (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  { backgroundColor: theme.colors.primary },
                ]}
                onPress={() =>
                  navigation.navigate("ProposalListScreen", {
                    project: item.id,
                  })
                }
              >
                <Text style={[styles.optionText, { color: "white" }]}>
                  View Outputs
                </Text>
              </TouchableOpacity>
            </View>
          ) : item?.job_finished === 2 && item?.proposals[0].status === 3 ? (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  { backgroundColor: theme.colors.primary },
                ]}
                onPress={() => {
                  navigation.navigate("SubmitOutputScreen", {
                    project: item,
                  });
                }}
              >
                <Text style={[styles.optionText, { color: "white" }]}>
                  View Outputs
                </Text>
              </TouchableOpacity>
            </View>
          ) : item?.proposals[0].status === 4 && item.job_finished === 2 ? (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  { backgroundColor: "red", color: "white" },
                ]}
              >
                <Text style={[styles.optionText, { color: "white" }]}>
                  Rejected
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={[styles.optionButton, { marginTop: 10 }]}>
              <Text style={[styles.optionText, { color: "black" }]}>
                Project Done
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "all":
        return <ProjectList data={allProjects} />;
      case "ongoing":
        return <ProjectList data={ongoingProjects} />;
      case "hired":
        return <ProjectList data={hiredData} />;
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
      <View style={styles.containerOne}>
        <View style={styles.container}>
          {loading || isLoading ? (
            <LoadingComponent />
          ) : data?.length > 0 ? (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={data}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              style={styles.flatList}
            />
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
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
                  NO PROJECTS FOUND
                </Text>
              </View>
            </View>
          )}
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

        <Modal visible={isModalVisible} transparent={true} animationType="none">
          <View style={styles.modalContainer}>
            <View style={styles.deleteContainer}>
              <TouchableOpacity
                onPress={() => {
                  setIsModalVisible(false);
                }}
                style={{
                  position: "relative",
                  alignSelf: "flex-end",
                  marginRight: 15,
                }}
              >
                <Ionicons
                  name={"close-circle-outline"}
                  color={"black"}
                  size={30}
                />
              </TouchableOpacity>

              <AntDesign
                name={"exclamationcircle"}
                color={"orange"}
                size={50}
              />
              <Text style={styles.ohSnap}>ALERT!</Text>
              <Text style={styles.modalText}>
                Are Sure You Want To Delete This Project?
              </Text>
              <TouchableOpacity
                style={styles.dismiss}
                onPress={handleDeleteProject}
              >
                <Text style={styles.dismissText}>DELETE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </AlertNotificationRoot>
    </SafeAreaView>
  );
};

export default ProjectCreated;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: theme.colors.WHITE,
  },
  container: {
    flex: 1,
    marginVertical: 15,
  },
  containerOne: {
    flex: 1,
    marginVertical: 15,
    paddingHorizontal: 18,
  },
  item: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: theme.colors.GRAY_LIGHT,
    padding: 10,
    paddingVertical: 15,
    marginVertical: 5,
  },
  title: {
    fontSize: theme.sizes.h3 + 2,
    fontFamily: "Roboto-Medium",
    color: "black",
    width: "85%",
  },

  description: {
    fontSize: theme.sizes.h2 + 1,
    fontFamily: "Roboto-Light",
    color: theme.colors.gray,
    marginVertical: 10,
  },
  flatList: {
    flex: 1,
  },
  budget: {
    fontFamily: "Roboto-Regular",
    fontSize: theme.sizes.h2,
    color: "black",
  },
  budgetPrice: {
    fontFamily: "Roboto-Medium",
    fontSize: theme.sizes.h3 + 2,
    color: "black",
    marginTop: -7,
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

  awarded: {
    padding: 6,
    backgroundColor: theme.colors.primary,
    borderRadius: 5,
    fontFamily: "Roboto-Medium",
    color: "white",
    fontSize: theme.sizes.h1 + 2,
    marginTop: 5,
    textAlign: "center",
  },

  rejected: {
    padding: 6,
    backgroundColor: "red",
    borderRadius: 5,
    fontFamily: "Roboto-Medium",
    color: "white",
    fontSize: theme.sizes.h1 + 2,
    marginTop: 5,
    textAlign: "center",
  },
  requested: {
    padding: 6,
    backgroundColor: theme.colors.secondary,
    borderRadius: 5,
    fontFamily: "Roboto-Medium",
    color: "white",
    fontSize: theme.sizes.h1 + 2,
    marginTop: 5,
    textAlign: "center",
  },
  ongoing: {
    padding: 6,
    backgroundColor: "blue",
    borderRadius: 5,
    fontFamily: "Roboto-Medium",
    color: "white",
    fontSize: theme.sizes.h1 + 2,
    marginTop: 5,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    marginTop: 15,
    width: "100%",
  },

  optionButton: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 10,
    fontFamily: "Roboto-Light",
    flex: 1,
    marginHorizontal: 5,
  },
  optionText: {
    textAlign: "center",
    fontFamily: "Roboto-Medium",
    paddingVertical: 12,
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

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  deleteContainer: {
    paddingTop: 15,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    maxHeight: 300,
    backgroundColor: "white",
  },

  ohSnap: {
    fontFamily: "Roboto-Medium",
    fontSize: 24,
    color: "black",
    marginTop: 12,
  },
  modalText: {
    fontFamily: "Roboto-Light",
    fontSize: 18,
    textAlign: "center",
    paddingHorizontal: 10,
    color: "#393939",
    marginBottom: 20,
    marginTop: 8,
  },
  dismiss: {
    width: "100%",
    backgroundColor: "orange",
    position: "relative",
    bottom: -1,
  },
  dismissText: {
    fontFamily: "Roboto-Medium",
    color: "white",
    padding: 12,
    alignSelf: "center",
  },
});
