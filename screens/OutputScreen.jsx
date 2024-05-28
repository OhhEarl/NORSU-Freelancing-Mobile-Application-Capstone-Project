import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import axios from "axios";
import { URL } from "@env";
import * as theme from "../assets/constants/theme";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useProjectContext } from "../hooks/ProjectContext";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import RNFetchBlob from "rn-fetch-blob";
import DocumentPicker from "react-native-document-picker";
import LoadingComponent from "../components/LoadingComponent";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import Button from "../components/Button";
const OutputScreen = ({ navigation, route }) => {
  const token = route.params.isStudent.token;

  const id = route.params.isStudent.studentInfo.id;
  const { loading, fetchData } = useProjectContext();
  const [isLoading, setLoading] = useState(false);
  const { item, projectId, enabled, userID, project, finished, output } =
    route.params;

  const JobCompleted = project?.project_info?.job_finished === 2;
  const show = item?.[0]?.student_user_id || userID === id;

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState(
    item ? item?.[0].project_outputs : []
  );
  const JobOwnedID = item?.[0]?.student_user_id || uploadedFiles[0]?.user_id;


  const fetchOutputAttachment = async () => {
    if (enabled) {
      try {
        setLoading(true);
        const response = await axios.get(
          `${URL}/project/outputs/fetch/${projectId}/${userID}`,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setUploadedFiles(response.data.data);
        } else {
          setUploadedFiles([]);
        }
      } catch (error) {
        Alert.alert("Something Went Wrong. Please Try Again Later.");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (item) {
      setUploadedFiles(item?.[0].project_outputs);
    } else if (enabled) {
      fetchOutputAttachment();
    }
  }, [item]);

  const handleFileSelection = async () => {
    try {
      const results = await DocumentPicker.pick({
        allowMultiSelection: true,
        type: [DocumentPicker.types.allFiles],
      });

      const files = results.map((file) => ({
        uri: file.uri,
        type: file.type,
        name: file.name,
      }));

      if (!results) {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "ERROR",
          textBody:
            "An error occurred while selecting the file. Please try again.",
          button: "Close",
        });
      } else if (results === undefined) {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "ERROR",
          textBody:
            "An error occurred while selecting the file. Please try again.",
          button: "Close",
        });
      } else {
        setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
      }
    } catch (err) {
      if (err) {
        await Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "ERROR",
          textBody:
            "An error occurred while selecting the file. Please try again.",
          button: "Close",
        });
      }
    }
  };

  const handleUpload = async () => {
    if (selectedFiles?.length === 0) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "ERROR",
        textBody: "Please upload a file before submitting.",
        button: "Close",
      });
      return;
    }

    try {
      setLoading(true);
      const promises = selectedFiles.map(async (file) => {
        const formData = new FormData();
        selectedFiles.forEach((file, index) => {
          formData.append(`files[${index}]`, {
            uri: file.uri,
            type: file.type,
            name: file.name,
          });
        });
        formData.append("project_id", item?.[0].id || projectId);
        formData.append("user_id", JobOwnedID || output);
        formData.append("freelancer_id", id || userID);

        const response = await axios.post(`${URL}/project/outputs`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          await fetchData();
          Toast.show({
            type: ALERT_TYPE.SUCCESS,
            title: "Success",
            textBody: "Project output submitted successfully.",
            button: "Close",
          });
        }
      });

      await Promise.all(promises);
    } catch (error) {
      if (error) {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "Error",
          textBody: "Something Went Wrong." + error.message,
          button: "Close",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (file) => {
    const baseUrlWithoutApi = URL.replace("/api", "");

    try {
      const downloadConfig = {
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: `${RNFetchBlob.fs.dirs.DownloadDir}/${file.name}`,
          Description: "",
          notification: true,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await RNFetchBlob.config(downloadConfig).fetch(
        "GET",
        `${baseUrlWithoutApi}/storage/${file.path}`
      );
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: "SUCCESS",
        textBody: "Downloading.Please Wait.",
        button: "Close",
      });
    } catch (error) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Something Went Wrong. Please Try Again.",
        button: "Close",
      });
    }
  };

  const confirmRemoveFile = (fileId, isUploaded) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to remove this file?",
      [
        {
          text: "Cancel",

          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => removeSelectedFile(fileId, isUploaded),
        },
      ],
      { cancelable: false }
    );
  };

  const removeSelectedFile = async (fileId, isUploaded) => {
    if (isUploaded) {
      try {
        setLoading(true);
        const response = await axios.post(
          `${URL}/proposal/outputs/delete/${fileId}`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          await fetchOutputAttachment();
          Toast.show({
            type: ALERT_TYPE.SUCCESS,
            title: "SUCCESS",
            textBody: "File removed successfully.",
            button: "Close",
          });
        } else {
          throw new Error("Failed to remove file. Please try again.");
        }
      } catch (error) {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "Error",
          textBody: "Something Went Wrong. Please Try Again.",
          button: "Close",
        });
      } finally {
        setLoading(false);
      }
    } else {
      setSelectedFiles((prevFiles) =>
        prevFiles.filter((file) => file.uri !== fileId)
      );
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: "SUCCESS",
        textBody: "File removed successfully.",
        button: "Close",
      });
    }
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
            Submitted Outputs
          </Text>
          <Text></Text>
        </View>
        {loading || isLoading ? (
          <LoadingComponent />
        ) : (
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
              <View>
                {!show ? (
                  <Text></Text>
                ) : (
                  <TouchableOpacity
                    style={styles.uploadFileContainer}
                    onPress={handleFileSelection}
                  >
                    <FontAwesome
                      name="cloud-upload"
                      size={40}
                      color={theme.colors.primary}
                      style={styles.uploadLogo}
                    />
                    <Text style={styles.uploadText}>Upload a File</Text>
                    <Text style={styles.browseText}>
                      Browse to choose a file
                    </Text>
                  </TouchableOpacity>
                )}

                {!show ? (
                  <Text></Text>
                ) : (
                  <TouchableOpacity
                    style={styles.submitFile}
                    disabled={selectedFiles?.length === 0}
                    onPress={handleUpload}
                  >
                    <Text style={styles.submitFileText}>SUBMIT</Text>
                  </TouchableOpacity>
                )}
              </View>

              <Text style={styles.attachments}>Attachments</Text>

              <View>
                {selectedFiles?.length > 0 ? (
                  <View>
                    {selectedFiles.map((file, index) => (
                      <View key={index} style={styles.selectedFileContainer}>
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
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
                            {file.name.length > 8
                              ? `${file.name.substring(
                                  0,
                                  18
                                )}...${file.name.substring(
                                  file.name.lastIndexOf(".") + 1
                                )}`
                              : file.name}
                          </Text>
                        </View>

                        {!show ? (
                          <TouchableOpacity
                            style={{ marginLeft: "auto" }}
                            onPress={() => handleDownload(file)}
                          >
                            <Ionicons
                              name={"cloud-download-outline"}
                              size={24}
                              color={theme.colors.BLACKS}
                            />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            style={{ marginLeft: "auto" }}
                            onPress={() => confirmRemoveFile(file.uri, false)}
                          >
                            <Ionicons
                              name={"close-circle-outline"}
                              size={24}
                              color={theme.colors.BLACKS}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text></Text>
                )}
              </View>

              <View>
                {uploadedFiles?.map((file, index) => (
                  <View key={index} style={styles.selectedFileContainer}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
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
                        {file.name.length > 8
                          ? `${file.name.substring(
                              0,
                              18
                            )}...${file.name.substring(
                              file.name.lastIndexOf(".") + 1
                            )}`
                          : file.name}
                      </Text>
                    </View>
                    {!show ? (
                      <TouchableOpacity
                        style={{ marginLeft: "auto" }}
                        onPress={() => handleDownload(file)}
                      >
                        <Ionicons
                          name={"cloud-download-outline"}
                          size={25}
                          color={theme.colors.BLACKS}
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={{ marginLeft: "auto" }}
                        onPress={() => confirmRemoveFile(file.id, true)}
                      >
                        <Ionicons
                          name={"close-circle-outline"}
                          size={25}
                          color={theme.colors.BLACKS}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        )}

        {!show && !finished && !loading && !isLoading ? (
          <Button
            title="Accept Output"
            filled
            style={{
              borderRadius: 10,
              position: "absolute",
              alignItems: "center",
              width: "100%",
              bottom: 0,
            }}
            onPress={() =>
              navigation.navigate("GcashPaymentScreen", {
                project_id: item?.project_info?.id || projectId,
                user_id: item?.project_info?.student_user_id || id,
                freelancer_id: item?.freelancer_info?.id || userID,
                project_price:
                  item?.project_info?.job_budget_from ||
                  project?.job_proposal?.job_budget_from,
              })
            }
          />
        ) : (
          <Text></Text>
        )}

        {(!isLoading || !loading) &&
        id === JobOwnedID &&
        (item?.project_info?.job_finished === 2 ||
          uploadedFiles[0]?.project_info?.job_finished === 2) ? (
          <Button
            title="Send FeedBack"
            filled
            style={{
              borderRadius: 10,
              position: "absolute",
              alignItems: "center",
              width: "100%",
              bottom: 0,
            }}
            onPress={() =>
              navigation.navigate("FeedBackRatingScreen", {
                freelancer_id:
                  project?.freelancer_info?.id ||
                  uploadedFiles[0]?.freelancer_id,
              })
            }
          />
        ) : (
          <Text></Text>
        )}
      </AlertNotificationRoot>
    </SafeAreaView>
  );
};

export default OutputScreen;
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: theme.colors.WHITE,
    padding: 18,
  },
  container: {
    flex: 1,
    marginVertical: 25,
    marginHorizontal: 15,
  },

  uploadFileContainer: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    height: 100,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eaf8ff",
  },
  submitFileText: {
    fontFamily: "Roboto-Bold",
    fontSize: theme.sizes.h4,
    paddingVertical: 15,
    color: "white",
  },
  submitFile: {
    marginTop: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
  },
  uploadText: {
    color: theme.colors.primary,
    fontFamily: "Roboto-Medium",
    fontSize: theme.sizes.h3,
  },
  browseText: {
    color: theme.colors.primary,
    fontFamily: "Roboto-Regular",
    fontSize: theme.sizes.h2,
  },

  attachments: {
    marginTop: 12,
    fontFamily: "Roboto-Medium",
    fontSize: theme.sizes.h3 + 2,
    color: "black",
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

  updateAt: {
    fontFamily: "Roboto-Light",
    color: "black",
    marginTop: -5,
    fontSize: theme.sizes.h2 - 1,
  },

  notification: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
});
