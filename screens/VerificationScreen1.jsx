import { React, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { URL } from "@env";
import * as theme from "../assets/constants/theme";
import Button from "../components/Button";
import Feather from "react-native-vector-icons/Feather";
import axios from "axios";
import TagInput from "../components/TagInput";
import LoadingComponent from "../components/LoadingComponent";
const VerificationScreen1 = ({ onNext, values, setValues, navigation }) => {
  const [inputText, setInputText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [areasOfExpertise, setAreasOfExpertise] = useState({});
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState(0);
  const onChangeSkills = (newSkills) => {
    setValues((prev) => ({ ...prev, skillTags: newSkills }));
  };

  const handleInputChange = (text) => {
    setInputText(text); // Update the state
    setValues({ ...values, areaOfExpertise: text }); // Update the values state
    if (text === "") {
      setSuggestions([]); // Clear suggestions when input is empty
    } else {
      const filteredSuggestions = Object.values(
        areasOfExpertise.areasOfExpertise
      ).filter((category) =>
        category.toLowerCase().includes(text.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    }
  };
  const handleSuggestionPress = (category) => {
    const key = Object.keys(areasOfExpertise.areasOfExpertise).find(
      (key) => areasOfExpertise.areasOfExpertise[key] === category
    );

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
      onNext();
    } else {
      alert("All fields are required");
    }
  };

  useEffect(() => {
    fetchExpertiseCategories();
  }, []);
  const fetchExpertiseCategories = async () => {
    try {
      const response = await axios.get(
        `${URL}/api/student-validations/expertise`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.data;

      const transformedData = {
        areasOfExpertise: {},
      };

      data.forEach((item) => {
        transformedData.areasOfExpertise[item.id.toString()] = item.expertise;
      });

      setAreasOfExpertise(transformedData);
      setLoading(false);
    } catch (error) {
      alert(error);
      setLoading(false);
    }
  };
  return (
    <ScrollView>
      <TouchableWithoutFeedback
        onPress={(handlePressOutside, Keyboard.dismiss)}
      >
        {loading ? (
          <LoadingComponent />
        ) : (
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
                marginTop: 20,
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
                    fontSize: 18,
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
                  placeholderTextColor="#000"
                  style={styles.inputField}
                  placeholder="Enter your username"
                  value={values.userName}
                  onChangeText={(text) =>
                    setValues({ ...values, userName: text })
                  }
                />
              </View>
              <View style={styles.inputFieldContainer}>
                <Text style={styles.inputLabel}>First Name</Text>
                <TextInput
                  placeholderTextColor="#000"
                  style={styles.inputField}
                  placeholder="Enter your first name"
                  value={values.firstName}
                  onChangeText={(text) =>
                    setValues({ ...values, firstName: text })
                  }
                />
              </View>

              <View style={styles.inputFieldContainer}>
                <Text style={styles.inputLabel}>Last Name</Text>
                <TextInput
                  placeholderTextColor="#000"
                  style={styles.inputField}
                  placeholder="Enter your last name"
                  value={values.lastName}
                  onChangeText={(text) =>
                    setValues({ ...values, lastName: text })
                  }
                />
              </View>

              <TouchableWithoutFeedback onPress={handlePressOutside}>
                <View style={styles.inputFieldContainer}>
                  <Text style={styles.inputLabel}>Area of Expertise</Text>
                  <TextInput
                    style={styles.inputField}
                    label="Area of Expertise"
                    placeholderTextColor="#000"
                    placeholder="Choose or input your area of expertise"
                    value={inputText}
                    onChangeText={handleInputChange}
                  />
                  <FlatList
                    style={{ maxHeight: 150, backgroundColor: "white" }}
                    data={suggestions}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => handleSuggestionPress(item)}
                      >
                        <View>
                          <Text
                            style={{
                              marginTop: 12,
                              marginStart: 12,
                              fontWeight: 600,
                              fontSize: 14,
                              marginBottom: 5,
                              color: "black",
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
              </TouchableWithoutFeedback>
              <View style={styles.inputFieldContainer}>
                <Text style={[styles.inputLabel, { marginBottom: -4 }]}>
                  Skill Tags
                </Text>
                <TagInput
                  key={key}
                  initialTags={values.jobTags}
                  onChangeTags={onChangeSkills}
                  style={{ marginVertical: 0 }}
                />
              </View>
            </View>

            <View
              style={{
                position: "relative",
                width: "100%",
                marginTop: 50,
              }}
            >
              <Button title="Next" onPress={handleNextPress} filled />
            </View>
          </View>
        )}
      </TouchableWithoutFeedback>
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
    width: "100%",
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 10,
    paddingStart: 15,
    fontFamily: "Roboto-Regular",
  },
});
