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
import { SelectList } from "react-native-dropdown-select-list";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGetIsStudent } from "../hooks/dataHooks/useGetIsStudent";
import { useIsFocused } from "@react-navigation/native";
import LoadingComponent from "../components/LoadingComponent";
import LinearGradient from "react-native-linear-gradient";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import useJobCategory from "../hooks/dataHooks/useJobCategory";
import DocumentPicker from "react-native-document-picker";
import CurrencyInput from "react-native-currency-input";
import axios from "axios";

import Feather from "react-native-vector-icons/Feather";
import TagInput from "../hooks/TagInput";
const CreateProjectScreen = ({ route, navigation }) => {
  const { project, isEditing, token, id } = route?.params || {};
  const isFocused = useIsFocused();
  const [projectID, setProjectID] = useState(null);
  const [selectedFile, setSelectedFile] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [jobTitle, setJobTitle] = useState(""); //! Project Name

  const [jobTags, setJobTags] = useState(
    project ? project.job_tags.map((tag) => tag.job_tags) : []
  );
  const [jobDescription, setJobDescription] = useState(""); //! Project Description
  const [jobBudgetFrom, setJobBudgetFrom] = useState("0"); //! Project Budget Range From
  const [jobBudgetTo, setJobBudgetTo] = useState("0"); //! Project Budget Range To
  const [startDate, setStartDate] = useState(dayjs()); //! Project Schedule From
  const [endDate, setEndDate] = useState(dayjs()); //! Project Schedule To
  const [showStartDatePicker, setShowStartDatePicker] = useState(false); //! SHOW SCHEDULE PICKED FROM
  const [showEndDatePicker, setShowEndDatePicker] = useState(false); //! SHOW SCHEDULE PICKED FROM
  const [placeholder, setPlaceholder] = useState("No Data Found"); //! PLACEHOLDER FOR PROJECT CATEGORY IF NO DATA FOUND
  const [error, loading, isStudent] = useGetIsStudent();

  const [defaultCategory, setDefaultCategory] = useState(null);
  const [categoryJob, setCategoryJob] = useState(null); //! Project Category
  const [jobCategories, categoryLoading] = useJobCategory();
  const [key, setKey] = useState(0);

  //! --------------------PROJECT CATEGORY ------------------------- //
  const onChangeTags = (tags) => {
    setJobTags(tags);
  };

  useEffect(() => {
    if (isEditing && project) {
      setProjectID(project?.id || null);
      setJobTitle(project.job_title || "");
      setJobDescription(project.job_description || "");
      setJobBudgetFrom(project.job_budget_from.toString() || "0");
      setJobBudgetTo(project.job_budget_to.toString() || "0");
      setStartDate(dayjs(project.job_start_date) || dayjs());
      setEndDate(dayjs(project.job_end_date) || dayjs());
      setSelectedFile(project.attachments || "");
      setCategoryJob(project.job_category_id || "");
      if (project.job_tags && project.job_tags.length > 0) {
        const extractedJobTags = project.job_tags.map((tag) => tag.job_tags);
        setJobTags(extractedJobTags); // Update jobTags state with the tags from the project data
        console.log("Updated jobTags:", extractedJobTags); // Debug log
      } else {
        setJobTags([]); // Set jobTags to empty array if project.job_tags is empty
        console.log("jobTags set to empty array"); // Debug log
      }
    } else {
      setJobTags([]);
    }

    setKey((prevKey) => prevKey + 1);
  }, [project, isEditing]);

  useEffect(() => {
    if (!isFocused) {
      setJobTitle("");
      setCategoryJob("");
      setJobDescription("");
      setJobBudgetFrom("0");
      setJobBudgetTo("");
      setStartDate(dayjs());
      setEndDate(dayjs());
      setJobTags([]);
      setSelectedFile(null);
      setProjectID(null);
      setDefaultCategory(null);
    }
  }, [isFocused]);

  //! --------------------PROJECT CATEGORY ------------------------- //

  //* --------------------------------------------------------------- *//

  //! --------------------DATE PICKER ------------------------- //
  const togglePicker = (picker) => {
    if (picker === "start") {
      setShowStartDatePicker(!showStartDatePicker);
    } else if (picker === "end") {
      setShowEndDatePicker(!showEndDatePicker);
    }
  };

  const onStartDateChange = (selectedDate) => {
    if (selectedDate) {
      setStartDate(selectedDate);
      setShowStartDatePicker(false); // Close the picker
    }
  };

  const onEndDateChange = (selectedDate) => {
    if (selectedDate) {
      setEndDate(selectedDate);
      setShowEndDatePicker(false); // Close the picker
    }
  };
  //! --------------------DATE PICKER ------------------------- //

  //* --------------------------------------------------------------- *//

  //! --------------------DOCUMENT PICKER ------------------------- !//

  const pickDocument = async () => {
    try {
      const results = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: true,
      });
      results.forEach(async (result) => {
        const fileSize = result.size;

        const maxSize = 15 * 1024 * 1024;
        if (fileSize > maxSize) {
          Alert.alert(
            "File Size Limit Exceeded",
            "Please select a file up to 15 MB."
          );
        } else {
          setIsLoading(true);
          setSelectedFile((prevSelectedFiles) => [
            ...prevSelectedFiles,
            result,
          ]);
          setIsLoading(false);
        }
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        return false;
      } else {
        throw err;
      }
    }
  };

  const removeSelectedFile = (indexToRemove) => {
    setSelectedFile((prevSelectedFiles) => {
      return prevSelectedFiles.filter((_, index) => index !== indexToRemove);
    });
  };

  //! --------------------DOCUMENT PICKER ------------------------- !//

  //! --------------------HANDLE SUBMIT BUTTON ------------------------- !//

  const handleSubmit = async (projectID) => {
    if (
      !jobTitle ||
      !categoryJob ||
      !jobTags ||
      !jobDescription ||
      !startDate ||
      !endDate ||
      !jobBudgetFrom ||
      !jobBudgetTo
    ) {
      Alert.alert(
        "Error",
        "Please fill in all required fields and upload at least one file."
      );
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("student_user_id", isStudent?.studentInfo?.id);
    formData.append("job_title", jobTitle);
    formData.append("job_category_id", categoryJob);
    formData.append("job_description", jobDescription);
    formData.append("job_start_date", startDate.toISOString().split("T")[0]);
    formData.append("job_end_date", endDate.toISOString().split("T")[0]);
    formData.append("job_budget_from", jobBudgetFrom);
    formData.append("job_budget_to", jobBudgetTo);
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
      let url = projectID
        ? `http://10.0.2.2:8000/api/project/created/update/${projectID}`
        : "http://10.0.2.2:8000/api/project/create-project";
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

      if (response.status === 201 || response.status === 200) {
        await navigation.navigate("HomeScreen", { projectUpdate: true });
        alert(
          projectID
            ? "Job has been updated successfully."
            : "Job has been posted successfully."
        );
      } else {
        alert("Something went wrong. Please Try Again!");
      }
    } catch (err) {
      alert(err);
    } finally {
      setJobTitle("");
      setJobDescription("");
      setJobBudgetFrom("0");
      setJobBudgetTo("0");
      setSelectedFile([]);
      setStartDate(dayjs());
      setEndDate(dayjs());
      setIsLoading(false);
      setCategoryJob([]);
    }

    setIsLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {project ? (
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

            // onPress={() => {
            //   navigation.navigate("ProjectCreated", {
            //     token: token,
            //     user: project,
            //     id: id,
            //     project: project,
            //   });
            // }}
          />
          <Text
            style={{
              marginRight: 25,
              fontFamily: "Roboto-Medium",
              color: theme.colors.BLACKS,
              fontSize: 18,
            }}
          >
            Edit Project Created
          </Text>
          <Text></Text>
        </View>
      ) : (
        ""
      )}
      {isloading || categoryLoading ? (
        <LoadingComponent />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <Text style={theme.utilities.header}>
            {!project ? "Let's Get Your Project Listed" : ""}
          </Text>
          <View style={theme.utilities.inputContainer}>
            <Text style={theme.utilities.title}>Project Name</Text>
            <TextInput
              style={theme.utilities.inputField}
              placeholder="App Design and Development"
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.nativeEvent.text)}
            />
          </View>

          <View style={theme.utilities.inputContainer}>
            <Text style={theme.utilities.title}>Project Category</Text>
            <SelectList
              setSelected={setCategoryJob}
              defaultOption={defaultCategory}
              data={jobCategories}
              placeholder={"Select Category"}
              dropdownItemStyles={{ marginVertical: 5 }}
              boxStyles={{ borderColor: theme.colors.primary }}
              fontFamily="Roboto-Light"
            />
          </View>

          <View style={theme.utilities.inputContainer}>
            <Text style={theme.utilities.title}>Project Tags</Text>
            <TagInput
              key={key}
              initialTags={jobTags}
              onChangeTags={onChangeTags}
            />
          </View>

          <View style={theme.utilities.inputContainer}>
            <Text style={theme.utilities.title}>Project Description</Text>
            <TextInput
              style={[theme.utilities.inputField, { height: 100 }]}
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
                <Text style={{ fontFamily: "Roboto-Light", marginBottom: 3 }}>
                  Start Date:
                </Text>
                <TouchableOpacity onPress={() => togglePicker("start")}>
                  <Text style={styles.date}>
                    {dayjs(startDate).format("MM/DD/YYYY")}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.verticalLine} />

              <View>
                <Text style={{ fontFamily: "Roboto-Light" }}>End Date:</Text>
                <TouchableOpacity onPress={() => togglePicker("end")}>
                  <Text style={styles.date}>
                    {dayjs(endDate).format("MM/DD/YYYY")}
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

              <Modal
                visible={showEndDatePicker}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowEndDatePicker(false)}
              >
                <View style={styles.modalContainer}>
                  <View style={styles.pickerContainer}>
                    <DateTimePicker
                      date={endDate}
                      onChange={(params) => onEndDateChange(params.date)}
                    />
                    <Button
                      title="Close"
                      onPress={() => setShowEndDatePicker(false)}
                    />
                  </View>
                </View>
              </Modal>
            </View>
          </View>

          <View style={theme.utilities.inputContainer}>
            <Text style={theme.utilities.title}>Budget</Text>
            <View style={styles.inputRow}>
              <View style={styles.inputColumn}>
                <Text style={styles.label}>Start Budget:</Text>

                <CurrencyInput
                  style={styles.textInput}
                  value={jobBudgetFrom}
                  onChangeValue={setJobBudgetFrom}
                  prefix="₱"
                  delimiter=","
                  separator="."
                  precision={0}
                  minValue={0}
                  onChangeText={(formattedValue) => {
                    if (!formattedValue || parseFloat(formattedValue) === 0) {
                      setJobBudgetFrom("0");
                    }
                  }}
                />
              </View>
              <MaterialIcons name={"horizontal-rule"} size={20} />
              <View style={styles.inputColumn}>
                <Text style={styles.label}>End Budget:</Text>
                <CurrencyInput
                  style={styles.textInput}
                  value={jobBudgetTo}
                  onChangeValue={setJobBudgetTo}
                  prefix="₱"
                  delimiter=","
                  separator="."
                  precision={0}
                  onChangeText={(formattedValue) => {
                    if (!formattedValue || parseFloat(formattedValue) === 0) {
                      // Reset the input value to the default state
                      setJobBudgetTo("0");
                    }
                  }}
                />
              </View>
            </View>
          </View>

          <View style={[theme.utilities.inputContainer, { marginBottom: 25 }]}>
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
                      ? `${file.original_name} (${file.original_name.substring(
                          file.original_name.lastIndexOf(".") + 1
                        )})`
                      : file.name?.length > 10
                      ? `${file.name?.substring(0, 10)}...${file.name.substring(
                          file.name.lastIndexOf(".") + 1
                        )}`
                      : `${file.name} (${file.name.substring(
                          file.name.lastIndexOf(".") + 1
                        )})`}
                  </Text>
                </View>
                <TouchableOpacity
                  style={{ marginLeft: "auto" }}
                  onPress={() => removeSelectedFile(index)}
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
            style={{ position: "relative" }}
            onPress={() => handleSubmit(projectID)}
          >
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={[theme.colors.primary, theme.colors.secondary]}
              style={styles.linearGradientText}
            >
              <Text style={styles.postText}>SUBMIT</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default CreateProjectScreen;

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
    color: theme.colors.secondary,
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
  },
});
