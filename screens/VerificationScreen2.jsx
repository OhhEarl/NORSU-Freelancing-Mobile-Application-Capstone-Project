import { React, useEffect, useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from "react-native-paper";
import { COLORS } from "../assets/constants/index";
import Button from "../components/Buttons/Button";
import { launchImageLibrary } from "react-native-image-picker";
import axios from "axios";
import { useAuthContext } from "../hooks/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
const VerificationScreen2 = ({
  values,
  setValues,
  selectedImageUriFront,
  setSelectedImageUriFront,
  selectedImageUriBack,
  setSelectedImageUriBack,
}) => {
  const navigation = useNavigation();
  const { userData } = useAuthContext();
  const [userID, setUserID] = useState(null);
  const [id, setID] = useState(null);
  const [token, setToken] = useState(null);
  const [finalToken, setFinalToken] = useState(null);

  useEffect(() => {
    const retrieveToken = async () => {
      try {
        const data = await AsyncStorage.getItem("userInformation");
        if (data !== null) {
          const parsedData = JSON.parse(data);
          const userID = parsedData.user.id;
          const userToken = parsedData.token;
          setUserID(userID);
          setToken(userToken);
        }
      } catch (error) {}
    };

    retrieveToken();
  }, []);

  useEffect(() => {
    if (userData && userData.user && userData.user.id) {
      setID(userData.user.id);
      setToken(userData.token);
    } else {
      setID(userID);
      setFinalToken(token);
    }
  }, [userData, userID, token]);

  const frontID = async () => {
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
      alert(error);
    }
  };

  const studentValidation = async () => {
    if (
      !selectedImageUriFront ||
      !selectedImageUriBack ||
      !values.firstName ||
      !values.lastName ||
      !values.userName ||
      !values.course ||
      !values.areaOfExpertise ||
      !values.norsuIDnumber ||
      !values.yearLevel
    ) {
      alert("Please fill all fields and select both front and back ID's.");
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
    formData.append("userName", values.userName);
    formData.append("firstName", values.firstName);
    formData.append("lastName", values.lastName);
    formData.append("areaOfExpertise", values.areaOfExpertise);
    formData.append("course", values.course);
    formData.append("yearLevel", values.yearLevel);
    formData.append("norsuIDnumber", values.norsuIDnumber);
    formData.append("user_id", id);

    try {
      let url = "http://10.0.2.2:8000/api/student-validation";
      const response = await axios.post(url, formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${finalToken}`,
        },
      });
      const data = response.data;
      if (response.status === 200) {
        navigation.navigate("VerificationConfirmation");
      } else {
        alert("Something went wrong. Please Try Again!");
      }
    } catch (err) {
      alert(err);
    } finally {
      setSelectedImageUriFront(null);
      setSelectedImageUriBack(null);
    }
  };
  return (
    <View
      style={[
        styles.container,
        {
          flexDirection: "column",
        },
      ]}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <View style={{ marginBottom: 6 }}>
          <TextInput
            mode="outlined"
            style={{ margin: 8 }}
            label="NORSU ID Number"
            placeholder="Enter NORSU ID number"
            value={values.norsuIDnumber}
            onChangeText={(text) =>
              setValues({ ...values, norsuIDnumber: text })
            }
            outlineColor={COLORS.black} // Change the outline color based on the theme's primary color
            activeOutlineColor={COLORS.primary}
          />
        </View>

        <View style={{ marginBottom: 6 }}>
          <TextInput
            mode="outlined"
            style={{ margin: 8 }}
            label="Course"
            placeholder="Enter your course"
            value={values.course}
            onChangeText={(text) => setValues({ ...values, course: text })}
            outlineColor={COLORS.black} // Change the outline color based on the theme's primary color
            activeOutlineColor={COLORS.primary}
          />
        </View>

        <View style={{ marginBottom: 6 }}>
          <TextInput
            mode="outlined"
            style={{ margin: 8 }}
            label="Year Level"
            placeholder="Enter your year level"
            value={values.yearLevel}
            onChangeText={(text) => setValues({ ...values, yearLevel: text })}
            outlineColor={COLORS.black} // Change the outline color based on the theme's primary color
            activeOutlineColor={COLORS.primary}
          />
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

        <View>
          <Button
            title="Verify"
            style={{
              position: "absolute",
              width: "100%",
              marginTop: 20,
            }}
            onPress={studentValidation}
            filled
          />
        </View>
      </View>
    </View>
  );
};

export default VerificationScreen2;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  idContainerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 40, // Add horizontal margin to each containe
    marginTop: 20,
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
