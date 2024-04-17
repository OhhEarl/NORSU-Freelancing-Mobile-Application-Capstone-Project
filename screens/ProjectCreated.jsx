import { useEffect, useState } from "react";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as theme from "../assets/constants/theme";
import Feather from "react-native-vector-icons/Feather";
import axios from "axios";

import LoadingComponent from "../components/LoadingComponent";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
const ProjectCreated = ({ route, navigation }) => {
  const { token } = route?.params;
  const { user } = route?.params;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProposalSubmitted = async (userId) => {
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

      setData([response.data.data]);
    } catch (error) {
      alert(error, "Please close the application and open again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposalSubmitted(user?.id);
  }, [user?.id]);
  const renderItem = ({ item }) => {
    const startDate = dayjs(item?.job_start_date);
    const endDate = dayjs(item?.job_end_date);

    const durationInDays = endDate.diff(startDate, "day");
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("ProjectDetailsScreen", {
            project: item,
            id: item.student_user_id,
          })
        }
      >
        <View style={styles.item}>
          <Text style={styles.title}>{item.job_title}</Text>
          <Text style={styles.category}>{item.job_category.value}</Text>
          <View
            style={{ flexDirection: "row", marginTop: 5, alignItems: "center" }}
          >
            <Text style={styles.due}>Budget: </Text>
            <Text style={styles.dueDate}>
              ₱{item.job_budget_from} - ₱{item.job_budget_to}
            </Text>
          </View>
          <View
            style={{ flexDirection: "row", marginTop: 5, alignItems: "center" }}
          >
            <Text style={styles.due}>Duration: </Text>
            <Text style={styles.dueDate}>{durationInDays} Days</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
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
          Project Created
        </Text>
        <Text></Text>
      </View>

      {loading ? (
        <LoadingComponent />
      ) : (
        <View style={styles.container}>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.flatList}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default ProjectCreated;
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: theme.colors.WHITE,
    padding: 24,
  },
  container: {
    flex: 1,
    padding: 10,

    marginVertical: 15,
  },
  item: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: theme.colors.GRAY_LIGHT,
    padding: 20,
    marginVertical: 8,
  },
  title: {
    fontSize: theme.sizes.h3 + 2,
    fontFamily: "Roboto-Medium",
    color: "black",
  },
  category: {
    fontFamily: "Roboto-Regular",
    color: "black",
    fontSize: theme.sizes.h2 + 2,
  },
  description: {
    fontSize: 16,
    fontFamily: "Roboto-Light",
    marginVertical: 10,
  },
  flatList: {
    flex: 1,
  },
  due: {
    fontFamily: "Roboto-Medium",
    color: "black",
  },

  dueDate: {
    backgroundColor: theme.colors.primary,
    color: "white",
    padding: 5,
    borderRadius: 5,
  },
  showDetails: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
  },
});
