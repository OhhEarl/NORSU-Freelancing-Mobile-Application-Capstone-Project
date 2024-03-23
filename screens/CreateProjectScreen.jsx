import React, { useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Button,
  Modal,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useState } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import { COLORS, UTILITIES } from "../assets/constants/index";
import JobCategory from "../hooks/JobCategory";
import JobSkills from "../hooks/JobSkills";
import {
  SelectList,
  MultipleSelectList,
} from "react-native-dropdown-select-list";

const CreateProjectScreen = () => {
  const [jobTitle, setJobTitle] = useState(""); //! Project Name
  const [jobCategory, setJobCategory] = useState(""); //! Project Category
  const [jobTags, setJobTags] = useState(""); //! Project Tags
  const [jobDescription, setJobDescription] = useState(""); //! Project Description
  const [jobBudgetFrom, setJobBudgetFrom] = useState(""); //! Project Budget Range From
  const [jobBudgetTo, setJobBudgetTo] = useState(""); //! Project Budget Range To
  const [startDate, setStartDate] = useState(dayjs()); //! Project Schedule From
  const [endDate, setEndDate] = useState(dayjs()); //! Project Schedule To
  const [showStartDatePicker, setShowStartDatePicker] = useState(false); //! SHOW SCHEDULE PICKED FROM
  const [showEndDatePicker, setShowEndDatePicker] = useState(false); //! SHOW SCHEDULE PICKED FROM
  const [selectListData, setSelectListData] = useState(jobCategory); //! FOR PROJECT CATEGORY
  const [placeholder, setPlaceholder] = useState("No Data Found"); //! PLACEHOLDER FOR PROJECT CATEGORY IF NO DATA FOUND
  const defaultSkills = []; //! JobTags default null array

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
  _pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});

    alert(result.uri);
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
            placeholder={"Select Skill Tags"}
            label="Skill Tags"
            defaultOption={jobCategory && JobSkills[jobCategory][0]}
            dropdownItemStyles={{ marginVertical: 5 }}
            boxStyles={{
              backgroundColor: COLORS.inputField,
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
            <View style={styles.fromContainer}>
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

            <View style={styles.toContainer}>
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
          <Text style={UTILITIES.title}>Schedule</Text>
          <View
            style={[
              UTILITIES.inputField,
              { height: 65, justifyContent: "space-around" },
            ]}
          >
            <View style={styles.fromContainer}>
              <Text style={{ fontFamily: "Roboto-Light" }}>Start Budget</Text>
              <TextInput
                style={[styles.date, { marginTop: 0, paddingVertical: 0 }]}
                placeholder="₱0.00"
                type="text"
              />
            </View>
            <View style={styles.verticalLine} />

            <View style={styles.toContainer}>
              <Text style={{ fontFamily: "Roboto-Light" }}>End Budget</Text>
              <TextInput
                style={[styles.date, { paddingVertical: 0 }]}
                placeholder="₱0.00"
                type="text"
              />
            </View>
          </View>
        </View>

        <View style={UTILITIES.inputContainer}>
          <View style={[UTILITIES.inputField, { height: 80 }]}>
            <TouchableOpacity onPress={_pickDocument}>
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

  inputFieldBudget: {
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingLeft: 16,
    fontSize: 18,
    width: "50%",
    fontFamily: "ProximaNova-Bold",
  },

  budgetInputSeparator: {
    justifyContent: "center", // Center separator vertically
    alignItems: "center", // Center separator horizontally
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
});
