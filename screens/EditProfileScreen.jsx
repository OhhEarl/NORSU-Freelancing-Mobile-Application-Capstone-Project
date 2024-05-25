import React, { useEffect, useState } from "react";

import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { AuthProvider, useAuthContext } from "../hooks/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "react-native-vector-icons/Feather";
import * as theme from "../assets/constants/theme";
import Tags from "react-native-tags";
import { launchImageLibrary } from "react-native-image-picker";
import LoadingComponent from "../components/LoadingComponent";
import axios from "axios";
import TagInput from "../components/TagInput";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import { URL } from "@env";
const EditProfileScreen = ({ navigation, route }) => {
  const { updateIsStudent } = useAuthContext();
  const { isStudent } = route.params;
  const baseUrlWithoutApi = URL.replace("/api", "");
  const [userAvatar, setUserAvatar] = useState(
    `${baseUrlWithoutApi}/storage/${isStudent?.studentInfo?.user_avatar}`
  );
  const [userName, setUserName] = useState(isStudent?.studentInfo?.user_name);
  const [phoneNumber, setPhoneNumber] = useState(
    isStudent?.studentInfo?.mobile_number
  );
  const [aboutMe, setAboutMe] = useState(isStudent?.studentInfo?.about_me);
  const [studentSkills, setStudentSkills] = useState(
    isStudent?.studentInfo?.skill_tags || []
  );
  const [portfolioImages, setPortfolioImages] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [areaOfExpertise, setAreaOfExpertise] = useState(
    isStudent?.studentInfo?.area_of_expertise || ""
  );
  const [key, setKey] = useState(0);

  const onChangeSkills = (newSkills) => {
    setStudentSkills((prev) => ({ ...prev, skillTags: newSkills }));
  };

  useEffect(() => {
    if (isStudent) {
      setUserAvatar(isStudent.studentInfo.user_avatar);
    }
  }, []);

  const imageAvatar = async () => {
    try {
      const result = await launchImageLibrary();
      if (result.didCancel) {
        return;
      }
      if (result.error) {
        return;
      }
      const fileSizeLimitMB = 2;
      const fileSizeInMB = result.assets[0].fileSize / (1024 * 1024); // Convert to MB
      const fileFormatType = result.assets[0].type; // Get file format type
      const fileFormat = ["image/jpeg", "image/jpg", "image/png"];
      if (fileSizeInMB > fileSizeLimitMB) {
        alert("Cannot upload files larger than 2MB");
      } else if (!fileFormat.includes(fileFormatType)) {
        alert("Please upload an image in JPEG, JPG, or PNG format.");
      } else {
        setLoading(true);
        const imagePick = result.assets[0].uri;
        setUserAvatar(imagePick);
        setLoading(false);
      }
    } catch (error) {
      alert("Error:", error);
    }
  };

  const initializeDefaultTags = () => {
    if (studentSkills.length === 0) {
      setStudentSkills([]); // Set default tags if jobTags is empty
    }
  };

  useEffect(() => {
    initializeDefaultTags();
  }, []); // Empty dependency array ensures this effect runs only once when component mounts

  const selectImage = async () => {
    try {
      const result = await launchImageLibrary();
      if (result.didCancel) {
        return;
      }
      if (result.error) {
        return;
      }
      const fileSizeLimitMB = 2;
      const fileSizeInMB = result.assets[0].fileSize / (1024 * 1024); // Convert to MB
      const fileFormatType = result.assets[0].type; // Get file format type
      const fileFormat = ["image/jpeg", "image/jpg", "image/png"];
      if (fileSizeInMB > fileSizeLimitMB) {
        alert("Cannot upload files larger than 2MB");
      } else if (!fileFormat.includes(fileFormatType)) {
        alert("Please upload an image in JPEG, JPG, or PNG format.");
      } else {
        const imageUri = result.assets[0].uri;
        handleImageAdd(imageUri);
      }
    } catch (error) {
      alert("Error:", error);
    }
  };

  const handleImageAdd = (imageUri) => {
    setPortfolioImages((prevImages) => [...prevImages, imageUri]);
  };

  const handleImageDelete = (index) => {
    Alert.alert(
      "Delete Image",
      "Are you sure you want to delete this image?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            const newImages = [...portfolioImages];
            newImages.splice(index, 1);
            setPortfolioImages((prevImages) => {
              const newImages = [...prevImages];
              newImages.splice(index, 1);
              return newImages;
            });
          },
        },
      ],
      { cancelable: false }
    );
  };

  const updateProfile = async () => {
    if (!userName && areaOfExpertise && phoneNumber) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Validation Failed",
        textBody: "Username, Area of Expertise and Phone Number are required.",
        button: "Close",
      });
    } else if (phoneNumber === 11) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Phone Number Error",
        textBody: "Phone number must be 11 digits number.",
        button: "Close",
      });
    } else {
      const formData = new FormData();
      formData.append("user_name", userName);
      formData.append("about_me", aboutMe);
      formData.append("mobile_number", phoneNumber);
      studentSkills.forEach((skill, index) => {
        formData.append(`student_skills[${index}]`, skill);
      });
      formData.append("area_of_expertise", areaOfExpertise);

      if (userAvatar && userAvatar.startsWith("file://")) {
        formData.append("user_avatar", {
          uri: userAvatar,
          name: userAvatar.split("/").pop(),
          type: `image/${userAvatar.split(".").pop()}`,
        });
      }

      portfolioImages.forEach((image, index) => {
        formData.append(`portfolio[${index}]`, {
          uri: image,
          name: image.split("/").pop(),
          type: `image/${image.split(".").pop()}`,
        });
      });

      let url = `${URL}/student/validations/profile/update/${isStudent.studentInfo.user_id}`;

      try {
        setLoading(true);
        const response = await axios({
          method: "post",
          url: url,
          data: formData,
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${isStudent.token}`,
          },
        });

        if (response.status === 200) {
          await updateIsStudent(response.data.data);
        }
      } catch (error) {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "Success",
          textBody: error.message,
          button: "Close",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      if (isStudent && isStudent.studentInfo && isStudent.studentInfo.user_id) {
        // Check for all properties
        const response = await axios.get(
          `${URL}/student-portfolio/${isStudent.studentInfo.user_id}`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${isStudent.token}`,
            },
          }
        );

        if (
          response.status === 200 &&
          response.data &&
          response.data.portfolio
        ) {
          await setPortfolioImages(response.data.portfolio);
        }
      } else {
        console.warn("User information not available yet"); // Or handle it differently
      }
    } catch (error) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: error.message,
        button: "Close",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isStudent) {
      fetchPortfolio();
    }
  }, []);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <AlertNotificationRoot style={styles.notification}>
        <ScrollView showsVerticalScrollIndicator={false}>
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
                marginRight: 5,
                fontFamily: "Roboto-Medium",
                color: theme.colors.BLACKS,
                fontSize: 18,
              }}
            >
              Edit Profile
            </Text>
            <Feather
              name="check"
              size={24}
              color={theme.colors.BLACKS}
              onPress={updateProfile}
            />
          </View>

          <View style={styles.innerContainer}>
            <View style={styles.imageContainer}>
              <Image
                objectFit="contain"
                style={styles.image}
                source={
                  userAvatar
                    ? {
                        uri: userAvatar,
                      }
                    : {
                        uri: "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?w=740&t=st=1670148608~exp=1670149208~hmac=bc57b66d67d2b9f4929c8e592ff17e8c8660721608add2f18fc20d19c1aab7e4",
                      }
                }
              />

              <TouchableOpacity
                style={styles.editIconContainer}
                onPress={imageAvatar}
              >
                <Feather name="camera" size={20} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.inputFieldContainer}>
              <Text style={styles.inputLabel}>Username</Text>
              <TextInput
                placeholderTextColor={theme.colors.gray}
                placeholder="Username"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.nativeEvent.text)}
                style={styles.inputField}
              />
            </View>

            <View style={styles.inputFieldContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                placeholderTextColor={theme.colors.gray}
                placeholder="Phone Number"
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.nativeEvent.text)}
                style={styles.inputField}
              />
            </View>

            <View style={styles.inputFieldContainer}>
              <Text style={styles.inputLabel}>Area of Expertise</Text>
              <TextInput
                style={styles.inputField}
                label="Area of Expertise"
                placeholderTextColor={theme.colors.gray}
                placeholder="Input your area of expertise"
                value={areaOfExpertise}
                onChangeText={setAreaOfExpertise}
              />
            </View>

            <View style={styles.inputFieldContainer}>
              <Text style={[styles.inputLabel, { marginBottom: -4 }]}>
                Skill Tags
              </Text>
              <TagInput
                key={key}
                initialTags={studentSkills}
                onChangeTags={onChangeSkills}
                style={{ marginVertical: 0 }}
              />
            </View>

            <View style={styles.inputFieldContainer}>
              <Text style={styles.inputLabel}>About Me</Text>
              <TextInput
                style={styles.inputField}
                placeholder="Enter something about yourself. "
                type="text"
                value={aboutMe}
                onChangeText={(text) => {
                  // Limit input to 250 characters
                  if (text.length <= 300) {
                    setAboutMe(text);
                  }
                }}
                multiline
                autoCorrect={false}
                numberOfLines={4}
                maxHeight={100}
                maxLength={250}
                textAlignVertical="top"
              />

              <View style={{ alignItems: "flex-end", marginRight: 5 }}>
                <Text>{aboutMe?.length} / 300</Text>
              </View>
            </View>

            <View style={[styles.inputFieldContainer, { marginTop: 20 }]}>
              {isLoading ? (
                <LoadingComponent />
              ) : (
                <>
                  <Text style={styles.inputLabel}>Portfolio</Text>
                  <View style={styles.portfolioContainer}>
                    {portfolioImages.map((image, index) => (
                      <View key={index} style={styles.portfolioImageContainer}>
                        <Image
                          source={{ uri: image }}
                          style={styles.portfolioImage}
                        />
                        <TouchableOpacity
                          style={styles.closeButton}
                          onPress={() => handleImageDelete(index)}
                        >
                          <Text style={styles.closeButtonText}>X</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                    <TouchableOpacity
                      style={styles.addImageContainer}
                      onPress={selectImage}
                    >
                      <Text style={styles.addImageText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </ScrollView>
      </AlertNotificationRoot>
    </SafeAreaView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: theme.colors.WHITE,
    padding: 24,
  },
  innerContainer: {
    marginHorizontal: 5,
    alignItems: "center",
    marginVertical: 30,
    marginTop: 40,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 10,
  },
  image: {
    height: 120,
    width: 120,
    borderRadius: 70,
    borderWidth: 1,
    marginBottom: 10,
  },

  editIconContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 5,
    borderRadius: 10,
  },
  inputFieldContainer: {
    marginVertical: 5,
    width: "100%",
  },
  inputLabel: {
    fontFamily: "Roboto-Bold",
    color: theme.colors.BLACKS,
    marginBottom: 5,
    marginStart: 5,
    fontSize: 15,
  },
  inputField: {
    width: "100%",
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 10,
    paddingStart: 15,
    fontFamily: "Roboto-Regular",
  },

  portfolioContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  portfolioImageContainer: {
    position: "relative",
    width: 100,
    height: 100,
    marginRight: 11,
    marginBottom: 5,
  },
  portfolioImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 10,
  },
  closeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 10,
    padding: 5,
  },
  closeButtonText: {
    color: "red",
    fontSize: 16,
  },
  addImageContainer: {
    width: 100,
    height: 100,
    backgroundColor: "lightgray",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  addImageText: {
    fontSize: 40,
    color: "gray",
  },
});
