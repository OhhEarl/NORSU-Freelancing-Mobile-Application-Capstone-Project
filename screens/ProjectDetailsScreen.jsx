import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Pressable,
} from "react-native";
import * as theme from "../assets/constants/theme";
import Icon from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
const ProjectDetailsScreen = ({ route, navigation }) => {
  const { project } = route.params;

  dayjs.extend(relativeTime);
  const formattedStartDate = dayjs(project?.job_start_date).format(
    "MMMM D, YYYY"
  );
  const formattedEndDate = dayjs(project?.job_end_date).format("MMMM D, YYYY");

  const startDate = dayjs(project?.job_start_date);
  const endDate = dayjs(project?.job_end_date);

  const durationInDays = endDate.diff(startDate, "day");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.inputField }}>
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ zIndex: 999 }}
          >
            <Icon
              name="arrow-back-ios-new"
              size={20}
              color={theme.colors.BLACKS}
            />
          </TouchableOpacity>
          <Text style={styles.titleName}>Project Overview</Text>
        </View>

        <View style={styles.overviewContainer}>
          <Text style={styles.projectTitle}>{project?.job_title}</Text>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={styles.jobTime}>
              Posted {dayjs(project?.created_at).fromNow()}
            </Text>
          </View>

          <View style={styles.rowContainer}>
            <View style={styles.priceContainer}>
              <View style={styles.jobPriceRow}>
                <Text style={styles.jobPrice}>₱{project?.job_budget_from}</Text>
                <Text style={styles.jobPrice}> - </Text>
                <Text style={styles.jobPrice}>₱{project?.job_budget_to}</Text>
              </View>
              <Text style={styles.jobRangePrice}>Budget</Text>
            </View>

            <View style={styles.priceContainer}>
              <View style={styles.jobPriceRow}>
                <Text style={styles.jobPrice}>{durationInDays} Days</Text>
              </View>
              <Text style={styles.jobRangePrice}>Duration</Text>
            </View>

            <View style={styles.priceContainer}>
              <View style={styles.jobPriceRow}>
                <Text style={styles.jobPrice}>0</Text>
              </View>
              <Text style={styles.jobRangePrice}>Proposal</Text>
            </View>
          </View>

          <View style={styles.projectDescription}>
            <Text style={styles.projectDescriptionTitle}>
              Project Description
            </Text>
            <Text style={styles.jobDescription}>
              {project?.job_description}
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
              <Text>Start Date</Text>
              <Text style={[styles.dateRange, { marginRight: 115 }]}>
                {formattedStartDate}
              </Text>
            </View>
            <View>
              <Text>End Date</Text>
              <Text style={styles.dateRange}>{formattedEndDate}</Text>
            </View>
          </View>

          <View>
            <Text style={styles.projectDescriptionTitle}>Tags</Text>
            <View style={styles.jobTagsContainer}>
              {project?.job_tags.length > 0 &&
                project?.job_tags.map((tag, index) => (
                  <Text key={index} style={styles.jobTag}>
                    {tag.job_tags}
                  </Text>
                ))}
            </View>
          </View>

          <View>
            <Text style={styles.projectDescriptionTitle}>Attachment</Text>
            {project?.attachments.length > 0 &&
              project?.attachments.map((attachment, index) => (
                <View key={attachment.id} style={styles.selectedFileContainer}>
                  <Ionicons
                    name={"document-text-outline"}
                    size={36}
                    color={theme.colors.WHITE}
                  />
                  <Text
                    style={{
                      marginStart: 10,
                      fontSize: 15,
                      fontWeight: "600",
                      color: theme.colors.WHITE,
                    }}
                  >
                    {attachment.original_name?.length > 15
                      ? `${attachment.original_name?.substring(
                          0,
                          10
                        )}...${attachment?.original_name?.substring(
                          attachment?.original_name?.lastIndexOf(".") + 1
                        )}`
                      : attachment?.original_name}
                  </Text>
                  <TouchableOpacity
                    style={{ marginLeft: "auto", marginRight: 5 }}
                  >
                    <Ionicons
                      name={"cloud-download-outline"}
                      size={25}
                      color={theme.colors.WHITE}
                    />
                  </TouchableOpacity>
                </View>
              ))}
          </View>
        </View>
      </View>
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
  },
  container: {
    backgroundColor: theme.colors.WHITE,
  },

  titleName: {
    textAlign: "center", // Center text horizontally
    flex: 1, // Allow the text to expand to take available space
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
    paddingTop: 50,
  },

  projectTitle: {
    fontFamily: "Roboto-Bold",
    textAlign: "center",
    color: theme.colors.BLACKS,
    fontSize: theme.sizes.h4 + 2,
  },
  jobTime: {
    color: theme.colors.gray,
    fontFamily: "Roboto-Regular",
    fontSize: theme.sizes.h2,
    marginTop: 6,
  },

  dateRange: {
    color: theme.colors.primary,
    fontFamily: "Roboto-Bold",
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
    paddingHorizontal: 15,
    flexDirection: "column",
    alignItems: "center",
    borderColor: theme.colors.grey,
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 8,
  },
  jobPriceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  jobPrice: {
    fontFamily: "Roboto-Bold",
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
    fontFamily: "Roboto-Bold",
    fontSize: theme.sizes.h3 + 2,
    color: theme.colors.BLACKS,
    paddingVertical: 4,
  },

  jobDescription: {
    paddingVertical: 5,
    fontFamily: "Roboto-Light",
    color: theme.colors.gray,
    fontSize: theme.sizes.h2 + 1,
  },

  jobTagsContainer: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  jobTag: {
    marginEnd: 10,
    borderRadius: 10,
    backgroundColor: theme.colors.inputField,
    paddingVertical: 6,
    paddingHorizontal: 15,
    fontSize: theme.sizes.h2 - 1,
    color: theme.colors.primary,
    fontFamily: "Roboto-Medium",
  },
  selectedFileContainer: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: theme.colors.primary,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 5,
  },
});
