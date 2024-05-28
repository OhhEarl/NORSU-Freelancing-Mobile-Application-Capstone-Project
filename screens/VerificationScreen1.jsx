import { React, useState, useEffect } from "react";
import { View, StyleSheet, TextInput, Text, ScrollView } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import * as theme from "../assets/constants/theme";
import Button from "../components/Button";
import Feather from "react-native-vector-icons/Feather";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import TagInput from "../components/TagInput";
const VerificationScreen1 = ({ onNext, values, setValues, navigation }) => {
  const [key, setKey] = useState(0);
  const onChangeSkills = (newSkills) => {
    setValues((prev) => ({ ...prev, skillTags: newSkills }));
  };
  const isFocused = useIsFocused();
  useEffect(() => {
    setKey((prevKey) => prevKey - 1);
    setValues((prev) => ({ ...prev, skillTags: [] }));
  }, [isFocused]);

  const handleNextPress = () => {
    const {
      userName,
      firstName,
      lastName,
      areaOfExpertise,
      mobile_number,
      skillTags,
    } = values;

    if (
      !userName ||
      !firstName ||
      !lastName ||
      !areaOfExpertise ||
      !mobile_number ||
      skillTags.length === 0
    ) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Validation Failed",
        textBody: "Please fill out all required fields.",
        button: "Close",
      });
    } else if (mobile_number === 11) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Phone Number Error",
        textBody: "Phone number must be 11 digits number.",
        button: "Close",
      });
    } else {
      onNext();
    }
  };

  return (
    <ScrollView>
      <AlertNotificationRoot style={styles.notification}>
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            paddingHorizontal: 30,
            paddingVertical: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 10,
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
                color: theme.colors.BLACKS,
                fontSize: 18,
              }}
            >
              Step 1
            </Text>
            <Text></Text>
          </View>
          <View>
            <View style={{ marginVertical: 9, marginTop: 30 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Roboto-Bold",
                  color: theme.colors.BLACKS,
                  textAlign: "center",
                }}
              >
                Please fill up the following to proceed!
              </Text>
            </View>
            <View style={styles.inputFieldContainer}>
              <Text style={styles.inputLabel}>Username</Text>
              <TextInput
                autoCapitalize="words"
                placeholderTextColor={theme.colors.gray}
                style={styles.inputField}
                placeholder="Enter username"
                value={values.userName}
                onChangeText={(text) =>
                  setValues({ ...values, userName: text })
                }
              />
            </View>
            <View style={styles.inputFieldContainer}>
              <Text style={styles.inputLabel}>First Name</Text>
              <TextInput
                autoCapitalize="words"
                placeholderTextColor={theme.colors.gray}
                style={styles.inputField}
                placeholder="Enter first name"
                value={values.firstName}
                onChangeText={(text) =>
                  setValues({ ...values, firstName: text })
                }
              />
            </View>

            <View style={styles.inputFieldContainer}>
              <Text style={styles.inputLabel}>Last Name</Text>
              <TextInput
                placeholderTextColor={theme.colors.gray}
                style={styles.inputField}
                placeholder="Enter last name"
                value={values.lastName}
                onChangeText={(text) =>
                  setValues({ ...values, lastName: text })
                }
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputFieldContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                type="text"
                maxLength={11}
                keyboardType="numeric"
                placeholderTextColor={theme.colors.gray}
                style={styles.inputField}
                placeholder="Enter mobile number"
                value={values.mobile_number}
                onChangeText={(text) =>
                  setValues({ ...values, mobile_number: text })
                }
              />

              <View style={{ alignItems: "flex-end", marginBottom: -5 }}>
                <Text
                  style={{
                    fontFamily: "Roboto-Medium",
                    color: "black",
                    fontSize: 12,
                    marginEnd: 5,
                    marginBottom: -25,
                  }}
                >
                  {values.mobile_number.length} / 11
                </Text>
              </View>
            </View>

            <View style={styles.inputFieldContainer}>
              <Text style={styles.inputLabel}>Area of Expertise</Text>
              <TextInput
                style={styles.inputField}
                placeholderTextColor={theme.colors.gray}
                placeholder="Enter area of expertise"
                value={values.areaOfExpertise}
                onChangeText={(text) =>
                  setValues({ ...values, areaOfExpertise: text })
                }
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputFieldContainer}>
              <Text style={[styles.inputLabel, { marginBottom: -4 }]}>
                Skill Tags
              </Text>
              <TagInput
                key={key}
                initialTags={values.jobTags}
                onChangeTags={onChangeSkills}
                style={{ marginVertical: 0, color: "black" }}
                tags={values.skillTags}
              />
            </View>
          </View>

          <View
            style={{
              position: "relative",
              width: "100%",
            }}
          >
            <Button title="Next" onPress={handleNextPress} filled />
          </View>
        </View>
      </AlertNotificationRoot>
    </ScrollView>
  );
};

export default VerificationScreen1;
const styles = StyleSheet.create({
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
    color: "black",
    width: "100%",
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 10,
    paddingStart: 15,
    fontFamily: "Roboto-Regular",
  },
});
