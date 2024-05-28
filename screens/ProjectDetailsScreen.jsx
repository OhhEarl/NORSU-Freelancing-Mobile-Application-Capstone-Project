import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  Image,
} from "react-native";
import * as theme from "../assets/constants/theme";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import RNFetchBlob from "rn-fetch-blob";
import Button from "../components/Button";
import { URL } from "@env";
import { useEffect, useState, useRef } from "react";
import LoadingComponent from "../components/LoadingComponent";
import axios from "axios";
import BottomSheet, { BottomSheetMethods } from "@devvie/bottom-sheet";
import { useProjectContext } from "../hooks/ProjectContext";
import { useAuthContext } from "../hooks/AuthContext";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";

const ProjectDetailsScreen = ({ route, navigation }) => {
  const baseUrlWithoutApi = URL.replace("/api", "");
  const { projectError, loading, projects, fetchData } = useProjectContext();
  const { token, isStudent } = useAuthContext();
  const { project_id } = route.params;
  const [visible, setVisible] = useState(false);
  const id = isStudent.studentInfo.id;
  const filteredProjects = projects.filter(
    (project) => project.id === project_id
  );

  const [isLoading, setLoading] = useState(false);

  const formattedNumber = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(filteredProjects[0]?.job_budget_from);
  const sheetRef = useRef(null);

  const handlePress = () => {
    setVisible(true);
  };

  const markProjectDone = async () => {
    try {
      const formData = new FormData();
      setLoading(true);
      const url = `${URL}/project/status-mark-as-completed/${project.proposals[0].id}/${project.id}`;
      const response = await axios.post(url, formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        await fetchData();
        await navigation.navigate("GcashPaymentScreen", {
          project_id: filteredProjects[0].id,
          user_id: filteredProjects[0].student_user_id,
          freelancer_id: filteredProjects[0].proposals[0].freelancer_id,
          project_price: filteredProjects.job_budget_from,
        });
      }
    } catch (error) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Error",
        textBody: "Something Went Wrong, Please Try again.",
        button: "Close",
      });
    } finally {
      setLoading(false);
    }
  };

  const confirmMarkAsDone = () => {
    Alert.alert(
      "Confirm Selection?",
      "Are you sure you want to mark as done this project?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            markProjectDone();
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleReject = (id) => {
    Alert.alert(
      "Confirm Rejection?",
      "Are you sure you want to reject the extension request?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            sheetRef.current?.close();
            rejectExtension(id);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleAccept = (id) => {
    Alert.alert(
      "Confirm Extension?",
      "Are you sure you want to accept the extension request?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            sheetRef.current?.close();
            acceptExtension(id);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const acceptExtension = async (id, extension) => {
    setVisible(false);
    try {
      setLoading(true);
      const url = `${URL}/project/accept-extension-request/${id}`;
      const response = await axios.post(
        url,
        {
          extension_due_date:
            proposal?.filteredProjects[0]?.proposals[0]?.extension_due_date,
        },
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
        await navigation.navigate("ProjectCreated");
        Alert.alert("Extension Accepted Successfully.");
      } else {
        throw new Error("Failed to accept extension request. Please Try Again");
      }
    } catch (error) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Error",
        textBody: "Something Went Wrong, Please Try again.",
        button: "Close",
      });
    } finally {
      setLoading(false);
    }
  };

  const rejectExtension = async (id) => {
    setVisible(false);
    try {
      setLoading(true);
      const url = `${URL}/project/reject-extension-request/${id}`;
      const response = await axios.post(url, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        await fetchData();
        await navigation.navigate("ProjectCreated");
        Alert.alert("Extension Rejected Successfully.");
      } else {
        throw new Error("Failed to reject extension request. Please Try Again");
      }
    } catch (error) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Error",
        textBody: "Something Went Wrong, Please Try again.",
        button: "Close",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleDownload = async (attachment) => {
    const baseUrlWithoutApi = URL.replace("/api", "");
    try {
      const downloadConfig = {
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: `${RNFetchBlob.fs.dirs.DownloadDir}/${attachment.original_name}`,
          Description: "",
          notification: true,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await RNFetchBlob.config(downloadConfig).fetch(
        "GET",
        `${baseUrlWithoutApi}/storage/${attachment.file_path}`
      );

      if (res) {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Success",
          textBody: "Please Wait. Download is on Progress.",
          button: "Close",
        });
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Error",
          textBody: "Something Went Wrong, Please Try again.",
          button: "Close",
        });
      }
    } catch (error) {
      Alert.alert(error);
    }
  };

  dayjs.extend(relativeTime).locale("en");
  const formattedStartDate = dayjs(filteredProjects[0]?.job_start_date).format(
    "MMMM D, YYYY"
  );
  const formattedEndDate = dayjs(filteredProjects[0]?.job_end_date).format(
    "MMMM D, YYYY"
  );

  const handleNavigateToOutputScreen = () => {
    navigation.navigate("OutputScreen", {
      token: token,
      id: id,
      item: filteredProjects,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.inputField }}>
      <AlertNotificationRoot style={styles.notification}>
        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ zIndex: 999 }}
            >
              <Feather
                name="arrow-left"
                size={24}
                color={theme.colors.BLACKS}
                onPress={() => {
                  navigation.goBack();
                }}
              />
            </TouchableOpacity>
            <Text
              style={{
                fontFamily: "Roboto-Medium",
                color: theme.colors.BLACKS,
                fontSize: 18,
              }}
            >
              Project Overview
            </Text>

            {filteredProjects[0].student_user_id === id &&
            filteredProjects[0].job_finished === 0 ? (
              <MaterialCommunityIcons
                name="square-edit-outline"
                size={24}
                color={theme.colors.BLACKS}
                onPress={() =>
                  navigation.navigate("CreateProjectScreen", {
                    projects: filteredProjects[0],
                    studentId: id,
                  })
                }
              />
            ) : (
              <Text></Text>
            )}
          </View>

          {(!filteredProjects && !id) || loading ? (
            <LoadingComponent />
          ) : (
            <ScrollView
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.overviewContainer}>
                <Image
                  style={styles.image}
                  source={
                    filteredProjects[0]?.student_info?.user_avatar
                      ? {
                          uri: `${baseUrlWithoutApi}/storage/${filteredProjects[0]?.student_info?.user_avatar}`,
                        }
                      : {
                          uri: "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?w=740&t=st=1670148608~exp=1670149208~hmac=bc57b66d67d2b9f4929c8e592ff17e8c8660721608add2f18fc20d19c1aab7e4",
                        }
                  }
                />
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={styles.projectTitle}>
                    {filteredProjects[0].job_title}
                  </Text>
                  <Text style={styles.jobTime}>
                    Posted {dayjs(filteredProjects[0]?.created_at).fromNow()}
                  </Text>
                </View>

                <View style={styles.projectDescription}>
                  <Text style={styles.projectDescriptionTitle}>Category</Text>
                  <Text style={styles.jobDescription}>
                    {filteredProjects[0]?.job_category}
                  </Text>
                </View>

                <View style={styles.projectDescription}>
                  <Text style={styles.projectDescriptionTitle}>Budget</Text>
                  <Text style={styles.jobDescription}>₱{formattedNumber}</Text>
                </View>

                <View style={styles.projectDescription}>
                  <Text style={styles.projectDescriptionTitle}>
                    Description
                  </Text>
                  <Text style={styles.jobDescription}>
                    {filteredProjects[0]?.job_description}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginVertical: 10,
                  }}
                >
                  <View>
                    <Text style={{ color: "black" }}>Start Date</Text>
                    <Text style={[styles.dateRange, { marginRight: 115 }]}>
                      {formattedStartDate}
                    </Text>
                  </View>
                  <View>
                    <Text style={{ color: "black" }}>End Date</Text>
                    <Text style={styles.dateRange}>{formattedEndDate}</Text>
                  </View>
                </View>

                <View>
                  <Text style={styles.projectDescriptionTitle}>Tags</Text>
                  <View style={styles.jobTagsContainer}>
                    {filteredProjects[0]?.job_tags?.length > 0 &&
                      filteredProjects[0]?.job_tags?.map((tag, index) => (
                        <Text key={index} style={styles.jobTag}>
                          {tag?.job_tags}
                        </Text>
                      ))}
                  </View>
                </View>

                <View>
                  <Text
                    style={[styles.projectDescriptionTitle, { marginTop: 10 }]}
                  >
                    Attachment
                  </Text>
                  {filteredProjects[0]?.attachments?.length > 0 &&
                    filteredProjects[0]?.attachments?.map(
                      (attachment, index) => (
                        <View
                          key={attachment.id}
                          style={styles.selectedFileContainer}
                        >
                          <Ionicons
                            name={"document-text-outline"}
                            size={25}
                            color={theme.colors.BLACKS}
                          />
                          <Text
                            style={{
                              marginStart: 10,
                              fontSize: 15,
                              fontWeight: "600",
                              color: theme.colors.BLACKS,
                            }}
                          >
                            {attachment?.original_name?.length > 15
                              ? `${attachment.original_name?.substring(
                                  0,
                                  10
                                )}...${attachment?.original_name?.substring(
                                  attachment?.original_name?.lastIndexOf(".") +
                                    1
                                )}`
                              : attachment?.original_name}
                          </Text>
                          <TouchableOpacity
                            style={{ marginLeft: "auto", marginRight: 5 }}
                            onPress={() => handleDownload(attachment)}
                          >
                            <Ionicons
                              name={"cloud-download-outline"}
                              size={25}
                              color={theme.colors.BLACKS}
                            />
                          </TouchableOpacity>
                        </View>
                      )
                    )}
                </View>
              </View>

              {filteredProjects[0]?.proposals[0]?.extension_status === 1 &&
              !loading ? (
                <View style={styles.applyNow}>
                  <Button
                    title="Show Options"
                    filled
                    style={{
                      borderRadius: 10,
                      width: "90%",
                    }}
                    onPress={() => sheetRef.current?.open()}
                  />
                </View>
              ) : (
                ""
              )}

              {filteredProjects[0].job_finished === 1 &&
              !loading &&
              filteredProjects[0].student_user_id !== id ? (
                <View style={styles.applyNow}>
                  <Button
                    title="Submit Output"
                    filled
                    style={{
                      borderRadius: 10,
                      width: "90%",
                    }}
                    onPress={handleNavigateToOutputScreen}
                  />
                </View>
              ) : (
                ""
              )}

              {filteredProjects[0].student_user_id === id &&
              filteredProjects[0].job_finished === 0 &&
              !loading
                ? ""
                : ""}
            </ScrollView>
          )}
        </View>
        <BottomSheet
          ref={sheetRef}
          height={280}
          animationType={"fade"}
          openDuration={100}
          closeDuration={100}
        >
          <View>
            <View style={styles.buttonsOption}>
              <Button
                title="Mark as Done"
                filled
                style={{
                  borderRadius: 10,
                  width: "90%",
                }}
                onPress={() => {
                  confirmMarkAsDone(filteredProjects[0].id);
                  sheetRef.current?.close();
                }}
              />
            </View>

            <View style={styles.buttonsOption}>
              <Button
                title="View Extension Proposed"
                filled
                style={{
                  borderRadius: 10,
                  width: "90%",
                }}
                onPress={() => {
                  sheetRef.current?.close();
                  handlePress();
                }}
              />
            </View>
          </View>
        </BottomSheet>
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
                      Extension Due Date
                    </Text>
                    {filteredProjects[0]?.proposals[0]?.extension_status ===
                    1 ? (
                      <Text style={styles.date}>
                        {dayjs(
                          filteredProjects[0]?.proposals[0]?.extension_due_date
                        ).format("MM/DD/YYYY")}
                      </Text>
                    ) : (
                      <Text style={{ color: "black" }}>
                        No due date extension submitted.
                      </Text>
                    )}
                  </View>
                </View>
              </View>

              {filteredProjects[0]?.proposals[0]?.extension_status === 1 ? (
                <>
                  <TouchableOpacity
                    style={styles.dismiss}
                    onPress={() => {
                      handleAccept(filteredProjects[0].id);
                    }}
                  >
                    <Text style={styles.dismissText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.dismiss, { backgroundColor: "#dc143c" }]}
                    onPress={() => {
                      handleReject(filteredProjects[0].id);
                    }}
                  >
                    <Text style={styles.dismissText}>Reject</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <Text style={{ marginBottom: 10 }}></Text>
              )}
            </View>
          </View>
        </Modal>
        {/* ASK EXTENSION */}
      </AlertNotificationRoot>
    </SafeAreaView>
  );
};

