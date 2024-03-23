import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, UTILITIES } from "../assets/constants/index";
const EditProfileScreen = ({ route }) => {
  const { profile } = route.params;
  const [lastName, setLastName] = useState(profile?.last_name);
  const [firstName, setFirstName] = useState(profile?.first_name);

  return (
    <SafeAreaView style={{ backgroundColor: COLORS.WHITE, flex: 1 }}>
      <ScrollView>
        <View style={styles.mainContainer}>
          <View style={UTILITIES.inputContainer}>
            <Text style={UTILITIES.title}>First Name</Text>
            <TextInput
              style={UTILITIES.inputField}
              value={firstName}
              onChangeText={setFirstName}
              type="text"
            />
          </View>
          <View style={UTILITIES.inputContainer}>
            <Text style={UTILITIES.title}>Last Name</Text>
            <TextInput
              style={UTILITIES.inputField}
              value={lastName}
              onChangeText={setLastName}
              type="text"
            />
          </View>
          <View style={UTILITIES.inputContainer}>
            <Text style={UTILITIES.title}>Last Name</Text>
            <TextInput
              style={UTILITIES.inputField}
              placeholder={profile?.last_name}
              type="text"
            />
          </View>
          <View style={UTILITIES.inputContainer}>
            <Text style={UTILITIES.title}>Username</Text>
            <TextInput
              style={UTILITIES.inputField}
              placeholder={profile?.first_name}
              type="text"
            />
          </View>
          <View style={UTILITIES.inputContainer}>
            <Text style={UTILITIES.title}>About me</Text>
            <TextInput
              style={[UTILITIES.inputField, { height: 100 }]}
              placeholder="Enter some brief about project "
              type="text"
              multiline
              autoCorrect={false}
              numberOfLines={4} // Set the maximum number of lines to 4
              maxHeight={100} // Set the maximum height to 100 units
              maxLength={250}
              textAlignVertical="top"
            />
          </View>

          <View style={UTILITIES.inputContainer}>
            <Text style={UTILITIES.title}>First Name</Text>
            <TextInput
              style={UTILITIES.inputField}
              placeholder={profile?.first_name}
              type="text"
            />
          </View>

          <View style={UTILITIES.inputContainer}>
            <Text style={UTILITIES.title}>Skill Tags</Text>
            <TextInput
              style={UTILITIES.inputField}
              placeholder={profile?.first_name}
              type="text"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  textField: {
    fontFamily: "Raleway-ThinItalic",
    fontSize: 16,
    color: "black",
  },

  mainContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
});
