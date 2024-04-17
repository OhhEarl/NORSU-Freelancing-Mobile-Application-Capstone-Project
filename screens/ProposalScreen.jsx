import { useState } from "react";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as theme from "../assets/constants/theme";
import Feather from "react-native-vector-icons/Feather";
import dayjs from "dayjs";
import DateTimePicker from "react-native-ui-datepicker";
import relativeTime from "dayjs/plugin/relativeTime";
import CurrencyInput from "react-native-currency-input";
import Button from "../components/Button";
const ProposalScreen = ({ route, navigation }) => {
  const project = route?.params?.project;
  const [expertiseExplain, SetExpertiseExplain] = useState("");
  const [startDate, setStartDate] = useState(dayjs());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [proposalBudget, SetProposalBudget] = useState("0.00");
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  dayjs.extend(relativeTime);

  const toggleDetails = () => {
    setIsDetailsVisible(!isDetailsVisible);
  };
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

  const submitProposal = async () => {
    if (!startDate || !proposalBudget || !expertiseExplain || !startDate) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    const formData = new FormData();

    formData.append("student_user_id", project?.student_user_id),
      formData.append("freelencer_id", route?.params.user_id),
      formData.append("expertiseExplain", expertiseExplain),
      formData.append("proposalBudget", proposalBudget),
      formData.append("startDate", startDate);

    console.log(formData);
  };

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
            marginRight: 25,
            fontFamily: "Roboto-Medium",
            color: theme.colors.BLACKS,
            fontSize: 18,
          }}
        >
          Submit Proposal
        </Text>
        <Text></Text>
      </View>

      <View style={styles.innerContainer}>
        <Text style={styles.title}>Apply To</Text>
        <View style={styles.projectContainer}>
          <Text style={styles.projectTitle}>{project?.job_title}</Text>
          <Text style={styles.jobTime}>
            • Posted {dayjs(project?.created_at).fromNow()}
          </Text>
          <TouchableOpacity style={styles.showDetails} onPress={toggleDetails}>
            <Text
              style={{
                color: "blue",
                fontFamily: "Roboto-Regular",
                fontSize: theme.sizes.h2,
                marginRight: 2,
                marginLeft: 8,
              }}
            >
              Show Details
            </Text>
            <Feather name="arrow-right" size={13} color={"blue"} />
          </TouchableOpacity>
          {isDetailsVisible && (
            <View style={{ padding: 5, flexDirection: "column" }}>
              <Text style={styles.descriptionTitle}>Description</Text>
              <Text style={styles.description}>
                {"     "}
                {project?.job_description}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.container}>
          <Text style={styles.title}>Explain your expertise:</Text>
          <TextInput
            style={styles.expertiseExplain}
            type="text"
            value={expertiseExplain}
            onChangeText={(text) => {
              // Limit input to 250 characters
              if (text.length <= 250) {
                SetExpertiseExplain(text);
              }
            }}
            multiline
            autoCorrect={false}
            numberOfLines={4}
            maxHeight={150}
            maxLength={250}
            textAlignVertical="top"
          />

          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <View style={{ width: "50%" }}>
              <View style={{ width: "85%" }}>
                <Text
                  style={{
                    fontFamily: "Roboto-Medium",
                    marginBottom: 7,
                    color: "black",
                  }}
                >
                  Due Date
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
            <View style={{ width: "50%" }}>
              <Text
                style={{
                  fontFamily: "Roboto-Medium",
                  color: "black",
                  marginBottom: 7,
                }}
              >
                Amount
              </Text>
              <CurrencyInput
                style={{
                  paddingVertical: 6,
                  borderWidth: 1,
                  borderColor: theme.colors.GRAY_LIGHT,
                  borderRadius: 10,
                  color: theme.colors.gray,
                  fontFamily: "Roboto-Regular",
                  paddingStart: 15,
                  fontSize: 13,
                }}
                value={proposalBudget}
                onChangeValue={SetProposalBudget}
                prefix="₱"
                delimiter=","
                separator="."
                precision={2}
                minValue={0}
                onChangeText={(formattedValue) => {
                  if (!formattedValue || parseFloat(formattedValue) === 0) {
                    // Reset the input value to the default state
                    SetProposalBudget("0.00");
                  }
                }}
              />
            </View>
          </View>
          <View style={styles.applyNow}>
            <Button title="Apply Now" filled onPress={submitProposal} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProposalScreen;
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: theme.colors.WHITE,
    padding: 24,
  },
  innerContainer: {
    marginHorizontal: 5,
    marginVertical: 30,
    marginTop: 25,
    flex: 1,
  },
  projectContainer: {
    padding: 12,
    borderWidth: 1,
    borderColor: theme.colors.GRAY_LIGHT,
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: "#F6F5F2",
  },
  projectTitle: {
    fontFamily: "Roboto-Medium",
    color: "black",
    fontSize: theme.sizes.h3 + 3,
  },

  showDetails: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  descriptionTitle: {
    fontFamily: "Roboto-Medium",
    color: "black",
    marginTop: 5,
    marginBottom: 3,
  },

  description: {
    fontFamily: "Roboto-Light",
    color: "black",
  },
  title: {
    fontFamily: "Roboto-Medium",
    fontSize: theme.sizes.h3,
    color: "black",
    marginStart: 2,
  },
  container: {
    marginTop: 20,
  },
  expertiseExplain: {
    padding: 10,
    borderWidth: 1,
    borderColor: theme.colors.GRAY_LIGHT,
    marginTop: 10,
    borderRadius: 10,
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

  applyNow: {
    marginTop: 180,
  },
});