export default ProjectDetailsScreen;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.inputField,
    justifyContent: "space-between",
    alignItems: "center",
  },
  container: {
    backgroundColor: theme.colors.WHITE,
  },

  titleName: {
    textAlign: "center", // Center text horizontally
    marginLeft: -40, // Offset the text to the left to align with the center
    fontSize: 20,
    fontFamily: "Roboto-Bold",
    fontSize: theme.sizes.h3,
    color: theme.colors.BLACKS,
  },

  overviewContainer: {
    flex: 1,
    backgroundColor: theme.colors.WHITE,
    borderTopLeftRadius: 30, // Border radius for top left corner
    borderTopRightRadius: 30, // Border radius for top right corner
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.16,
    shadowRadius: 1.51,
    elevation: 2,
    padding: 30,
    paddingTop: 30,
    height: 790,
  },

  projectTitle: {
    fontFamily: "Roboto-Medium",
    textAlign: "center",
    color: theme.colors.BLACKS,
    fontSize: theme.sizes.h4 + 2,
  },
  jobTime: {
    color: theme.colors.gray,
    fontFamily: "Roboto-Regular",
    fontSize: theme.sizes.h2,
    marginTop: 2,
  },

  dateRange: {
    color: theme.colors.primary,
    fontFamily: "Roboto-Medium",
    fontSize: theme.sizes.h2 + 3,
    marginTop: 4,
  },
  bullet: {
    fontSize: 20,
    color: theme.colors.primary,
  },

  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 20,
  },
  priceContainer: {
    paddingVertical: 10,
    flexDirection: "column",
    alignItems: "center",
    borderColor: theme.colors.grey,
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 8,
    width: 100,
  },
  jobPriceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  jobPrice: {
    fontFamily: "Roboto-Medium",
    fontSize: theme.sizes.h2 + 1,
    color: theme.colors.BLACKS,
  },
  jobRangePrice: {
    fontFamily: "Roboto-Regular",
    fontSize: theme.sizes.h1 + 2,
    color: theme.colors.gray,
    marginTop: 1,
  },
  projectDescriptionTitle: {
    fontFamily: "Roboto-Medium",
    fontSize: theme.sizes.h3 + 2,
    color: theme.colors.BLACKS,
    paddingVertical: 4,
  },

  jobDescription: {
    paddingVertical: 5,
    fontFamily: "Roboto-Light",
    color: theme.colors.gray,
    fontSize: theme.sizes.h2 + 1,
    marginStart: 4,
  },

  jobTagsContainer: {
    flexDirection: "row",
    paddingHorizontal: 8,
    marginTop: 8,
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
  selectedFileContainer: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: theme.colors.white,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 5,
    borderWidth: 1,
    borderColor: theme.colors.grey,
  },
  applyNow: {
    position: "absolute",
    alignItems: "center",
    width: "100%",
    bottom: 0,
  },
  buttonsOption: {
    position: "relative",
    alignItems: "center",
    width: "100%",
    paddingVertical: 10,
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

  dismissText: {
    fontFamily: "Roboto-Medium",
    color: "white",
    padding: 12,
    alignSelf: "center",
  },

  dismiss: {
    width: "90%",
    backgroundColor: theme.colors.primary,
    position: "relative",
    bottom: -1,
    marginBottom: 10,
  },

  image: {
    height: 90,
    width: 90,
    borderRadius: 70,
    borderWidth: 1,
    marginBottom: 10,
    justifyContent: "center",
    alignSelf: "center",
  },
});
