import React, { useEffect, useState } from "react";

import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "react-native-vector-icons/Feather";
import * as theme from "../assets/constants/theme";
import Tags from "react-native-tags";
import { launchImageLibrary } from "react-native-image-picker";
import LoadingComponent from "../components/LoadingComponent";
import { ActivityIndicator } from "react-native-paper";
import Button from "../components/Button";
import axios from "axios";

import { URL } from "@env";
const EditProfileScreen = ({ navigation, route }) => {
  const { isStudent } = route.params;
  const [userAvatar, setUserAvatar] = useState(
    isStudent?.studentInfo?.user_avatar
  );
  const [userName, setUserName] = useState(isStudent?.studentInfo?.user_name);

  const [suggestions, setSuggestions] = useState([]);
  const [areaExpertise, setAreaExpertise] = useState(
    isStudent?.studentInfo?.area_of_expertise
  );
  const [aboutMe, setAboutMe] = useState("");
  const [studentSkills, setStudentSkills] = useState(
    isStudent?.studentInfo?.skill_tags || []
  );
  const [portfolioImages, setPortfolioImages] = useState([]);
  const [isLoading, setLoading] = useState(false);

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

  const onChangeSkills = (tag) => {
    setStudentSkills(tag);
  };
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
    if (!userName || !areaExpertise || !studentSkills) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    } else {
      setLoading(true);

      const formData = new FormData();

      formData.append("student_user_id", user?.user_id);
      formData.append("user_name", userName);
      formData.append("area_of_expertise", areaExpertise);
      formData.append("about_me", aboutMe);
      studentSkills.forEach((skill, index) => {
        formData.append(`student_skills[${index}]`, skill);
      });
      formData.append("user_avatar", {
        uri: userAvatar,
        name: `${userAvatar.split("/").pop()}`,
        type: `image/${userAvatar.split(".").pop()}`,
      });

      portfolioImages.forEach((image, index) => {
        formData.append(`portfolio[${index}]`, {
          uri: image,
          name: `${image.split("/").pop()}`,
          type: `image/${image.split(".").pop()}`,
        });
      });

      let url = `${URL}/api/student-validations/update`;
      try {
        const response = await axios.post(url, formData, {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${isStudent.token}`,
          },
        });

        if (response.status === 200) {
          await fetchIsStudent();
        }
      } catch (error) {
        Alert.alert(
          "Error:",
          error.response ? error.response.data : error.message
        );
      } finally {
        setLoading(false);
        navigation.navigate("EditProfileScreen");
        Alert.alert("User updated Successfully.");
      }
    }
  };

  const fetchPortfolio = async (studentUserId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${URL}/api/student-portfolio/${studentUserId}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${isStudent.token}`,
          },
        }
      );

      if (response.data && response.data.portfolio) {
        setPortfolioImages(response.data.portfolio);
      }
    } catch (error) {
      alert(error, "Please close the application and open again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio(isStudent.studentInfo.user_id);
  }, [isStudent]);
  return (
    <SafeAreaView style={styles.mainContainer}>
      {isLoading ? (
        <LoadingComponent />
      ) : (
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
                marginRight: 25,
                fontFamily: "Roboto-Medium",
                color: theme.colors.BLACKS,
                fontSize: 18,
              }}
            >
              Edit Profile
            </Text>
            <Text></Text>
          </View>

          <View style={styles.innerContainer}>
            <View style={styles.imageContainer}>
              <Image
                objectFit="contain"
                style={styles.image}
                source={{
                  uri:
                    userAvatar ||
                    "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?w=740&t=st=1670148608~exp=1670149208~hmac=bc57b66d67d2b9f4929c8e592ff17e8c8660721608add2f18fc20d19c1aab7e4",
                }}
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
                placeholder="Username"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.nativeEvent.text)}
                style={styles.inputField}
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
                <Text>{aboutMe.length} / 300</Text>
              </View>
            </View>

            {isLoading ? (
              <LoadingComponent />
            ) : (
              <View style={styles.inputFieldContainer}>
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
              </View>
            )}

            <View
              style={{
                position: "relative",
                width: "100%",
                marginTop: 20,
              }}
            >
              <Button title="Update" onPress={updateProfile} filled />
            </View>
          </View>
        </ScrollView>
      )}
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
    marginTop: 50,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 30,
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
    marginVertical: 10,
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
