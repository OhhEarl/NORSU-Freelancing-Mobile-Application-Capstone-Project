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
} from "react-native";
import areasOfExpertise from "../hooks/AreaOfExpertise";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "react-native-vector-icons/Feather";
import * as theme from "../assets/constants/theme";
import Tags from "react-native-tags";
import { launchImageLibrary } from "react-native-image-picker";
import LoadingComponent from "../components/LoadingComponent";
import { ActivityIndicator } from "react-native-paper";
const EditProfileScreen = ({ navigation, route }) => {
  const user = route.params.project;

  const [userAvatar, setUserAvatar] = useState(user?.user_avatar);
  const [userName, setUserName] = useState(user?.user_name);
  const [inputText, setInputText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [areaExpertise, setAreaExpertise] = useState(user?.area_of_expertise);
  const [aboutMe, setAboutMe] = useState("");
  const [studentSkills, setStudentSkills] = useState([]);
  const [loading, setLoading] = useState(false);

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
  const handleInputChange = (text) => {
    setInputText(text); // Update the state
    setAreaExpertise(text); // Update the area of expertise state

    if (text === "") {
      setSuggestions([]); // Clear suggestions when input is empty
    } else {
      const filteredSuggestions = Object.values(
        areasOfExpertise.areasOfExpertise
      )
        .filter((category) =>
          category.toLowerCase().includes(text.toLowerCase())
        )
        .filter((category) => category !== text); // Filter out the current input text from suggestions
      setSuggestions(filteredSuggestions);
    }
  };

  const handleSuggestionPress = (category) => {
    const key = Object.keys(areasOfExpertise.areasOfExpertise).find(
      (key) => areasOfExpertise.areasOfExpertise[key] === category
    );

    if (key) {
      // If the category exists in the predefined list, set the category as areaExpertise
      setAreaExpertise(category);
    } else {
      // If the category does not exist in the predefined list, create a new entry
      // and store the category as the value
      // Here, you would implement the logic to create a new entry in your database
      // with the selected category as the value and store the generated ID as areaExpertise
      // This part needs to be implemented on the backend
      // For now, we'll just set areaExpertise to the inputText
      setAreaExpertise(inputText);
    }

    setInputText("");
    setSuggestions([]);
  };
  const handleInputBlur = () => {
    if (inputText === "") {
      // If input text is empty, reset areaExpertise to initial state
      setAreaExpertise(user?.area_of_expertise); // Set area of expertise to initial state
      setSuggestions([]); // Clear suggestions
    }
  };
  const handlePressOutside = () => {
    setSuggestions([]); // Clear suggestions when pressing outside the TextInput or FlatList
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

  return (
    <SafeAreaView style={styles.mainContainer}>
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
              fontFamily: "Roboto-Bold",
              color: theme.colors.primary,
              fontSize: 18,
            }}
          >
            EDIT PROFILE
          </Text>
          <Text></Text>
        </View>

        <View style={styles.innerContainer}>
          <View style={styles.imageContainer}>
            {loading ? (
              <ActivityIndicator size={5} />
            ) : (
              <Image
                objectFit="contain"
                style={styles.image}
                source={{
                  uri:
                    userAvatar ||
                    "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?w=740&t=st=1670148608~exp=1670149208~hmac=bc57b66d67d2b9f4929c8e592ff17e8c8660721608add2f18fc20d19c1aab7e4",
                }}
              />
            )}

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

          <TouchableWithoutFeedback onPress={handlePressOutside}>
            <View style={styles.inputFieldContainer}>
              <Text style={styles.inputLabel}>Area of Expertise</Text>
              <TextInput
                placeholder="Enter area of expertise"
                value={areaExpertise}
                onChangeText={handleInputChange}
                style={styles.inputField}
                onBlur={handleInputBlur}
              />
              <FlatList
                style={{
                  maxHeight: 150,
                  backgroundColor: "white",
                }}
                data={suggestions.filter((item) => item !== areaExpertise)} // Filter out the initial value
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleSuggestionPress(item)}>
                    <Text
                      style={{
                        marginTop: 12,
                        marginStart: 12,
                        fontWeight: 600,
                        fontSize: 14,
                        marginBottom: 5,
                      }}
                      key={item}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => String(index)}
                scrollEnabled={false}
              />
            </View>
          </TouchableWithoutFeedback>
          <View style={theme.utilities.inputFieldContainer}>
            <Text style={styles.inputLabel}>Skills</Text>
            <Tags
              style={[
                styles.inputField,
                { paddingVertical: 5, paddingStart: 0 },
              ]}
              initialTags={studentSkills}
              onChangeTags={onChangeSkills}
              inputStyle={{
                fontFamily: "Raleway-Medium",
                backgroundColor: "white",
                color: "black",
              }}
              renderTag={({
                tag,
                index,
                onPress,
                deleteTagOnPress,
                readonly,
              }) => {
                return (
                  <TouchableOpacity
                    key={`${tag}-${index}`}
                    onPress={onPress}
                    style={{ marginStart: 12 }}
                  >
                    <Text
                      style={{
                        padding: 5,
                        paddingHorizontal: 10,
                        backgroundColor: theme.colors.primary,
                        color: "white",
                        borderRadius: 10,
                      }}
                    >
                      {tag}
                    </Text>
                  </TouchableOpacity>
                );
              }}
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
        </View>
      </ScrollView>
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
});
