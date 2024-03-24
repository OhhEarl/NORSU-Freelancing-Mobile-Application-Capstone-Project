import { View, TextInput, StyleSheet, Image, Text } from "react-native";
import Button from "../components/Buttons/Button";
import { React, useEffect, useState, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { launchImageLibrary } from "react-native-image-picker";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import { useAuthContext } from "../hooks/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS, UTILITIES } from "../assets/constants/index";

const VerificationScreen = ({ navigation, route }) => {
  const [selectedImageUriFront, setSelectedImageUriFront] = useState(null);
  const [selectedImageUriBack, setSelectedImageUriBack] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [course, setCourse] = useState("");
  const { userData, setUserData, isLoading } = useAuthContext();
  const [token, setToken] = useState(null);
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
      console.error("Error revoking token:", error);
    }
  };

  const frontID = async () => {
    try {
      const result = await launchImageLibrary();
      if (result.didCancel) {
        return;
      }
      if (result.error) {
        console.error("ImagePicker Error: ", result.error);
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
        const selectedImageUriFront = result.assets[0].uri;
        setSelectedImageUriFront(selectedImageUriFront);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const backID = async () => {
    try {
      const result = await launchImageLibrary();
      if (result.didCancel) {
        return;
      }
      if (result.error) {
        console.error("ImagePicker Error: ", result.error);
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
        const selectedImageUriBack = result?.assets[0]?.uri;
        setSelectedImageUriBack(selectedImageUriBack);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

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
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ flex: 1, marginHorizontal: 22, justifyContent: "center" }}>
        <View style={{ marginVertical: 22 }}>
          <Text style={UTILITIES.title}>
            Please fill up the following to proceed!
          </Text>
        </View>
        <View style={{ marginBottom: 12 }}>
          <Text style={UTILITIES.title}>First Name</Text>

          <View>
            <TextInput
              placeholder="Enter your first name"
              placeholderTextColor={COLORS.black}
              onChangeText={(text) => setFirstName(text)}
              value={firstName}
              autoCapitalize="words"
              style={UTILITIES.inputField}
            />
          </View>
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text style={UTILITIES.title}>Last Name</Text>

          <View>
            <TextInput
              placeholder="Enter your last name"
              placeholderTextColor={COLORS.black}
              onChangeText={(text) => setLastName(text)}
              value={lastName}
              autoCapitalize="words"
              style={UTILITIES.inputField}
            />
          </View>
        </View>

        <View style={{ marginBottom: 18 }}>
          <Text style={UTILITIES.title}>Course</Text>

          <View>
            <TextInput
              placeholder="Enter your full course"
              placeholderTextColor={COLORS.black}
              onChangeText={(text) => setCourse(text)}
              value={course}
              autoCapitalize="words"
              style={UTILITIES.inputField}
            />
          </View>
        </View>

        <View style={styles.idContainer}>
          <View style={styles.eachIDContainer}>
            {selectedImageUriFront && (
              <Image
                source={{ uri: selectedImageUriFront }}
                style={styles.image}
              />
            )}
          </View>
          <View style={styles.eachIDContainer}>
            {selectedImageUriBack && (
              <Image
                source={{ uri: selectedImageUriBack }}
                style={styles.image}
              />
            )}
          </View>
        </View>
        <View style={styles.idContainerButton}>
          <Button
            title="Front ID"
            onPress={frontID}
            style={styles.button}
            filled
          />
          <Button
            title="Back ID"
            onPress={backID}
            style={styles.button}
            filled
          />
        </View>

        <View style={{ marginBottom: 12 }}>
          <Button
            onPress={signOut}
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
  );
};

export default VerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  idContainerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 40, // Add horizontal margin to each containe
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
