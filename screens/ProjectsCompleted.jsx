import { useEffect, useState } from "react";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import * as theme from "../assets/constants/theme";
import Feather from "react-native-vector-icons/Feather";
import axios from "axios";
const ProjectsCompleted = ({ navigation, route }) => {
  const { token } = route?.params;
  const { user } = route?.params;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log(loading);
  const fetchJobCompleted = async (userId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://10.0.2.2:8000/api/project/created/show/${userId}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(response.data.data);
    } catch (error) {
      alert(error, "Please close the application and open again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposalSubmitted(user?.id);
  }, [user?.id]);
  return (
    <SafeAreaView style={styles.mainContainer}>
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
            marginRight: 25,
            fontFamily: "Roboto-Medium",
            color: theme.colors.BLACKS,
            fontSize: 18,
          }}
        >
          Project Completed
        </Text>
        <Text></Text>
      </View>
      <ScrollView>
        <View style={styles.container}>
          <Text>Projects Completed</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProjectsCompleted;
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: theme.colors.WHITE,
    padding: 24,
  },
});
