import { useState, useEffect, useRef } from "react";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as theme from "../assets/constants/theme";
import Feather from "react-native-vector-icons/Feather";
import dayjs from "dayjs";
import DateTimePicker from "react-native-ui-datepicker";
import relativeTime from "dayjs/plugin/relativeTime";
import CurrencyInput from "react-native-currency-input";
import Button from "../components/Button";
import LoadingComponent from "../components/LoadingComponent";
import axios from "axios";
import "dayjs/locale/tl-ph"; // load on demand
import { URL } from "@env";
import SuccessModal from "../components/SuccessModal";
import ErrorModal from "../components/ErrorModal";
const ProposalScreen = ({ route, navigation }) => {
  const { item, isEditing, project, token, id } = route?.params || {};
  dayjs.locale("tl-ph");
  // --------------------------------------------- //
  const [hasErrorMessage, setHasErrorMessage] = useState(false);
  const [hasSuccessMessage, setHasSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [jobTitle, setJobTitle] = useState(project?.job_title);
  const [createdAt, setCreatedAt] = useState(project?.created_at);
  const [jobDescription, setJobDescription] = useState(
    project?.job_description
  );
  const [budget, setBudget] = useState(project?.job_budget_from);

  const [proposalID, setProposalID] = useState(null);
  const [jobStartDate, setJobStartDate] = useState(project?.job_start_date);
  const [jobEndDate, setJobEndDate] = useState(project?.job_end_date);
  const [expertiseExplain, SetExpertiseExplain] = useState("");
  const [startDate, setStartDate] = useState(dayjs());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [proposalBudget, SetProposalBudget] = useState("");
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const formattedStartDate = dayjs(startDate)
    .locale("tl-ph")
    .format("YYYY-MM-DD");
  useEffect(() => {
    if (isEditing && item) {
      setProposalID(item?.id); //! Proposal ID
      SetProposalBudget(item?.job_amount_bid); //! Proposal Budget
      SetExpertiseExplain(item.expertise_explain || ""); //! Expertise LongText
      setJobTitle(item?.job_proposal?.job_title); //! jobTitle
      setCreatedAt(item?.job_proposal?.created_at); //! jobCreatedAt
      setJobDescription(item?.job_proposal?.job_description); //! jobDescription
      setStartDate(item?.job_proposal?.job_start_date); //! job Start Date
      setJobEndDate(item?.job_proposal?.job_end_date); //! job End Date
      setBudget(item?.job_proposal?.job_budget_from); //! job End Date
      setStartDate(dayjs(item?.due_date)); //! Due Date
    }
  }, [project, isEditing]);

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

  const submitProposal = async (proposalID) => {
    if (!startDate || !proposalBudget || !expertiseExplain || !startDate) {
      setHasErrorMessage(true);
      setErrorMessage("Please fill all required fields.");
    } else if (startDate.isBefore(jobStartDate)) {
      setHasErrorMessage(true);
      setErrorMessage(
        "Invalid Date Selected: The proposed start date cannot be earlier than the project's start date."
      );
    } else {
      const formData = new FormData();
      formData.append(
        "project_id",
        item && isEditing ? item.project_id : project.id
      ),
        formData.append("freelancer_id", id),
        formData.append(
          "user_id",
          item && isEditing
            ? item.job_proposal.student_user_id
            : project.student_user_id
        ),
        formData.append("job_title", jobTitle);
      formData.append("expertise_explain", expertiseExplain),
        formData.append("due_date", formattedStartDate); // Fixed date format
      formData.append("job_amount_bid", proposalBudget);

      try {
        setLoading(true);
        let url = proposalID
          ? `${URL}/project/proposals/update/${proposalID}`
          : `${URL}/project/proposals`;
        const response = await axios({
          method: "post",
          url: url,
          data: formData,
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          if (proposalID) {
            Alert.alert("Proposal updated successfully!");
            navigation.navigate("HomeScreen");
          } else {
            Alert.alert("Proposal submitted successfully!");
            navigation.navigate("HomeScreen");
          }
          SetExpertiseExplain("");
          setStartDate(dayjs());
          SetProposalBudget("");
        }
      } catch (error) {
        if (error.response.status === 400) {
          setHasErrorMessage(true);
          setErrorMessage("You have already submitted a proposal");
        } else {
          setHasErrorMessage(true);
          setErrorMessage("Something Went Wrong. Please Try Again.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={{ flex: 1 }}>
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
            {item && isEditing ? "Update Proposal" : "Submit Proposal"}
          </Text>
          <Text></Text>
        </View>
        {loading ? (
          <LoadingComponent />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.innerContainer}>
              <Text style={styles.title}>Apply To</Text>
              <View style={styles.projectContainer}>
                <Text style={styles.projectTitle}>{jobTitle}</Text>
                <Text style={styles.jobTime}>
                  • Posted {dayjs(createdAt).fromNow()}
                </Text>
                <TouchableOpacity
                  style={styles.showDetails}
                  onPress={toggleDetails}
                >
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
                    <Text style={styles.descriptionTitle}>Budget</Text>
                    <Text style={styles.description}>₱{budget}</Text>
                    <Text style={styles.descriptionTitle}>Description</Text>
                    <Text style={styles.description}>{jobDescription}</Text>

                    <View style={{ flexDirection: "row", marginTop: 10 }}>
                      <View style={{ width: "50%" }}>
                        <View style={{ width: "85%" }}>
                          <Text
                            style={{
                              fontFamily: "Roboto-Medium",
                              marginBottom: 7,
                              color: "black",
                            }}
                          >
                            Project Start Date
                          </Text>

                          <Text style={styles.date}>
                            {dayjs(jobStartDate).format("MM/DD/YYYY")}
                          </Text>
                        </View>
                      </View>
                      <View style={{ width: "50%" }}>
                        <Text
                          style={{
                            fontFamily: "Roboto-Medium",
                            color: "black",
                            marginBottom: 7,
                          }}
                        >
                          Project End Date
                        </Text>
                        <Text style={styles.date}>
                          {dayjs(jobEndDate).format("MM/DD/YYYY")}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              </View>

              <View style={styles.container}>
                <Text style={styles.title}>Explain your expertise:</Text>
                <TextInput
                  style={styles.expertiseExplain}
                  value={expertiseExplain}
                  onChangeText={(text) => {
                    // Limit input to 250 characters
                    if (text.length <= 300) {
                      SetExpertiseExplain(text);
                    }
                  }}
                  multiline
                  autoCorrect={false}
                  numberOfLines={4}
                  maxHeight={150}
                  maxLength={300}
                  textAlignVertical="top"
                />
                <View style={{ alignItems: "flex-end", marginRight: 5 }}>
                  <Text>{expertiseExplain.length} / 300</Text>
                </View>

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
                            onChange={(params) =>
                              onStartDateChange(params.date)
                            }
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
                      precision={2} // Set precision to 0 to prevent decimal values
                      minValue={0}
                      onChangeText={(formattedValue) => {
                        if (
                          !formattedValue ||
                          parseFloat(formattedValue) === 0
                        ) {
                          // Reset the input value to the default state
                          SetProposalBudget("0"); // Set the value to "0" instead of "0.00"
                        }
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        )}

        {!loading ? (
          isEditing && item ? (
            <View style={styles.applyNow}>
              <Button
                title="Update Proposal"
                filled
                style={{ width: "100%", borderRadius: 10 }}
                onPress={() => submitProposal(proposalID)}
              />
            </View>
          ) : (
            <View style={styles.applyNow}>
              <Button
                title="Submit Proposal"
                filled
                style={{ width: "100%", borderRadius: 10 }}
                onPress={() => submitProposal(proposalID)}
              />
            </View>
          )
        ) : (
          <Text>""</Text>
        )}
      </View>

      <View>
        {hasErrorMessage && (
          <ErrorModal
            errorMessage={errorMessage}
            onClose={() => {
              setHasErrorMessage(false);
              setErrorMessage("");
            }}
          />
        )}
      </View>

      <View>
        {hasSuccessMessage && (
          <SuccessModal
            successMessage={successMessage}
            onClose={() => {
              setHasSuccessMessage(false);
              setSuccessMessage("");
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default ProposalScreen;
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: theme.colors.WHITE,
    paddingTop: 24,
    paddingHorizontal: 24,
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
    fontSize: theme.sizes.h3,
  },

  jobTime: {
    fontSize: theme.sizes.h2 - 1,
    color: theme.colors.gray,
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
    marginStart: 4,
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
    position: "absolute",
    alignItems: "center",
    width: "100%",
    bottom: 0,
  },
  errorModalContainer: {
    position: "relative",
    borderRadius: 5,
    width: "80%",
    backgroundColor: "white",
    maxHeight: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  modalText: {
    fontSize: 24,
    color: "red",
  },
});
