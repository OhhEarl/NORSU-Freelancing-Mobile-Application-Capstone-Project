import {
  View,
  StyleSheet,
  Image,
  Text,
  ScrollView,
  FlatList,
} from "react-native";
import Button from "../components/Buttons/Button";
import { React, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { launchImageLibrary } from "react-native-image-picker";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import { useAuthContext } from "../hooks/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../assets/constants/index";
import { TextInput } from "react-native-paper";
import areasOfExpertise from "../hooks/AreaOfExpertise";

const VerificationScreen = ({ navigation, route }) => {
  const { userData, setUserData, isLoading } = useAuthContext();
  const [token, setToken] = useState(null);

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [course, setCourse] = useState("");
  const [IDnumber, setIDnumber] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [selectedImageUriFront, setSelectedImageUriFront] = useState(null);
  const [selectedImageUriBack, setSelectedImageUriBack] = useState(null);
  const [inputText, setInputText] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    return () => {
      setSelectedImageUriFront(null);
      setSelectedImageUriBack(null);
    };
  }, []);

  useEffect(() => {
    if (userData) {
      setToken(userData.token);
    }
  }, [userData]);

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      await auth().signOut();
      let url = "http://10.0.2.2:8000/api/google-callback/auth/google-signout";
      let response = await axios.post(url, token, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if ((response.status = 200)) {
        await AsyncStorage.removeItem("userInformation");
        await setUserData(null);
      }
    } catch (error) {
      alert(error);
    }
  };

  const handleInputChange = (text) => {
    setInputText(text); // Update the state
    console.log(text); // Log the current value of the input
    const filteredSuggestions = Object.values(
      areasOfExpertise.areasOfExpertise
    ).filter((category) => category.toLowerCase().includes(text.toLowerCase()));
    setSuggestions(filteredSuggestions);
  };
  const handleSuggestionPress = (category) => {
    const key = Object.keys(areasOfExpertise.areasOfExpertise).find(
      (key) => areasOfExpertise.areasOfExpertise[key] === category
    );
    console.log("Selected suggestion - Key:", key, "Value:", category);
    setInputText(category);
    setSuggestions([]); // Clear suggestions when a suggestion is selected
  };

  const isSuggestion = suggestions.includes(inputText);

  const studentValidation = async () => {
    if (
      !selectedImageUriFront ||
      !selectedImageUriBack ||
      !firstName ||
      !lastName ||
      !course
    ) {
      alert("Please fill all fields and select both front and back images");
      return;
    }
    const frontFileName = selectedImageUriFront.split("/").pop();
    const backFileName = selectedImageUriBack.split("/").pop();
    const frontExtension = frontFileName.split(".").pop();
    const backExtension = backFileName.split(".").pop();
    const formData = new FormData();

    formData.append("imageFront", {
      uri: selectedImageUriFront,
      name: `${frontFileName}`,
      type: `image/${frontExtension}`,
    });
    formData.append("imageBack", {
      uri: selectedImageUriBack,
      name: `${backFileName}`,
      type: `image/${backExtension}`,
    });
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("course", course);
    formData.append("user_id", userData.id);

    try {
      let url = "http://10.0.2.2:8000/api/student-validation";
      const response = await axios.post(url, formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userData.token}`,
        },
      });
      const data = response.data;
      if (data) {
        navigation.navigate("VerificationConfirmation");
      } else {
        alert("Something went wrong. Please Try Again!");
      }
    } catch (err) {
      alert(err);
    } finally {
      setSelectedImageUriFront(null);
      setSelectedImageUriBack(null);
      setFirstName("");
      setLastName("");
      setCourse("");
    }
  };

  return (
    <ScrollView>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
        <View
          style={{ flex: 1, marginHorizontal: 22, justifyContent: "center" }}
        >
          <View style={{ marginVertical: 22 }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Roboto-Bold",
                color: "black",
              }}
            >
              Please fill up the following to proceed!
            </Text>
          </View>

          <View style={{ marginBottom: 12 }}>
            <TextInput
              mode="outlined"
              style={{ margin: 8 }}
              label="Username"
              placeholder="Enter your username"
              onChangeText={(text) => setUsername(text)}
              value={username}
              outlineColor={COLORS.black} // Change the outline color based on the theme's primary color
              activeOutlineColor={COLORS.primary}
            />
          </View>
          <View style={{ marginBottom: 12 }}>
            <TextInput
              mode="outlined"
              style={{ margin: 8 }}
              label="First Name"
              placeholder="Enter your first name"
              onChangeText={(text) => setFirstName(text)}
              value={firstName}
              outlineColor={COLORS.black} // Change the outline color based on the theme's primary color
              activeOutlineColor={COLORS.primary}
            />
          </View>

          <View style={{ marginBottom: 12 }}>
            <TextInput
              mode="outlined"
              style={{ margin: 8 }}
              label="Last Name"
              placeholder="Enter your last name"
              onChangeText={(text) => setLastName(text)}
              value={lastName}
              outlineColor={COLORS.black} // Change the outline color based on the theme's primary color
              activeOutlineColor={COLORS.primary}
            />
          </View>

          <View style={{ marginBottom: 12 }}>
            <TextInput
              mode="outlined"
              style={{ margin: 8 }}
              label="Area of Expertise"
              placeholder="Choose your area of expertise"
              value={inputText}
              onChangeText={handleInputChange}
              outlineColor={COLORS.black}
              activeOutlineColor={COLORS.primary}
            />
            {isSuggestion && <Text>Input is a suggestion</Text>}
            <View style={{ backgroundColor: "red" }}>
              {suggestions.map((item, index) => (
                <Button
                  key={index.toString()}
                  title={item}
                  onPress={() => handleSuggestionPress(item)}
                />
              ))}
            </View>
          </View>

          <View style={{ marginBottom: 12 }}>
            <TextInput
              mode="outlined"
              style={{ margin: 8 }}
              label="Course"
              placeholder="Enter your course"
              onChangeText={(text) => setCourse(text)}
              value={course}
              outlineColor={COLORS.black} // Change the outline color based on the theme's primary color
              activeOutlineColor={COLORS.primary}
            />
          </View>

          <View style={{ marginBottom: 12 }}>
            <TextInput
              mode="outlined"
              style={{ margin: 8 }}
              label="ID Number"
              placeholder="Enter your ID number"
              onChangeText={(text) => setIDnumber(text)}
              value={IDnumber}
              outlineColor={COLORS.black} // Change the outline color based on the theme's primary color
              activeOutlineColor={COLORS.primary}
            />
          </View>

          <View style={{ marginBottom: 12 }}>
            <TextInput
              mode="outlined"
              style={{ margin: 8 }}
              label="Year Level"
              placeholder="Enter your year level"
              onChangeText={(text) => setYearLevel(text)}
              value={yearLevel}
              outlineColor={COLORS.black} // Change the outline color based on the theme's primary color
              activeOutlineColor={COLORS.primary}
            />
          </View>

          <View style={{ marginBottom: 12 }}>
            <Button
              onPress={studentValidation}
              title="Submit"
              filled
              style={{
                marginTop: 18,
                marginBottom: 4,
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default VerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  button: {
    margin: 6,
    borderRadius: 6,
    width: "30%",
  },
  text: {
    padding: 10,
    color: "#555555",
    textAlign: "center",
    fontSize: 20,
  },

  idContainerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 40, // Add horizontal margin to each containe
  },
  idContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 175,
  },
  eachIDContainer: {
    flex: 0.5, // Set each container to 50% width
    alignItems: "center", // Center image horizontally
    justifyContent: "center", // Center image vertically
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 6,
    marginHorizontal: 15, // Add horizontal margin to each containe
  },

  image: {
    width: "100%",
    height: "100%",
    alignSelf: "center",
    resizeMode: "stretch",
  },
});
