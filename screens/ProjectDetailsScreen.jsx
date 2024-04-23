import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import * as theme from "../assets/constants/theme";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import RNFS from "react-native-fs";
import Button from "../components/Button";

import { useEffect } from "react";
const ProjectDetailsScreen = ({ route, navigation }) => {
  const { project } = route.params;
  const { id } = route.params;
  const { token } = route?.params;

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      project;
    });
    return unsubscribe;
  }, [navigation, project]);

  const handleDownload = async (filePath) => {
    try {
      const url = filePath;
      const downloadDest = `${RNFS.DocumentDirectoryPath}/url.jpg`;

      const options = {
        fromUrl: url,
        toFile: downloadDest,
        background: true,
        begin: (res) => {
          console.log("begin", res);
        },
        progress: (res) => {
          console.log("progress", res);
        },
      };

      const ret = RNFS.downloadFile(options);

      ret.promise.then((response) => {
        if (response.statusCode === 200) {
          console.log("File downloaded to ", downloadDest);
        } else {
          console.log("Download error");
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

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
              marginRight: 25,
              fontFamily: "Roboto-Medium",
              color: theme.colors.BLACKS,
              fontSize: 18,
            }}
          >
            Project Overview
          </Text>

          {project?.student_user_id == id && project?.job_finished != 1 ? (
            <MaterialCommunityIcons
              name="square-edit-outline"
              size={24}
              color={theme.colors.BLACKS}
              onPress={() =>
                navigation.navigate("CreateProjectScreen", {
                  project,
                  isEditing: true,
                  token: token,
                  id: id,
                })
              }
            />
          ) : (
            <Text></Text>
          )}
        </View>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
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
                  <Text style={styles.jobPrice}>
                    ₱{project?.job_budget_from}
                  </Text>
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
                  <Text style={styles.jobPrice}>
                    {project?.proposals_count}
                  </Text>
                </View>
                <Text style={styles.jobRangePrice}>Proposals</Text>
              </View>
            </View>
            <View style={styles.projectDescription}>
              <Text style={styles.projectDescriptionTitle}>
                Project Category
              </Text>
              <Text style={styles.jobDescription}>
                {project?.category_name}
              </Text>
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
                {project?.job_tags?.length > 0 &&
                  project?.job_tags?.map((tag, index) => (
                    <Text key={index} style={styles.jobTag}>
                      {tag?.job_tags}
                    </Text>
                  ))}
              </View>
            </View>

            <View>
              <Text style={styles.projectDescriptionTitle}>Attachment</Text>
              {project?.attachments?.length > 0 &&
                project?.attachments?.map((attachment, index) => (
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
                      onPress={() => handleDownload(attachment.file_path)}
                    >
                      <Ionicons
                        name={"cloud-download-outline"}
                        size={18}
                        color={theme.colors.BLACKS}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
            </View>
          </View>

          {id == project.student_user_id ? (
            ""
          ) : (
            <View style={styles.applyNow}>
              <Button
                title="Apply Now"
                filled
                style={{ borderRadius: 50 }}
                onPress={() =>
                  navigation.navigate("ProposalScreen", {
                    project: project,
                    user_id: route.params.user_id,
                    token: token,
                    id: id,
                  })
                }
              />
            </View>
          )}
        </ScrollView>
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
    height: 800,
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
    marginTop: 6,
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
    paddingHorizontal: 10,
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
    bottom: 20, // This will stick the Apply Now button to the bottom
    left: "20%",
    right: 0,
    width: "60%",
  },
});
