import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Button,
  Modal,
  Alert,
} from "react-native";
import * as theme from "../assets/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { useIsFocused } from "@react-navigation/native";
import LoadingComponent from "../components/LoadingComponent";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import LoadingFlying from "../components/LoadingFlying";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import "dayjs/locale/tl-ph";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import DocumentPicker from "react-native-document-picker";
import CurrencyInput from "react-native-currency-input";
import axios from "axios";
import Feather from "react-native-vector-icons/Feather";
import TagInput from "../components/TagInput";
import { URL } from "@env";
import ErrorModal from "../components/ErrorModal";
import { useProjectContext } from "../hooks/ProjectContext";
const CreateProjectScreenHire = ({ route, navigation }) => {
  const { loading, fetchData } = useProjectContext();
  dayjs.locale("tl-ph");
  const freelancer_id = route.params.freelancer_id;

  const { isStudent, projects, studentId } = route?.params;
  const [jobTitle, setJobTitle] = useState("");
  const [jobCategory, setJobCategory] = useState("");
  const [jobTags, setJobTags] = useState([]);
  const [jobDescription, setJobDescription] = useState("");
  const [jobBudgetFrom, setJobBudgetFrom] = useState("");
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [key, setKey] = useState(0);
  const [selectedFile, setSelectedFile] = useState([]);
  const [isloading, setIsLoading] = useState(false);

  const isFocused = useIsFocused();

  const onChangeTags = (tags) => {
    setJobTags(tags);
  };

  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const formattedStartDate = dayjs(startDate)
    .locale("tl-ph")
    .format("YYYY-MM-DD");

  useEffect(() => {
    if (projects) {
      setJobTitle(projects.job_title);
      setJobCategory(projects.job_category);
      setJobTags(
        projects ? projects?.job_tags?.map((tag) => tag.job_tags) : []
      );
      setJobDescription(projects.job_description);
      setStartDate(dayjs(projects?.job_start_date) || dayjs());
      setJobBudgetFrom(projects.job_budget_from.toString() || "0");
      setEndDate(dayjs(projects?.job_end_date) || dayjs());
      if (projects && projects.attachments) {
        setSelectedFile((prevSelectedFile) => [
          ...(prevSelectedFile || []),
          ...projects.attachments,
        ]);
      } else {
        setSelectedFile([]);
      }
    }
  }, [projects]);

  useEffect(() => {
    if (!isFocused) {
      setJobTitle("");
      setJobDescription("");
      setJobCategory("");
      setJobBudgetFrom("0");
      setStartDate(dayjs());
      setEndDate(dayjs());
      setJobTags([]);
      setSelectedFile(null);
    }
    setKey((prevKey) => prevKey + 1);
  }, [isFocused, route]);

  const onStartDateChange = (selectedDate) => {
    if (selectedDate) {
      setStartDate(selectedDate);
    }
    setShowStartDatePicker(true);
  };

  const pickDocument = async () => {
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
      if (results === null) {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "Error",
          textBody:
            "An error occurred while selecting the file. Please try again.",
          button: "Close",
        });
      } else {
        await setSelectedFile((prevSelectedFiles) => [
          ...prevSelectedFiles,
          ...files,
        ]);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "Error",
          textBody:
            "An error occurred while selecting the file. Please try again.",
          button: "Close",
        });
      }
    }
  };

  const removeSelectedFile = (indexToRemove) => {
    setSelectedFile((prevSelectedFiles) => {
      return prevSelectedFiles.filter((_, index) => index !== indexToRemove);
    });
  };
  useEffect(() => {
    // Calculate end date only if startDate is valid
    if (dayjs(startDate).isValid()) {
      const endDate = dayjs(startDate).add(15, "day").format("YYYY-MM-DD");
      setEndDate(endDate);
    }
  }, [startDate]);

  const handleSubmit = async (projectsID) => {
    if (
      !jobTitle ||
      !jobCategory ||
      (Array.isArray(jobTags) && jobTags.length === 0) ||
      !jobDescription ||
      !startDate ||
      !endDate ||
      !jobBudgetFrom
    ) {
      setErrorMessage(
        "Please fill in all required fields and upload at least one file."
      );
      setHasError(true);
      return;
    }

    const formData = new FormData();
    formData.append("student_user_id", isStudent.studentInfo.id);
    formData.append("freelancer_id", freelancer_id);
    formData.append("job_title", jobTitle);
    formData.append("job_category", jobCategory);
    formData.append("job_description", jobDescription);
    formData.append("job_start_date", formattedStartDate);
    formData.append("job_end_date", endDate);
    formData.append("job_budget_from", jobBudgetFrom);
    formData.append("status", 1);

    jobTags?.forEach((tag, index) => {
      formData.append(`job_tags[${index}]`, tag);
    });

    selectedFile?.forEach((file, index) => {
      formData.append(`attachments[${index}]`, {
        uri: file.uri,
        name: file.name,
        type: file.type,
      });
    });

    try {
      setIsLoading(true);
      let url = projectsID
        ? `${URL}/project/created/update/${projectsID}`
        : `${URL}/project/create-project`;
      const response = await axios({
        method: "post",
        url: url,
        data: formData,
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${isStudent?.token}`,
        },
      });

      if (response.status === 200) {
        await fetchData();
        studentId
          ? Toast.show({
              type: ALERT_TYPE.SUCCESS,
              title: "Success",
              textBody: "Job has been updated successfully.",
              button: "Close",
            })
          : Toast.show({
              type: ALERT_TYPE.SUCCESS,
              title: "Success",
              textBody: "Job has been created successfully.",
              button: "Close",
            });
      }
      await navigation.navigate("HomeScreen");
    } catch (err) {
      console.log(err);
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Error",
        textBody: "Something Went Wrong, Please Try again.",
        button: "Close",
      });
    } finally {
      setJobTitle("");
      setJobDescription("");
      setJobBudgetFrom("0");
      setSelectedFile([]);
      setJobCategory("");
      setStartDate(dayjs());
      setEndDate(dayjs());
      setKey((prevKey) => prevKey - 1);
      setIsLoading(false);
    }
  };

  const confirmRemoveFile = (fileIndex) => {
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
          onPress: () => removeSelectedFile(fileIndex),
        },
      ],
      { cancelable: false }
    );
  };
  return (
    <SafeAreaView style={styles.container}>
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
              fontFamily: "Roboto-Medium",
              color: theme.colors.BLACKS,
              fontSize: 18,
            }}
          >
            {projects ? "Edit Project Created" : "Create Project"}
          </Text>
          <Text>{"   "}</Text>
        </View>

        {loading || isloading ? (
          <LoadingComponent />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View style={theme.utilities.inputContainer}>
              <Text style={theme.utilities.title}>Project Title</Text>
              <TextInput
                style={theme.utilities.inputField}
                placeholder="App Design and Development"
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.nativeEvent.text)}
                placeholderTextColor="#a9a9a9"
                autoCapitalize="words"
              />
            </View>

            <View style={theme.utilities.inputContainer}>
              <Text style={theme.utilities.title}>Project Category</Text>
              <TextInput
                autoCapitalize="words"
                style={theme.utilities.inputField}
                placeholder="Logo Design"
                type="text"
                value={jobCategory}
                onChange={(e) => setJobCategory(e.nativeEvent.text)}
                placeholderTextColor="#a9a9a9"
              />
            </View>

            <View style={theme.utilities.inputContainer}>
              <Text style={[theme.utilities.title, { marginBottom: -5 }]}>
                Project Tags
              </Text>
              <TagInput
                key={key}
                initialTags={jobTags}
                onChangeTags={onChangeTags}
              />
            </View>

            <View style={theme.utilities.inputContainer}>
              <Text style={theme.utilities.title}>Budget</Text>
              <CurrencyInput
                style={theme.utilities.inputField}
                value={jobBudgetFrom}
                onChangeValue={setJobBudgetFrom}
                prefix="₱"
                delimiter=","
                separator="."
                precision={2}
                minValue={0}
                onChangeText={(formattedValue) => {
                  if (!formattedValue || parseFloat(formattedValue) === 0) {
                    setJobBudgetFrom("0");
                  }
                }}
              />
            </View>

            <View style={theme.utilities.inputContainer}>
              <Text style={theme.utilities.title}>Project Description</Text>
              <TextInput
                style={[theme.utilities.inputField, { height: 100 }]}
                placeholderTextColor="#a9a9a9"
                placeholder="Enter some brief about project "
                type="text"
                value={jobDescription}
                onChangeText={(text) => {
                  if (text?.length <= 300) {
                    setJobDescription(text);
                  }
                }}
                multiline
                autoCorrect={false}
                numberOfLines={4}
                maxHeight={100}
                maxLength={300}
                textAlignVertical="top"
              />
              <View style={{ alignItems: "flex-end", marginRight: 5 }}>
                <Text>{jobDescription?.length} / 300</Text>
              </View>
            </View>

            <View style={theme.utilities.inputContainer}>
              <Text style={theme.utilities.title}>Schedule</Text>
              <View
                style={[
                  theme.utilities.inputField,
                  { height: 65, justifyContent: "space-around" },
                ]}
              >
                <View>
                  <Text
                    style={{
                      fontFamily: "Roboto-Light",
                      marginBottom: 3,
                      color: "#a9a9a9",
                    }}
                  >
                    Start Date:
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowStartDatePicker(true)}
                  >
                    <Text style={styles.date}>
                      {startDate ? dayjs(startDate).format("MM/DD/YYYY") : "-"}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.verticalLine} />

                <View>
                  <Text
                    style={{
                      fontFamily: "Roboto-Light",
                      color: "#a9a9a9",
                      marginBottom: 3,
                    }}
                  >
                    End Date:
                  </Text>
                  <Text style={styles.date}>
                    {startDate
                      ? dayjs(startDate).add(15, "days").format("MM/DD/YYYY")
                      : "-"}
                  </Text>
                </View>
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
                      date={startDate} // Pass current startDate
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

            <View
              style={[theme.utilities.inputContainer, { marginBottom: 25 }]}
            >
              <View
                style={[
                  theme.utilities.inputField,
                  { height: 80, justifyContent: "center" },
                ]}
              >
                <TouchableOpacity onPress={pickDocument}>
                  <FontAwesome
                    name="cloud-upload"
                    size={38}
                    color="black"
                    style={styles.uploadLogo}
                  />
                  <Text style={styles.uploadText}>Upload Files</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View>
              {selectedFile?.map((file, index) => (
                <View key={index} style={styles.selectedFileContainer}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
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
                      {file.original_name?.length > 10
                        ? `${file.original_name?.substring(
                            0,
                            10
                          )}...${file.original_name.substring(
                            file.original_name.lastIndexOf(".") + 1
                          )}`
                        : file.original_name
                        ? `${
                            file.original_name
                          } (${file.original_name.substring(
                            file.original_name.lastIndexOf(".") + 1
                          )})`
                        : file.name?.length > 10
                        ? `${file.name?.substring(0, 10)}.${file.name.substring(
                            file.name.lastIndexOf(".") + 1
                          )}`
                        : `${file.name} (${file.name.substring(
                            file.name.lastIndexOf(".") + 1
                          )})`}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={{ marginLeft: "auto" }}
                    onPress={() => confirmRemoveFile(index)}
                  >
                    <Ionicons
                      name={"close-circle-outline"}
                      size={18}
                      color={theme.colors.BLACKS}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={{
                position: "relative",
                backgroundColor: theme.colors.primary,
                borderRadius: 10,
                marginTop: 13,
                width: "100%",
                alignSelf: "center",
              }}
              onPress={() => handleSubmit()}
            >
              <Text style={styles.postText}>SUBMIT</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        <View>
          {hasError && (
            <ErrorModal
              errorMessage={errorMessage}
              onClose={() => {
                setHasError(false);
                setErrorMessage("");
              }}
            />
          )}
        </View>
      </AlertNotificationRoot>
    </SafeAreaView>
  );
};

export default CreateProjectScreenHire;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.WHITE,
    padding: 24,
  },

  uploadText: {
    fontSize: theme.sizes.h3,
    color: theme.colors.BLACKS,
    fontFamily: "Roboto-Medium",
  },

  linearGradientText: {
    width: 300,
    alignSelf: "center",
    borderRadius: 12,
    height: 50,
    marginTop: 35,
  },

  postText: {
    color: theme.colors.WHITE,
    alignSelf: "center",
    padding: 13,
    fontWeight: "700",
    fontSize: 18,
    letterSpacing: 1,
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  pickerContainer: {
    backgroundColor: theme.colors.WHITE,
    padding: 30,
    borderRadius: 10,
    width: "90%",
  },

  verticalLine: {
    width: 2,
    height: "70%",
    backgroundColor: theme.colors.gray,
  },

  date: {
    fontSize: 20,
    color: "black",
    fontFamily: "ProximaNova-Bold",
  },

  uploadLogo: {
    alignSelf: "center", // Center the icon horiz
    color: theme.colors.primary,
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

  inputRow: {
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 16,
    fontFamily: "Roboto-Light",
    borderWidth: 1,
    borderColor: theme.colors.primary,
    padding: 5,
  },
  inputColumn: {
    flex: 1,
  },

  textInput: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Roboto-Medium",
    marginBottom: 0,
    paddingBottom: 0,
  },
  label: {
    textAlign: "center",
    fontFamily: "Roboto-Light",
    color: "#a9a9a9",
  },
});
