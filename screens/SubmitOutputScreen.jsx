import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  TextInput,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import { URL } from "@env";
import * as theme from "../assets/constants/theme";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import RNFetchBlob from "rn-fetch-blob";
import DocumentPicker from "react-native-document-picker";
import LoadingComponent from "../components/LoadingComponent";
import dayjs from "dayjs";
import Spinner from "react-native-loading-spinner-overlay";

const SubmitOutputScreen = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);

  const { project } = route?.params;
  const { token } = route?.params?.isStudent;
  // console.log(JSON.stringify(project, null, 2));
  const projectId = project?.project_id || project.id;

  const user_id = route.params.isStudent.studentInfo.id;

  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      selectedFiles(null);
    }
  }, [isFocused, route]);

  console.log(token);

  const fetchOutputAttachment = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${URL}/project/outputs/fetch/${projectId}`,
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
      }
    } catch (error) {
      Alert.alert("Something Went Wrong. Please Try Again Later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOutputAttachment();
  }, [projectId]);

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

      setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    } catch (err) {
      Alert.alert("Error", "Error in selecting file. Please Try Again.");
    }
  };
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert("Please select files to upload.");
      return;
    }
    setLoading(true);
    try {
      const promises = selectedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append("files[]", file);
        formData.append("project_id", project.project_id);
        formData.append("user_id", project.user_id);
        formData.append("freelancer_id", project.freelancer_id);

        const response = await axios.post(`${URL}/project/outputs`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          await fetchOutputAttachment();
          Alert.alert("Success", "Files Uploaded Successfully");
        }
      });

      await Promise.all(promises);
      setSelectedFiles([]);
    } catch (error) {
      Alert.alert("Error", "Something Went Wrong. Please Try Again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${URL}/comments/${projectId}`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        } // Replace with actual comment fetching URL
      );
      setComments(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [user_id]); // Fetch comments on component mount

  const handleCommentSubmit = async () => {
    if (!newComment) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("comment", newComment);
      formData.append("project_id", projectId);
      formData.append("user_id", user_id);

      const response = await axios.post(`${URL}/proposal/comments`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        await fetchComments();
        setNewComment("");
      } else {
        throw new Error("Failed to add comment");
      }
    } catch (error) {
      Alert.alert("Something Went Wrong. Please Try Again!");
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
      Alert.alert("Downloading. Please Wait.");
    } catch (error) {
      Alert.alert(error);
    }
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
          Alert.alert("Success", "File Removed Successfully.");
        } else {
          throw new Error("Failed to remove file. Please try again.");
        }
      } catch (error) {
        Alert.alert("Error", "Something Went Wrong. Please Try Again.");
      } finally {
        setLoading(false);
      }
    } else {
      setSelectedFiles((prevFiles) =>
        prevFiles.filter((file) => file.uri !== fileId)
      );
      Alert.alert("Success", "File Removed Successfully.");
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

  const confirmDeleteComment = (commentId) => {
    Alert.alert(
      "Confirm Delete Comment",
      "Are you sure you want to delete this comment?",
      [
        { text: "Cancel", onPress: () => {}, style: "cancel" },
        {
          text: "Delete",
          onPress: () => deleteComment(commentId),
          style: "destructive",
        },
      ]
    );
  };
  const deleteComment = async (id) => {
    const formData = new FormData();

    try {
      setLoading(true);
      const response = await axios.post(
        `${URL}/comment/delete/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        await fetchComments();
        Alert.alert("Comment Removed Successfully.");
      } else {
        throw new Error("Failed to remove file. Please try again");
      }
    } catch (error) {
      Alert.alert("Something Went Wrong. Please Try Again.");
    } finally {
      setLoading(false);
    }
  };

  function renderCommentItem({ item }) {
    const baseUrlWithoutApi = URL.replace("/api", "");
    return (
      <View style={styles.commentItem}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            height={35}
            width={35}
            style={{ borderRadius: 50 }}
            source={
              item?.user?.user_avatar
                ? {
                    uri: `${baseUrlWithoutApi}/storage/${item.user.user_avatar}`,
                  }
                : {
                    uri: "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?w=740&t=st=1670148608~exp=1670149208~hmac=bc57b66d67d2b9f4929c8e592ff17e8c8660721608add2f18fc20d19c1aab7e4",
                  }
            }
          />
          <View style={styles.infoContainer}>
            <View>
              <Text style={styles.userName}>{item?.user?.user_name}</Text>
              <Text style={styles.updateAt}>
                {dayjs(item?.updated_at).fromNow()}
              </Text>
            </View>

            {item.user.user_id === user_id ? (
              <TouchableOpacity
                style={{ alignContent: "flex-end" }}
                onPress={() => confirmDeleteComment(item.id)}
              >
                <MaterialIcons name={"delete"} size={20} color={"black"} />
              </TouchableOpacity>
            ) : (
              <Text></Text>
            )}
          </View>
        </View>

        <Text style={styles.commentText}>{item?.comment}</Text>
      </View>
    );
  }
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
      {loading ? (
        <LoadingComponent />
      ) : (
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            {user_id === project.freelancer_id ? (
              <View>
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
                  <Text style={styles.browseText}>Browse to choose a file</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.submitFile}
                  disabled={selectedFiles.length === 0}
                  onPress={handleUpload}
                >
                  <Text style={styles.submitFileText}>SUBMIT</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text></Text>
            )}

            <Text style={styles.attachments}>Attachments</Text>

            <View>
              {selectedFiles.length > 0 || uploadedFiles.length > 0 ? (
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
                          {file.name.length > 10
                            ? `${file.name.substring(
                                0,
                                10
                              )}...${file.name.substring(
                                file.name.lastIndexOf(".") + 1
                              )}`
                            : file.name}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={{ marginLeft: "auto" }}
                        onPress={() => confirmRemoveFile(file.uri, false)}
                      >
                        <Ionicons
                          name={"close-circle-outline"}
                          size={18}
                          color={theme.colors.BLACKS}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
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
                          {file?.name?.length > 10
                            ? `${file?.name?.substring(0, 10)}...${
                                file.mime_type
                              }`
                            : `${file?.name}.${file.mime_type}`}
                        </Text>
                      </View>
                      {project.student_user_id === user_id ? (
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
              ) : (
                <Text>No Attachment Submitted</Text>
              )}
            </View>
            <View>
              <Text style={styles.attachments}>Add Comment</Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  marginTop: 10,
                }}
              >
                <TextInput
                  style={styles.inputField}
                  placeholderTextColor="#a9a9a9"
                  placeholder="Write a comment..."
                  type="text"
                  value={newComment}
                  onChangeText={(text) => {
                    setNewComment(text);
                  }}
                  multiline
                  autoCorrect={false}
                  numberOfLines={4}
                  height={100}
                  maxHeight={300}
                  textAlignVertical="top"
                />
                <TouchableOpacity
                  style={{ marginStart: 10, width: "10%" }}
                  onPress={handleCommentSubmit}
                >
                  <Ionicons
                    name={"send-sharp"}
                    color={theme.colors.primary}
                    size={30}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.attachments}>Comments</Text>

            {loading ? (
              <LoadingComponent />
            ) : comments.length > 0 ? (
              <FlatList
                data={comments}
                renderItem={renderCommentItem}
                keyExtractor={(item) => item?.id?.toString()} // Unique key for each comment
                scrollEnabled={false}
              />
            ) : (
              <Text> No Comments</Text>
            )}
          </View>
        </ScrollView>
      )}

      {project?.student_user_id === user_id ? (
        <TouchableOpacity
          style={{ marginLeft: "auto" }}
          onPress={() =>
            navigation.navigate("GcashPaymentScreen", {
              project_id: project?.project_info?.id || project?.id,
              user_id:
                project?.project_info?.student_user_id ||
                project?.student_user_id,
              freelancer_id:
                project?.freelancer_info?.id ||
                project?.proposals?.freelancer_id,
              project_price:
                project?.project_info?.job_budget_from ||
                project?.job_budget_from,
            })
          }
        >
          <Text style={styles.submitFileText}>SUBMIT</Text>
        </TouchableOpacity>
      ) : (
        <></>
      )}
    </SafeAreaView>
  );
};

export default SubmitOutputScreen;
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

  inputField: {
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 10,
    width: "90%",
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 16,
    fontFamily: "Roboto-Light",
    color: "black",
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },

  commentItem: {
    borderBottomWidth: 1,
    borderColor: theme.colors.GRAY_LIGHT,
    marginTop: 10,
    width: "100%",
  },

  commentText: {
    marginVertical: 10,
    fontFamily: "Roboto-Light",
    color: "black",
  },

  infoContainer: {
    marginStart: 8,
    flexDirection: "row",
    alignItems: "center",
    width: "85%",

    justifyContent: "space-between",
    position: "relative",
  },
  userName: {
    fontFamily: "Roboto-Medium",
    color: "black",
  },

  updateAt: {
    fontFamily: "Roboto-Light",
    color: "black",
    marginTop: -5,
    fontSize: theme.sizes.h2 - 1,
  },
});
