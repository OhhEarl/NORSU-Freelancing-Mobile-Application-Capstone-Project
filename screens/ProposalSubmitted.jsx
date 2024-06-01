import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  Button,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as theme from "../assets/constants/theme";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import axios from "axios";
import { useEffect, useState } from "react";
import LoadingComponent from "../components/LoadingComponent";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/en";
import { URL } from "@env";
import CurrencyInput from "react-native-currency-input";
import dayjs from "dayjs";
import DateTimePicker from "react-native-ui-datepicker";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import { useProjectContext } from "../hooks/ProjectContext";
const ProposalSubmitted = ({ route, navigation }) => {
  const { id, token } = route?.params;
  const { fetchData } = useProjectContext();
  const [isLoading, setLoading] = useState(false);
  const [allProjects, setAllProjects] = useState(null);
  const [ongoingProjects, setOngoingProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false); // State to manage modal visibility
  const [selectedItemId, setSelectedItemId] = useState(null);

  const [index, setIndex] = useState(0);

  const handleDeleteProject = () => {
    if (selectedItemId) {
      deleteCreatedProject(selectedItemId); // Call deletion function with the ID
    }
    setIsModalVisible(false); // Close the modal after deletion
  };

  const fetchProposalSubmitted = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${URL}/project/submitted/show/${id}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const data = response.data.data;

        const proposals = Array.isArray(data) ? data : [data];

        const allData = proposals.filter((project) => {
          return project.status === 0;
        });
        const ongoingData = proposals.filter((project) => {
          return project.status === 1;
        });
        const completedData = proposals.filter((project) => {
          return project.status === 3;
        });

        setAllProjects(allData);
        setOngoingProjects(ongoingData);
        setCompletedProjects(completedData);
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
    fetchProposalSubmitted();
  }, [token, id]);

  const deleteCreatedProject = async (id) => {
    setIsModalVisible(false);

    try {
      setLoading(true);
      const formData = new FormData();
      const response = await axios.post(
        `${URL}/project/proposals/delete/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        await fetchProposalSubmitted(id);
        await fetchData();
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Error",
          textBody: "Project deleted successfully",
          button: "Close",
        });
        setSelectedItemId(null);
      }
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Something Went Wrong. Please Try Again.",
        button: "Close",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (itemId) => {
    setIsModalVisible(true); // Show the modal when the button is pressed
    setSelectedItemId(itemId);
  };

  const renderItem = ({ item, index }) => {
    const createdAt = dayjs(item.created_at);

    return (
      <View style={styles.item}>
        <View>
          <Text style={styles.dateCreated}>
            {createdAt.format("MMMM D, YYYY h:mm A")}
          </Text>
          <Text style={styles.title}>{item.job_proposal.job_title}</Text>
        </View>

        <Text style={styles.description}>
          {item.job_proposal.job_description}
        </Text>

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
              value={item.job_proposal.job_budget_from}
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

            {item?.status === 0 ? (
              <Text style={styles.ongoing}>Pending</Text>
            ) : item?.status === 1 ? (
              <Text style={styles.awarded}>Accepted</Text>
            ) : item?.status === 3 ? (
              <Text style={styles.rejected}>Rejected</Text>
            ) : (
              <Text style={styles.rejected}>Rejected</Text>
            )}
          </View>
        </View>

        {item.status === 0 ? (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={() => {
                handleShowModal(item.id);
              }}
            >
              <Text style={[styles.optionText, { color: "white" }]}>
                Delete Project
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <></>
        )}

        {item.status === 1 ? (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={() =>
                navigation.navigate("OutputScreen", {
                  projectId: item.project_id,
                  userID: item.freelancer_id,
                  enabled: true,
                  status: true,
                  output: item.user_id,
                  projectOwned: item.job_proposal.student_user_id,
                })
              }
            >
              <Text style={[styles.optionText, { color: "white" }]}>
                View Outputs
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <></>
        )}

        {item.status === 3 ? (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={() =>
                navigation.navigate("OutputScreen", {
                  projectId: item.project_id,
                  userID: item.freelancer_id,
                  enabled: true,
                  status: true,
                  output: item.user_id,
                  projectOwned: item.job_proposal.student_user_id,
                })
              }
            >
              <Text style={[styles.optionText, { color: "white" }]}>
                View Outputs
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <></>
        )}
      </View>
    );
  };

  const [routes] = useState([
    { key: "all", title: "Active" },
    { key: "ongoing", title: "Accepted" },
    { key: "completed", title: "Rejected" },
  ]);
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
          marginTop: 1,
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
          {isLoading ? (
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
            Projects Applied
          </Text>
          <Text></Text>
        </View>

        <View style={styles.container}>
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
        </View>
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
                Are You Sure You Want To Delete This Project?
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

export default ProposalSubmitted;
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
    padding: 20,
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
    color: "black",
  },
  flatList: {
    flex: 1,
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

  awarded: {
    padding: 6,
    backgroundColor: "green",
    borderRadius: 5,
    fontFamily: "Roboto-Medium",
    color: "white",
    fontSize: theme.sizes.h1 + 2,
    marginTop: 5,
    textAlign: "center",
    width: 80,
    position: "relative",
    right: 0,
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

  dateCreated: {
    fontFamily: "Roboto",
    color: "gray",
    fontSize: 12,
    textAlign: "right",
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
});
