import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import Feather from "react-native-vector-icons/Feather";
import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useGetIsStudent } from "../hooks/dataHooks/useGetIsStudent";
import { COLORS, UTILITIES } from "../assets/constants/index";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfileScreen = ({ navigation }) => {
  const [error, loading, isStudent] = useGetIsStudent();

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.logoutContainer}>
            <Feather
              name="arrow-left"
              size={24}
              color={COLORS.black}
              onPress={() => {
                navigation.goBack();
              }}
            />

            <TouchableOpacity>
              <View style={styles.log}>
                <Entypo
                  name="log-out"
                  size={20}
                  color="white"
                  style={{ alignSelf: "center", marginLeft: 5 }}
                />
                <Text style={styles.logout}>LOGOUT</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.innerContainer}>
            <Image
              style={styles.image}
              source={{
                uri: `https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?w=740&t=st=1670148608~exp=1670149208~hmac=bc57b66d67d2b9f4929c8e592ff17e8c8660721608add2f18fc20d19c1aab7e4`,
              }}
            />
            <Text style={styles.userText}>
              {isStudent?.first_name + " " + isStudent?.last_name}
            </Text>
            <Text style={styles.course}>{isStudent?.course}</Text>
          </View>

          <View style={UTILITIES.inputContainer}>
            <Text style={UTILITIES.title}>First Name</Text>
            <View style={[UTILITIES.inputField]}>
              <Text style={styles.textField}>{isStudent?.first_name}</Text>
            </View>
          </View>

          <View style={UTILITIES.inputContainer}>
            <Text style={UTILITIES.title}>Last Name</Text>
            <View style={[UTILITIES.inputField]}>
              <Text style={styles.textField}>{isStudent?.last_name}</Text>
            </View>
          </View>
          <View style={UTILITIES.inputContainer}>
            <Text style={UTILITIES.title}>Usermame</Text>
            <View style={[UTILITIES.inputField]}>
              <Text style={styles.textField}>ohhEarl</Text>
            </View>
          </View>

          <View style={UTILITIES.inputContainer}>
            <Text
              style={[
                UTILITIES.title,
                { marginStart: 7, color: COLORS.primary, fontSize: 16 },
              ]}
            >
              Course
            </Text>
            <View style={[UTILITIES.inputField]}>
              <Text style={styles.textField}>{isStudent?.course}</Text>
            </View>
          </View>

          <View style={[UTILITIES.inputContainer]}>
            <Text style={UTILITIES.title}>About me</Text>
            <View
              style={[UTILITIES.inputField, { maxHeight: 200, height: 150 }]}
            >
              <Text style={[styles.textField]}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum
                laboriosam rerum amet cupiditate deleniti aut, ut fuga officiis?
                Explicabo, at asperiores? Modi, sint ipsam! Itaque eligendi
                voluptates voluptas obcaecati vero. Lorem ipsum dolor sit amet.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              navigation.navigate("EditProfileScreen", {
                profile: isStudent,
              });
            }}
          >
            <View style={[styles.seperateContainer, { marginBottom: 24 }]}>
              <Text style={styles.seperateText}>Edit Profile</Text>
              <AntDesign
                name="arrowright"
                size={20}
                style={{
                  alignSelf: "center",
                  right: 10,
                  position: "absolute",
                }}
                color="black"
              />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  container: {
    paddingHorizontal: 24,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover", // or 'stretch' or 'contain'
    justifyContent: "center",
  },
  image: {
    height: 80,
    width: 80,
    borderRadius: 70,
    borderWidth: 1,
    marginBottom: 10,
  },
  innerContainer: {
    marginHorizontal: 30,
    alignItems: "center",
  },

  course: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Roboto-Medium",
    color: COLORS.primary,
  },

  textField: {
    fontFamily: "Raleway-Medium",
    fontSize: 16,
    color: "black",
  },

  userText: {
    marginHorizontal: 50,
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },

  logoutContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 32,
    paddingBottom: 24,
    alignItems: "center",
  },
  log: {
    flexDirection: "row",
    alignSelf: "center", // Center the button horizontally
    borderRadius: 50,
    borderColor: "#D6E6FF",
    padding: 6,
    backgroundColor: COLORS.primary,
  },
  logout: {
    margin: 5,
    color: COLORS.white,
    fontWeight: "600",
  },
  seperateContainer: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 3,
    paddingStart: 15,
    borderRadius: 10,
    elevation: 3,
    marginTop: 15,
    alignItems: "center",
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },

  seperateText: {
    margin: 18,
    fontSize: 18,
    fontFamily: "ProximaNova-Bold",
    color: "#212121",
  },
});
