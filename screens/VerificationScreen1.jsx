import { React, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from "react-native-paper";
import { COLORS } from "../assets/constants/index";
import Button from "../components/Buttons/Button";
import areasOfExpertise from "../hooks/AreaOfExpertise";
const VerificationScreen1 = ({ onNext, values, setValues }) => {
  const [inputText, setInputText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [errorMessage, setErrorMessage] = useState(false);

  const handleInputChange = (text) => {
    setInputText(text); // Update the state
    setValues({ ...values, areaOfExpertise: text }); // Update the values state
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
    setInputText(category); // Set the category as the input text
    setValues({ ...values, areaOfExpertise: key }); // Set the key as the value for areaOfExpertise in the props
    setSuggestions([]); // Clear suggestions
  };

  const handlePressOutside = () => {
    setSuggestions([]); // Clear suggestions when pressing outside the TextInput or FlatList
  };

  const handleNextPress = () => {
    // Check if all input fields are filled
    if (
      values.userName &&
      values.firstName &&
      values.lastName &&
      values.areaOfExpertise
    ) {
      // All fields are filled, proceed to next screen
      onNext();
    } else {
      alert("All fields are required");
    }
  };
  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <View style={[styles.container]}>
        <View style={{ flex: 1, backgroundColor: "white" }}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <View style={{ marginVertical: 18 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "Roboto-Bold",
                  color: "black",
                  textAlign: "center",
                }}
              >
                Please fill up the following to proceed!
              </Text>
            </View>
            <View style={{ marginBottom: 6 }}>
              <TextInput
                mode="outlined"
                style={{ margin: 8 }}
                label="Username"
                placeholder="Enter your username"
                value={values.userName}
                onChangeText={(text) =>
                  setValues({ ...values, userName: text })
                }
                outlineColor={COLORS.black} // Change the outline color based on the theme's primary color
                activeOutlineColor={COLORS.primary}
              />
            </View>
            <View style={{ marginBottom: 6 }}>
              <TextInput
                mode="outlined"
                style={{ margin: 8 }}
                label="First Name"
                placeholder="Enter your first name"
                value={values.firstName}
                onChangeText={(text) =>
                  setValues({ ...values, firstName: text })
                }
                outlineColor={COLORS.black} // Change the outline color based on the theme's primary color
                activeOutlineColor={COLORS.primary}
              />
            </View>

            <View style={{ marginBottom: 6 }}>
              <TextInput
                mode="outlined"
                style={{ margin: 8 }}
                label="Last Name"
                placeholder="Enter your last name"
                value={values.lastName}
                onChangeText={(text) =>
                  setValues({ ...values, lastName: text })
                }
                outlineColor={COLORS.black} // Change the outline color based on the theme's primary color
                activeOutlineColor={COLORS.primary}
              />
            </View>

            <View style={{ marginBottom: 12 }}>
              <TextInput
                mode="outlined"
                style={{ margin: 8 }}
                label="Area of Expertise"
                placeholder="Choose or input your area of expertise"
                value={inputText}
                onChangeText={handleInputChange}
                outlineColor={COLORS.black}
                activeOutlineColor={COLORS.primary}
              />

              <FlatList
                style={{ height: 150, backgroundColor: "white" }}
                data={suggestions}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleSuggestionPress(item)}>
                    <View style={{ padding: 10 }}>
                      <Text
                        style={{
                          marginStart: 12,
                          fontWeight: 600,
                          fontSize: 14,
                        }}
                      >
                        {item}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </View>

          <Button
            title="Next"
            style={{
              position: "absolute",
              width: "100%",
              bottom: 0,
              zIndex: -1,
            }}
            onPress={handleNextPress}
            filled
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default VerificationScreen1;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
