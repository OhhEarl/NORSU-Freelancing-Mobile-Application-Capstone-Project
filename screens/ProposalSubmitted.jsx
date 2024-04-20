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
import Entypo from "react-native-vector-icons/Entypo";
import axios from "axios";
import { useEffect, useState } from "react";
import LoadingComponent from "../components/LoadingComponent";
import dayjs from "dayjs";
import "dayjs/locale/en";
const ProposalSubmitted = ({ route, navigation }) => {
  const { token } = route?.params;
  const { user } = route?.params;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showOptionsIndex, setShowOptionsIndex] = useState(null);

  const toggleOptions = (index) => {
    setShowOptionsIndex((prev) => (prev === index ? null : index));
  };
  const fetchProposalSubmitted = async (userId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://10.0.2.2:8000/api/project/proposals/show/${userId}`,
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
  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.item}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 5,
          }}
        >
          <Text style={styles.ProjectTitle}>Project Title</Text>
          <TouchableOpacity onPress={() => toggleOptions(index)}>
            <Entypo name={"dots-three-horizontal"} color={"black"} size={25} />
          </TouchableOpacity>

          {showOptionsIndex === index && (
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() =>
                  navigation.navigate("ProposalScreen", {
                    item: item,
                    isEditing: true,
                  })
                }
              >
                <Text style={styles.optionText}>View</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionButton}>
                <Text style={styles.optionText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Text style={styles.title}>{item.job_title}</Text>
        <Text style={styles.description}>{item.expertise_explain}</Text>

        <View style={styles.detailsContainer}>
          <Text style={styles.due}>Due Date: </Text>
          <Text style={styles.dueDate}>
            {dayjs(item.due_date).format("MMMM D, YYYY")}
          </Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.due}>Status: </Text>
          <Text style={styles.dueDate}>
            {item.status === 0 ? "Pending" : "Completed"}
          </Text>
        </View>
      </View>
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
          Proposals Submitted
        </Text>
        <Text></Text>
      </View>

      {loading ? (
        <LoadingComponent />
      ) : (
        <View style={styles.container}>
          <FlatList
            showsVerticalScrollIndicator={false}
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

export default ProposalSubmitted;
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: theme.colors.WHITE,
    padding: 18,
  },
  container: {
    flex: 1,
    marginVertical: 15,
  },
  item: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: theme.colors.GRAY_LIGHT,
    padding: 20,
    marginVertical: 8,
  },
  ProjectTitle: {
    fontFamily: "Roboto-Medium",
  },
  title: {
    fontSize: theme.sizes.h3,
    fontFamily: "Roboto-Medium",
    color: "black",
  },
  description: {
    fontSize: theme.sizes.h2,
    fontFamily: "Roboto-Light",
    marginVertical: 10,
  },
  flatList: {
    flex: 1,
  },

  due: {
    fontSize: theme.sizes.h2,
    fontFamily: "Roboto-Medium",
    color: "black",
    marginBottom: 2,
  },
  detailsContainer: {
    marginVertical: 4,
  },

  dueDate: {
    fontSize: theme.sizes.h2,
    paddingLeft: 20,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: theme.colors.inputField,
    color: "black",
    fontFamily: "Roboto-Medium",
    borderRadius: 5,
  },

  optionsContainer: {
    position: "absolute",
    right: 0,
    top: 25, // adjust this value to position the rectangle correctly
    backgroundColor: "white",
    borderRadius: 5,
    elevation: 5,
    zIndex: 1,
  },
  optionButton: {
    paddingHorizontal: 30,
    paddingVertical: 8,
    borderBottomColor: "#e0e0e0",
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: theme.sizes.h3,
    fontFamily: "Roboto-Medium",
    color: "black",
  },
});
