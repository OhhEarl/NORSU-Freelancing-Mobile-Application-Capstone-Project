import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  TextInput,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import * as theme from "../assets/constants/theme";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useIsFocused } from "@react-navigation/native";
import LoadingComponent from "../components/LoadingComponent";
import DocumentPicker from "react-native-document-picker";
import { URL } from "@env";
import axios from "axios";
import CurrencyInput from "react-native-currency-input";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
const GcashPaymentScreen = ({ navigation, route }) => {
  const { project_id, user_id, freelancer_id, project_price } = route.params;

  const token = route.params.isStudent.token;
  const [loading, setLoading] = useState(false);

  const [gcashAccountNumber, setGcashAccountNumber] = useState(null);
  const [gcashAccountName, setGcashAccountName] = useState(null);
  const [gcashAccountID, setGcashAccountID] = useState(null);
  const [gcashAccountCode, setGcashAccountCode] = useState(null);
  const [transactionID, setTransactionID] = useState(null);
  const [amount, setAmount] = useState(null);
  const [name, setName] = useState(null);
  const [number, setNumber] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const isFocused = useIsFocused();
  console.log(project_price);
  useEffect(() => {
    if (!isFocused) {
      setGcashAccountNumber(null);
      setGcashAccountName(null);
      setGcashAccountID(null);
      setGcashAccountCode(null);
      setTransactionID(null);
      setAmount(null);
      setName(null);
      setNumber(null);
    }

    if (project_price !== undefined && project_price !== null) {
      setAmount(project_price);
    }
  }, [isFocused, route]);
  const fetchGcashUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${URL}/gcash-user/fetch`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        await setGcashAccountNumber(
          response?.data[0]?.gcash_user_account_number
        );

        await setGcashAccountName(response?.data[0]?.gcash_user_name);
        await setGcashAccountID(response?.data[0]?.id);
        await setGcashAccountCode(response?.data[0]?.gcash_user_code);
      }
    } catch (error) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Something went wrong. Please Try Again.",
        button: "Close",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGcashUser();
  }, []);

  const hasImageFile = (files) => {
    return files.some((file) => file.type.startsWith("image/"));
  };
  const handleSubmitPayment = async () => {
    if (
      !amount ||
      !name ||
      !number ||
      !transactionID ||
      !hasImageFile(selectedFiles)
    ) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "All fields are required.",
        button: "Close",
      });
      return;
    } else if (number === 11) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "All fields are required.",
        button: "Close",
      });
      return;
    } else {
      const formData = new FormData();
      formData.append("project_id", project_id);
      formData.append("student_user_id", user_id);
      formData.append("freelancer_user_id", freelancer_id);
      formData.append("gcash_user_code", gcashAccountCode);
      formData.append("gcash_user_id", gcashAccountID);
      formData.append("gcash_number", number);
      formData.append("gcash_name", name);
      formData.append("gcash_transanction_id", transactionID);
      formData.append("amount", amount);
      if (selectedFiles && selectedFiles[0]) {
        formData.append("gcash_picture", {
          uri: selectedFiles[0].uri,
          type: selectedFiles[0].type,
          name: selectedFiles[0].name,
        });
      }
      try {
        setLoading(true);

        const url = `${URL}/gcash-payment/transaction`;
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
          navigation.navigate("FeedBackRatingScreen", {
            freelancer_id: freelancer_id,
          });

          Dialog.show({
            type: ALERT_TYPE.SUCCESS,
            title: "SUCCESS",
            textBody: "Success! Payment Submitted Successfully.",
            button: "Close",
          });
        }
      } catch (error) {
        if (error.isAxiosError && error.code === "ERR_NETWORK") {
          Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: "Error",
            textBody: "Network Error! Please check your internet connection.",
            button: "Close",
          });
        } else {
          Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: "Error",
            textBody: "Something went wrong. Please Try Again.",
            button: "Close",
          });
        }
      } finally {
        setLoading(false);
        setName(null);
        setNumber(null);
        setAmount(null);
        setTransactionID(null);
      }
    }
  };

  const handleFileSelection = async () => {
    try {
      const results = await DocumentPicker.pick({
        allowMultiSelection: true,
        type: [DocumentPicker.types.allFiles],
      });

      if (results.length > 1) {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "Error",
          textBody: "File must contain one picture only.",
          button: "Close",
        });
      } else {
        const files = results.map((file) => ({
          uri: file.uri,
          type: file.type,
          name: file.name,
        }));

        setSelectedFiles(files);
      }
    } catch (err) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Error in selecting file. Please Try Again.",
        button: "Close",
      });
    }
  };

  const confirmRemoveFile = (fileIndex) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to remove this file?",
      [
        {
          text: "Cancel",

          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => removeSelectedFile(fileIndex),
        },
      ],
      { cancelable: false }
    );
  };

  const removeSelectedFile = (indexToRemove) => {
    setSelectedFiles((prevSelectedFiles) => {
      return prevSelectedFiles.filter((_, index) => index !== indexToRemove);
    });
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <AlertNotificationRoot style={styles.notification}>
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
              marginRight: 20,
              fontFamily: "Roboto-Medium",
              color: theme.colors.BLACKS,
              fontSize: 18,
            }}
          >
            Payment
          </Text>
          <Text></Text>
        </View>

        {loading ? (
          <LoadingComponent />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
              <Image
                style={styles.image}
                source={require("../assets/images/GCash_logo.png")}
              />

              <View style={{ marginTop: 10 }}>
                <View style={styles.inputFieldContainer}>
                  <Text style={styles.inputLabel}>GCash Account Number</Text>
                  <Text style={[styles.inputField, { fontWeight: "700" }]}>
                    {gcashAccountNumber}
                  </Text>
                </View>
                <View style={styles.inputFieldContainer}>
                  <Text style={styles.inputLabel}>GCash Account Name</Text>
                  <Text style={[styles.inputField, { fontWeight: "700" }]}>
                    {gcashAccountName}
                  </Text>
                </View>

                <View style={styles.inputFieldContainer}>
                  <Text style={styles.inputLabel}>Code</Text>
                  <Text style={[styles.inputField, { fontWeight: "700" }]}>
                    {gcashAccountCode}
                  </Text>
                  <Text style={styles.minMax}>
                    *Enter this code in the comments field when you send a
                    money. If you do not enter the code, your payment may not be
                    identified.
                  </Text>
                </View>
                <View style={styles.inputFieldContainer}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={[styles.inputLabel, { color: "black" }]}>
                      Transaction ID
                    </Text>
                    <Text style={styles.minMax}>(Reference No.)</Text>
                  </View>
                  <TextInput
                    keyboardType="numeric"
                    type="text"
                    style={styles.inputField}
                    onChange={(e) => setTransactionID(e.nativeEvent.text)}
                  />
                </View>
                <View style={styles.inputFieldContainer}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={[styles.inputLabel, { color: "black" }]}>
                      Amount
                    </Text>
                    <Text style={styles.minMax}>
                      (Min: 100.00 PHP / Max: 50,000.00 PHP)
                    </Text>
                  </View>

                  <CurrencyInput
                    style={styles.inputField}
                    value={amount}
                    onChangeValue={setAmount}
                    prefix="₱"
                    delimiter=","
                    separator="."
                    precision={2}
                    minValue={0}
                    onChangeText={(formattedValue) => {
                      if (!formattedValue || parseFloat(formattedValue) === 0) {
                        setAmount("0");
                      }
                    }}
                  />
                </View>

                <View style={styles.inputFieldContainer}>
                  <Text style={styles.inputLabel}>GCash Account Name</Text>
                  <TextInput
                    autoCapitalize="words"
                    type="text"
                    style={styles.inputField}
                    onChange={(e) => setName(e.nativeEvent.text)}
                  />
                </View>
                <View style={styles.inputFieldContainer}>
                  <Text style={styles.inputLabel}>GCash Account Number</Text>
                  <TextInput
                    type="text"
                    keyboardType="numeric"
                    style={styles.inputField}
                    maxLength={11}
                    onChange={(e) => setNumber(e.nativeEvent.text)}
                  />
                  <View style={{ alignItems: "flex-end" }}>
                    <Text
                      style={{
                        fontFamily: "Roboto-Medium",
                        color: "black",
                        fontSize: 12,
                        marginEnd: 5,
                      }}
                    >
                      {number?.length} / 11
                    </Text>
                  </View>
                </View>

                <View>
                  <TouchableOpacity
                    style={styles.uploadFileContainer}
                    onPress={handleFileSelection}
                  >
                    <FontAwesome
                      name="cloud-upload"
                      size={20}
                      color={theme.colors.primary}
                      style={styles.uploadLogo}
                    />
                    <Text style={styles.uploadText}>Upload GCash Receipt</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View>
                {selectedFiles.length > 0 ? (
                  <View>
                    {selectedFiles.map((file, index) => (
                      <View key={index} style={styles.selectedFileContainer}>
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
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
                            {file.name.length > 10
                              ? `${file.name.substring(
                                  0,
                                  10
                                )}...${file.name.substring(
                                  file.name.lastIndexOf(".") + 1
                                )}`
                              : file.name}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={{ marginLeft: "auto" }}
                          onPress={() => confirmRemoveFile(index)}
                        >
                          <Ionicons
                            name={"close-circle-outline"}
                            size={25}
                            color={theme.colors.BLACKS}
                          />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text></Text>
                )}
              </View>
              <TouchableOpacity
                style={{
                  position: "relative",
                  backgroundColor: theme.colors.primary,
                  borderRadius: 10,
                  marginTop: 13,
                  width: "100%",
                  alignSelf: "center",
                }}
                onPress={() => handleSubmitPayment()}
              >
                <Text style={styles.postText}>SUBMIT</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </AlertNotificationRoot>
    </SafeAreaView>
  );
};

export default GcashPaymentScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: theme.colors.WHITE,
    padding: 18,
  },
  container: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
  },
  image: {
    alignSelf: "center",
    height: 30,
    resizeMode: "contain",
    marginTop: 15,
  },
  inputFieldContainer: {
    marginVertical: 4,
    width: "100%",
  },
  inputField: {
    width: "100%",
    borderWidth: 1,
    borderColor: theme.colors.BLACKS,
    borderRadius: 10,
    paddingStart: 15,
    fontFamily: "Roboto-Regular",
    height: 42,
    textAlignVertical: "center",
    color: theme.colors.BLACKS,
  },

  inputLabel: {
    fontFamily: "Roboto-Medium",
    color: theme.colors.BLACKS,
    marginBottom: 5,
    marginStart: 5,
    fontSize: 14,
  },

  minMax: {
    fontFamily: "Roboto-Medium",
    color: theme.colors.primary,
    marginBottom: 5,
    marginStart: 5,
    fontSize: 10,
  },
  postText: {
    color: theme.colors.WHITE,
    alignSelf: "center",
    padding: 13,
    fontWeight: "700",
    fontSize: 18,
    letterSpacing: 1,
  },

  uploadFileContainer: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    height: 50,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eaf8ff",
  },
  uploadText: {
    fontFamily: "Roboto-Medium",
    color: "black",
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

  notification: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
});
