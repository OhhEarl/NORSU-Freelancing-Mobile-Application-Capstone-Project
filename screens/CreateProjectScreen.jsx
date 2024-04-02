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

import LinearGradient from "react-native-linear-gradient";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import { COLORS, UTILITIES } from "../assets/constants/index";
import JobCategory from "../hooks/JobCategory";
import JobSkills from "../hooks/JobSkills";
import {
  SelectList,
  MultipleSelectList,
} from "react-native-dropdown-select-list";
import DocumentPicker from "react-native-document-picker";
import CurrencyInput from "react-native-currency-input";
import RNFS from "react-native-fs";
3;

const CreateProjectScreen = ({ route }) => {
  const [selectedFile, setSelectedFile] = useState([]);
  const [loading, setLoading] = useState(false);
  const [jobTitle, setJobTitle] = useState(""); //! Project Name
  const [jobCategory, setJobCategory] = useState(""); //! Project Category
  const [jobTags, setJobTags] = useState(""); //! Project Tags
  const [jobDescription, setJobDescription] = useState(""); //! Project Description
  const [jobBudgetFrom, setJobBudgetFrom] = useState("0.00"); //! Project Budget Range From
  const [jobBudgetTo, setJobBudgetTo] = useState(""); //! Project Budget Range To
  const [startDate, setStartDate] = useState(dayjs()); //! Project Schedule From
  const [endDate, setEndDate] = useState(dayjs()); //! Project Schedule To
  const [showStartDatePicker, setShowStartDatePicker] = useState(false); //! SHOW SCHEDULE PICKED FROM
  const [showEndDatePicker, setShowEndDatePicker] = useState(false); //! SHOW SCHEDULE PICKED FROM
  const [selectListData, setSelectListData] = useState(jobCategory); //! FOR PROJECT CATEGORY
  const [placeholder, setPlaceholder] = useState("No Data Found"); //! PLACEHOLDER FOR PROJECT CATEGORY IF NO DATA FOUND
  const defaultSkills = []; //! JobTags default null array

  const isStudent = route.params?.isStudent;

  //! --------------------PROJECT CATEGORY ------------------------- //
  useEffect(() => {
    if (jobTags.length > 0) {
      setSelectListData([]);
      setPlaceholder("Please Remove The Skill Tags First.");
    } else {
      setPlaceholder("No Data Found");
      setSelectListData(JobCategory);
    }
  }, [jobTags]);
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
        console.log(result);
        const fileSize = result.size;
        console.log(fileSize); // Not sure why you're using result.uri here, it's typically used for the file path
        const maxSize = 15 * 1024 * 1024;
        if (fileSize > maxSize) {
          Alert.alert(
            "File Size Limit Exceeded",
            "Please select a file up to 15 MB."
          );
        } else {
          setLoading(true);
          setSelectedFile((prevSelectedFiles) => [
            ...prevSelectedFiles,
            result,
          ]);
          setLoading(false);
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

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ marginTop: 30, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View>
          <Text style={UTILITIES.header}>Let's Get Your Job Listed!</Text>
        </View>

        <View style={UTILITIES.inputContainer}>
          <Text style={UTILITIES.title}>Project Name</Text>
          <TextInput
            style={UTILITIES.inputField}
            placeholder="App Design and Development"
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.nativeEvent.text)}
          />
        </View>

        <View style={UTILITIES.inputContainer}>
          <Text style={UTILITIES.title}>Project Category</Text>
          <SelectList
            setSelected={setJobCategory}
            data={selectListData}
            placeholder={"Select Category"}
            dropdownItemStyles={{ marginVertical: 5 }}
            boxStyles={{
              backgroundColor: COLORS.inputField,
              borderWidth: 0,
              minHeight: 50,
              alignItems: "center",
              paddingVertical: 5,
              paddingHorizontal: 10,
              paddingLeft: 16,
            }}
            fontFamily="Raleway-Medium"
            notFoundText={placeholder}
          />
        </View>

        <View style={UTILITIES.inputContainer}>
          <Text style={UTILITIES.title}>Project Tags</Text>
          <MultipleSelectList
            setSelected={setJobTags}
            data={JobSkills[jobCategory] || defaultSkills}
            placeholder={"Select `Skill Tags"}
            label="Skill Tags"
            defaultOption={jobCategory && JobSkills[jobCategory][0]}
            dropdownItemStyles={{ marginVertical: 5 }}
            boxStyles={{
              backgroundColor: COLORS.inputField,
              borderWidth: 0,
              minHeight: 50,
              alignItems: "center",
              paddingVertical: 5,
              paddingHorizontal: 10,
              paddingLeft: 16,
            }}
            fontFamily="Raleway-Medium"
            notFoundText={placeholder}
          />
        </View>

        <View style={UTILITIES.inputContainer}>
          <Text style={UTILITIES.title}>Project Description</Text>
          <TextInput
            style={[UTILITIES.inputField, { height: 100 }]}
            placeholder="Enter some brief about project "
            type="text"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.nativeEvent.text)}
            multiline
            autoCorrect={false}
            numberOfLines={4} // Set the maximum number of lines to 4
            maxHeight={100} // Set the maximum height to 100 units
            maxLength={250}
            textAlignVertical="top"
          />
        </View>

        <View style={UTILITIES.inputContainer}>
          <Text style={UTILITIES.title}>Schedule</Text>
          <View
            style={[
              UTILITIES.inputField,
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

        <View style={UTILITIES.inputContainer}>
          <Text style={UTILITIES.title}>Budget</Text>
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
                precision={2}
                minValue={0}
                onChangeText={(formattedValue) => {
                  if (!formattedValue || parseFloat(formattedValue) === 0) {
                    // Reset the input value to the default state
                    setJobBudgetFrom("0.00");
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
                precision={2}
                minValue={0}
                onChangeText={(formattedValue) => {
                  if (!formattedValue || parseFloat(formattedValue) === 0) {
                    // Reset the input value to the default state
                    setJobBudgetTo("0.00");
                  }
                }}
              />
            </View>
          </View>
        </View>

        <View style={[UTILITIES.inputContainer, { marginBottom: 25 }]}>
          <View
            style={[
              UTILITIES.inputField,
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
              <Text style={styles.uploadText}>Upload Your Files</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View>
          {selectedFile.map((file, index) => (
            <View key={index} style={styles.selectedFileContainer}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons
                  name={"document-text-outline"}
                  size={36}
                  color={"white"}
                />
                <Text
                  style={{
                    marginStart: 10,
                    fontSize: 15,
                    fontWeight: "600",
                    color: "white",
                  }}
                >
                  {loading
                    ? "Loading..."
                    : file.name.length > 15
                    ? `${file.name.substring(
                        0,
                        file.name.lastIndexOf(".")
                      )}...${file.name.substring(
                        file.name.lastIndexOf(".") + 1
                      )}`
                    : file.name}
                </Text>
              </View>
              <TouchableOpacity
                style={{ marginLeft: "auto" }}
                onPress={() => removeSelectedFile(index)}
              >
                <Ionicons
                  name={"close-circle-outline"}
                  size={30}
                  color={"white"}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity style={{ marginBottom: 30 }}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={[COLORS.primary, COLORS.secondary]}
            style={styles.linearGradientText}
          >
            <Text style={styles.postText}>SUBMIT</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default CreateProjectScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },

  uploadText: {
    fontSize: 18,
    color: COLORS.BLACKS,
    fontFamily: "Roboto-Bold",
  },

  linearGradientText: {
    width: 300,
    alignSelf: "center",
    borderRadius: 12,
    height: 50,
    marginTop: 35,
  },

  postText: {
    color: "#fff",
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
    backgroundColor: "white",
    padding: 30,
    borderRadius: 10,
    width: "90%",
  },

  verticalLine: {
    width: 2,
    height: "70%",
    backgroundColor: "gray", // Adjust color as needed
  },

  date: {
    fontSize: 20,
    color: "black",
    fontFamily: "ProximaNova-Bold",
  },

  uploadLogo: {
    alignSelf: "center", // Center the icon horiz
    color: COLORS.secondary,
  },

  selectedFileContainer: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 5,
  },

  inputRow: {
    borderRadius: 10,
    flexDirection: "row",
    backgroundColor: COLORS.inputField,
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 18,
    fontFamily: "ProximaNova-Bold",
  },
  inputColumn: {
    flex: 1,
    padding: 10,
  },

  textInput: {
    padding: 5,
    fontSize: 16,
    textAlign: "center",
  },
  label: {
    textAlign: "center",
    fontFamily: "Roboto-Light",
  },
});
