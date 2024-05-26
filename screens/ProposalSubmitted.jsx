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
  const { projectError, loading, projects, fetchData } = useProjectContext();
  const { id, token } = route?.params;
  const [isLoading, setLoading] = useState(false);
  const [allProjects, setAllProjects] = useState(null);
  const [ongoingProjects, setOngoingProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false); // State to manage modal visibility
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [visible, setVisible] = useState(false); // State to manage modal visibility
  const [itemID, setItemID] = useState(null);
  const [index, setIndex] = useState(0);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);

  const [dueDate, setDueDate] = useState();
  const [startDate, setStartDate] = useState(dayjs());
  const formattedStartDate = dayjs(startDate)
    .locale("tl-ph")
    .format("YYYY-MM-DD");

  const togglePicker = (picker) => {
    if (picker === "start") {
      setShowStartDatePicker(!showStartDatePicker);
    } else if (picker === "end") {
      setShowEndDatePicker(!showEndDatePicker);
    }
  };

  dayjs.extend(relativeTime);

  const handleShowModalExtension = async (id, due_date) => {
    await setItemID(id);
    await setDueDate(due_date);
    await setVisible(true);
  };

  const onStartDateChange = (selectedDate) => {
    if (selectedDate) {
      setStartDate(selectedDate);
      setShowStartDatePicker(false); // Close the picker
    }
  };
  const handleExtension = async (projectID) => {
    if (dayjs(formattedStartDate).isBefore(dayjs(dueDate))) {
      Alert.alert(
        "Invalid Date Selected",
        "The proposed date cannot be earlier than the project's start date!",
        [{ text: "Ok", style: "cancel" }]
      );
    } else {
      try {
        setLoading(true);
        const url = `${URL}/proposals/update/dueDate/${projectID}`;
        const response = await axios.post(
          url,
          { extension_due_date: formattedStartDate },
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          await fetchData();
          await fetchProposalSubmitted(id);
          await Alert.alert("Due Date Extension Submitted.");
        }
      } catch (error) {
        Alert.alert("Something Went Wrong. Please Try Again!");
      } finally {
        setLoading(false);
      }
    }
  };
  // Delete Projects
  const handleDeleteProject = () => {
    if (selectedItemId) {
      deleteCreatedProject(selectedItemId); // Call deletion function with the ID
    }
    setIsModalVisible(false); // Close the modal after deletion
  };
  const handleShowModal = (itemId) => {
    setIsModalVisible(true); // Show the modal when the button is pressed
    setSelectedItemId(itemId);
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
        const allData = proposals.filter((project) => project.status === 0);

        const ongoingData = proposals.filter((project) => {
          project.status === 1;
          return project.status === 1;
        });
        const completedData = proposals.filter((project) => {
          return project.status === 2;
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
        Alert.alert("Project proposal deleted successfully.");
        setSelectedItemId(null);
      }
    } catch (error) {
      Alert.alert(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const acceptRequest = async (id) => {
    try {
      setLoading(true);
      const formData = new FormData();
      const response = await axios.post(
        `${URL}/project/requested-project/accept/${id}`,
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
        await fetchProposalSubmitted();
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "SUCCESS",
          textBody: "Project request accepted successfully.",
          button: "Close",
        });
      }
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "ERROR",
        textBody: "Something Went Wrong, Please Try Again",
        button: "Close",
      });
    } finally {
      setLoading(false);
    }
  };

  const rejectRequest = async (id) => {
    try {
      setLoading(true);
      const formData = new FormData();
      const response = await axios.post(
        `${URL}/project/requested-project/delete/${id}`,
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
        await fetchProposalSubmitted();
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "SUCCESS",
          textBody: "Project request rejected successfully.",
          button: "Close",
        });
      }
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "ERROR",
        textBody: "Something Went Wrong. Please Try Again",
        button: "Close",
      });
    } finally {
      setLoading(false);
    }
  };

  //routes for pages

  const renderItem = ({ item, index }) => {
    const today = dayjs(new Date()).format("YYYY-MM-DD");
    const isPastDue = today > item.job_proposal.job_end_date;

    const hasProjectOutput = item.job_proposal?.project_outputs?.some(
      (output) => output.freelancer_id === item.freelancer_id
    );

    const handlePress = () => {
      handleShowModalExtension(item.id, item.job_proposal.job_end_date);
    };

    return (
      <View style={styles.item}>
        <Text style={styles.title}>{item.job_proposal.job_title}</Text>
        <Text style={styles.description}>
          {item.job_proposal.job_description}
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: -10,
          }}
        >
          <Text style={[styles.dueDate, { color: "black" }]}>Budget: </Text>

          <CurrencyInput
            delimiter=","
            separator="."
            style={[styles.dueDate, { marginTop: 2 }]}
            value={item.job_proposal.job_budget_from}
            prefix="₱"
          />
        </View>
        <View style={styles.bottomContainer}>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.dueDate, { color: "black" }]}>
              Proposal Due Date:{" "}
            </Text>
            <Text style={styles.dueDate}>
              {dayjs(item.due_date).format("MMMM D, YYYY")}
            </Text>
          </View>

          {item.job_proposal.job_finished === 0 ? (
            <Text style={styles.ongoing}>On Going</Text>
          ) : item.job_proposal.job_finished === 1 ? (
            <Text style={styles.awarded}>Awarded</Text>
          ) : item.job_proposal.job_finished === 2 ? (
            <Text style={styles.requested}>Pending</Text>
          ) : item.job_proposal.job_finished === 4 ? (
            <Text style={styles.rejected}>Rejected</Text>
          ) : null}
        </View>

        {item.job_proposal.job_finished === 0 ? (
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
        ) : item.job_proposal.job_finished === 1 &&
          item.job_proposal.hireMe === 0 &&
          item.status === 1 ? (
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
        ) : item.job_proposal.job_finished === 3 &&
          item.job_proposal.hireMe === 3 &&
          item.status === 2 ? (
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
        ) : item.job_proposal.job_finished === 1 &&
          item.job_proposal.hireMe === 1 &&
          item.status === 1 ? (
          <View style={styles.buttonContainer}>
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
                  Submit Output
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : item.status === 2 &&
          item.job_proposal.job_finished === 2 &&
          item.job_proposal.hireMe === 0 ? (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={() => {
                acceptRequest(item.id);
              }}
            >
              <Text style={[styles.optionText, { color: "white" }]}>
                Accept Request
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButton, { backgroundColor: "red" }]}
              onPress={() => {
                rejectRequest(item.id);
              }}
            >
              <Text style={[styles.optionText, { color: "white" }]}>
                Reject Request
              </Text>
            </TouchableOpacity>
          </View>
        ) : isPastDue && !hasProjectOutput ? (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.optionButton, { backgroundColor: "#dc143c" }]}
              onPress={() => {
                handlePress();
              }}
            >
              <Text style={[styles.optionText, { color: "white" }]}>
                Ask Extension
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.optionButton}>
            <Text style={[styles.optionText, { color: "black" }]}></Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const [routes] = useState([
    { key: "all", title: "Submited" },
    { key: "ongoing", title: "Awarded" },
    { key: "completed", title: "Requesting" },
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

        {/* ASK EXTENSION */}
        <Modal visible={visible} transparent={true} animationType="none">
          <View style={styles.modalContainer}>
            <View style={styles.deleteContainer}>
              <TouchableOpacity
                onPress={() => {
                  setVisible(false);
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

              <View style={{ flexDirection: "row" }}>
                <View style={{ width: "100%" }}>
                  <View
                    style={{ width: "100%", padding: 20, marginBottom: 10 }}
                  >
                    <Text
                      style={{
                        fontFamily: "Roboto-Medium",
                        marginBottom: 7,
                        color: "black",
                      }}
                    >
                      Extend Due Date
                    </Text>
                    <TouchableOpacity onPress={() => togglePicker("start")}>
                      <Text style={styles.date}>
                        {dayjs(startDate).format("MM/DD/YYYY")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Modal
                    visible={showStartDatePicker}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setShowStartDatePicker(false)}
                  >
                    <View style={styles.modalContainer}>
                      <View style={styles.pickerContainer}>
                        <DateTimePicker
                          date={startDate}
                          onChange={(params) => onStartDateChange(params.date)}
                        />
                        <Button
                          title="Close"
                          onPress={() => setShowStartDatePicker(false)}
                        />
                      </View>
                    </View>
                  </Modal>
                </View>
              </View>
              <TouchableOpacity
                style={styles.dismiss}
                onPress={() => {
                  handleExtension(itemID);
                }}
              >
                <Text style={styles.dismissText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* ASK EXTENSION */}

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

  due: {
    fontSize: theme.sizes.h2,
    fontFamily: "Roboto-Medium",
    color: "black",
    marginBottom: 2,
  },
  detailsContainer: {
    marginVertical: 4,
  },

  bottomContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    borderBottomWidth: 1,
    paddingBottom: 10,
    borderColor: theme.colors.GRAY_LIGHT,
  },

  dueDate: {
    fontSize: theme.sizes.h2,
    color: theme.colors.primary,
    fontFamily: "Roboto-Medium",
  },

  status: {
    fontSize: theme.sizes.h2,
    fontFamily: "Roboto-Medium",
    padding: 2,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  pendingStatus: {
    color: theme.colors.primary,
    backgroundColor: "#f0f8ff", // Optional: Set background color for Pending
  },
  acceptedStatus: {
    color: "green",
    backgroundColor: "#f0f8ff", // Optional: Set background color for Pending
  },
  completedStatus: {
    color: "yellow",
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
    backgroundColor: theme.colors.primary,
    position: "relative",
    bottom: -1,
  },
  dismissText: {
    fontFamily: "Roboto-Medium",
    color: "white",
    padding: 12,
    alignSelf: "center",
  },

  pickerContainer: {
    backgroundColor: theme.colors.WHITE,
    padding: 30,
    borderRadius: 10,
    width: "90%",
  },

  date: {
    color: theme.colors.gray,
    fontFamily: "Roboto-Regular",
    fontSize: theme.sizes.h2 + 1,
    padding: 10,
    borderWidth: 1,
    borderColor: theme.colors.GRAY_LIGHT,
    borderRadius: 10,
    paddingStart: 15,
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
});
