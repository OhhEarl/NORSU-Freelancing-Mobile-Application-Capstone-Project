import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as theme from "../assets/constants/theme";
import Feather from "react-native-vector-icons/Feather";
import axios from "axios";
import { useEffect, useState } from "react";
import LoadingComponent from "../components/LoadingComponent";
const ProposalSubmitted = ({ route, navigation }) => {
  const { token } = route?.params;
  const { user } = route?.params;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

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
    console.log("Rendering Item:", item); // Add this line
    return (
      <View style={styles.item}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.due}>Due Date: </Text>
          <Text style={styles.dueDate}>{item.due_date}</Text>
        </View>

        <View style={{ flexDirection: "row", marginTop: 5 }}>
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
    fontSize: 20,
    fontFamily: "Roboto-Medium",
    color: "black",
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
});
