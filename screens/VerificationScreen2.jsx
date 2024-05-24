import { React, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  ScrollView,
  BackHandler,
  Alert,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { SelectList } from "react-native-dropdown-select-list";
import { useNavigation } from "@react-navigation/native";
import { useAuthContext } from "../hooks/AuthContext";
import Button from "../components/Button";
import axios from "axios";
import Feather from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as theme from "../assets/constants/theme";
import { URL } from "@env";
import LoadingComponent from "../components/LoadingComponent";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
const VerificationScreen2 = ({
  values,
  setValues,
  selectedImageUriFront,
  setSelectedImageUriFront,
  selectedImageUriBack,
  setSelectedImageUriBack,
  onPrev,
}) => {
  const navigation = useNavigation();
  const { userData } = useAuthContext();
  const [userID, setUserID] = useState(null);

  const [token, setToken] = useState(null);

  const [loading, setIsLoading] = useState(false);
  useEffect(() => {
    const retrieveToken = async () => {
      try {
        const data = await AsyncStorage.getItem("userInformation");
        if (data) {
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
    const backAction = () => {
      // Trigger onPrev function
      onPrev();
      // Return true to prevent default back button behavior
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // Cleanup the event listener on component unmount
  }, [onPrev]);

  const yearLevelOptions = [
    {
      id: 1,
      yearLevel: "1st Year Level",
    },
    {
      id: 2,
      yearLevel: "2nd Year Level",
    },
    {
      id: 3,
      yearLevel: "3rd Year Level",
    },
    {
      id: 4,
      yearLevel: "4th Year Level",
    },
    {
      id: 5,
      yearLevel: "5th Year Level",
    },
  ];

  const frontID = async () => {
    try {
      const result = await launchImageLibrary();
      if (result.didCancel) {
        return;
      }
      if (result.error) {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "Upload Error",
          textBody: "Something went wrong. Please Try Again!",
          button: "Close",
        });
        return;
        return;
      }
      const fileSizeLimitMB = 2;
      const fileSizeInMB = result.assets[0].fileSize / (1024 * 1024); // Convert to MB
      const fileFormatType = result.assets[0].type; // Get file format type
      const fileFormat = ["image/jpeg", "image/jpg", "image/png"];
      if (fileSizeInMB > fileSizeLimitMB) {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "Upload Error",
          textBody: "Cannot upload file larger than 2MB.",
          button: "Close",
        });
      } else if (!fileFormat.includes(fileFormatType)) {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "Upload Error",
          textBody: "Please upload an image in JPEG, JPG, or PNG format.",
          button: "Close",
        });
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
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "Upload Error",
          textBody: "Something went wrong. Please Try Again",
          button: "Close",
        });
        return;
      }
      const fileSizeLimitMB = 2;
      const fileSizeInMB = result.assets[0].fileSize / (1024 * 1024); // Convert to MB
      const fileFormatType = result.assets[0].type; // Get file format type
      const fileFormat = ["image/jpeg", "image/jpg", "image/png"];
      if (fileSizeInMB > fileSizeLimitMB) {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "Upload Error",
          textBody: "Cannot upload file larger than 2MB.",
          button: "Close",
        });
      } else if (!fileFormat.includes(fileFormatType)) {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "Upload Error",
          textBody: "Please upload an image in JPEG, JPG, or PNG format.",
          button: "Close",
        });
      } else {
        const selectedImageUriBack = result?.assets[0]?.uri;
        setSelectedImageUriBack(selectedImageUriBack);
      }
    } catch (error) {
      alert(error);
    }
  };
  const handleYearLevelChange = (selectedValue) => {
    const selectedYearLevel = yearLevelOptions.find(
      (option) => option.yearLevel === selectedValue
    );
    if (selectedYearLevel) {
      setValues((prevValues) => ({
        ...prevValues,
        yearLevel: selectedYearLevel.id,
      }));
    }
  };

  const selectedYearLevel = yearLevelOptions.find(
    (option) => option.id === values.yearLevel
  );

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
      !values.skillTags ||
      !values.mobile_number
    ) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Validation Failed",
        textBody: "Please fill out all required fields.",
        button: "Close",
      });
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
    values.skillTags.forEach((tag) => {
      formData.append("student_skills[]", tag);
    });
    formData.append("course", values.course);
    formData.append("yearLevel", values.yearLevel);
    formData.append("norsuIDnumber", values.norsuIDnumber);
    formData.append("mobile_number", values.mobile_number);
    formData.append("user_id", userID);

    try {
      setIsLoading(true);
      let url = `${URL}/student-validation`;
      const response = await axios.post(url, formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      console.log(data);
      if (response.status === 200) {
        await setIsLoading(false);
        navigation.navigate("VerificationConfirmation");
      } else {
        Alert.alert("Something went wrong. Please Try Again!");
      }
    } catch (err) {
      Alert.alert("Something went wrong. Please Try Again!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <LoadingComponent />
      ) : (
        <ScrollView style={{ paddingVertical: 10 }}>
          <AlertNotificationRoot style={styles.notification}>
            <View
              style={{
                flex: 1,
                backgroundColor: "white",
                paddingHorizontal: 30,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 20,
                  marginBottom: 20,
                }}
              >
                <Feather
                  name="arrow-left"
                  size={24}
                  color={theme.colors.BLACKS}
                  onPress={onPrev}
                />
                <Text
                  style={{
                    marginRight: 25,
                    fontFamily: "Roboto-Bold",
                    color: theme.colors.BLACKS,
                    fontSize: 18,
                  }}
                >
                  STEP 2
                </Text>
                <Text></Text>
              </View>
              <View style={styles.inputFieldContainer}>
                <Text style={styles.inputLabel}>ID Number</Text>
                <TextInput
                  style={styles.inputField}
                  placeholderTextColor={theme.colors.gray}
                  placeholder="enter NORSU ID number"
                  keyboardType="numeric"
                  value={values.norsuIDnumber}
                  onChangeText={(text) =>
                    setValues({ ...values, norsuIDnumber: text })
                  }
                />
              </View>

              <View style={styles.inputFieldContainer}>
                <Text style={styles.inputLabel}>Course</Text>
                <TextInput
                  style={styles.inputField}
                  placeholderTextColor={theme.colors.gray}
                  placeholder="enter course"
                  value={values.course}
                  onChangeText={(text) =>
                    setValues({ ...values, course: text })
                  }
                />
              </View>
              <View style={{ marginVertical: 20 }}>
                <Text style={styles.inputLabel}>Year Level</Text>
                <SelectList
                  key={`yearLevel-${values.yearLevel}`} // Ensure a unique key for each SelectList instance
                  setSelected={handleYearLevelChange}
                  style={styles.inputField}
                  data={yearLevelOptions.map((item) => item.yearLevel)} // Pass an array of strings
                  placeholder="select year level"
                  search={false}
                  dropdownTextStyles={{
                    color: "black",
                    fontFamily: "Roboto-Medium",
                  }}
                  inputStyles={{
                    color: "black",
                    fontFamily: "Roboto-Regular",
                  }}
                  boxStyles={{
                    paddingVertical: 15,
                    borderColor: theme.colors.primary,
                  }}
                  selectedValue={
                    selectedYearLevel ? selectedYearLevel.yearLevel : ""
                  }
                  defaultOption={{
                    key: values.yearLevel.toString(), // Keep it as a string
                    value: selectedYearLevel ? selectedYearLevel.yearLevel : "",
                  }}
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
                  title="Submit"
                  style={{
                    position: "relative",
                    width: "100%",
                    marginTop: 20,
                  }}
                  onPress={studentValidation}
                  filled
                />
              </View>
            </View>
          </AlertNotificationRoot>
        </ScrollView>
      )}
    </>
  );
};

export default VerificationScreen2;
const styles = StyleSheet.create({
  idContainerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 40,
    marginTop: 20,
  },
  idContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 175,
    marginTop: 20,
  },
  eachIDContainer: {
    flex: 0.5,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 6,
    marginHorizontal: 15,
  },

  image: {
    width: "100%",
    height: "100%",
    alignSelf: "center",
    resizeMode: "stretch",
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
  button: {
    paddingHorizontal: 10,
  },

  notification: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
});
