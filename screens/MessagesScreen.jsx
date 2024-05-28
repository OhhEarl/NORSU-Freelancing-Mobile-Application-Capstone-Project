import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  RefreshControl,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";

import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as theme from "../assets/constants/theme";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import LoadingComponent from "../components/LoadingComponent";
import dayjs from "dayjs";
import "dayjs/locale/en";
import { URL } from "@env";
import { useMessageContext } from "../hooks/MessageContext";
import { useAuthContext } from "../hooks/AuthContext";

const ProposalListScreen = ({ route, navigation }) => {
  const { token } = useAuthContext();
  const { messageError, messageLoading, message, fetchMessageData } =
    useMessageContext();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // State to manage modal visibility
  const [loading, setLoading] = useState();
  const handleShowModal = (itemId) => {
    setIsModalVisible(true); // Show the modal when the button is pressed
    setSelectedItemId(itemId);
  };

  const handleDeleteProject = () => {
    if (selectedItemId) {
      deleteCreatedProject(selectedItemId); // Call deletion function with the ID
    }
    setIsModalVisible(false); // Close the modal after deletion
  };

  const deleteCreatedProject = async (projectID) => {
    let url = `${URL}/message/delete/${projectID}`;
    try {
      setLoading(true);
      const response = await axios.post(url, null, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        await fetchMessageData();
        setSelectedItemId(null);
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "SUCCESS",
          textBody: "Message Deleted Successfully.",
          button: "Close",
        });
      }
    } catch (error) {
      await fetchMessageData();
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Something Went Wrong, Please Try again.",
        button: "Close",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item, project }) => {
    const createdAt = dayjs(item.created_at);
    const now = dayjs();
    const isNew = now.diff(createdAt, "hour") < 12;
    return (
      <View style={styles.item}>
        <View>
          <View
            style={{
              flexDirection: "column",
              justifyContent: "flex-start",
            }}
          >
            <Text style={styles.dateText}>
              {isNew ? <Text style={styles.newLabel}>NEW</Text> : ""}
            </Text>
            <Text
              style={{
                fontFamily: "Roboto-Light",
                fontSize: 12,
                color: "black",
              }}
            >
              {createdAt.format("MMMM D, YYYY h:mm A")}
            </Text>
          </View>

          <Text
            style={{ color: "black", fontFamily: "Roboto-Light", fontSize: 14 }}
          >
            {item.message}
          </Text>
          <TouchableOpacity
            style={{ flexDirection: "row", justifyContent: "flex-end" }}
            onPress={() => {
              handleShowModal(item.id);
            }}
          >
            <Text
              style={{
                fontFamily: "Roboto-Medium",
                color: "white",
                backgroundColor: "red",
                borderRadius: 5,
                fontSize: 12,
                padding: 2,
                marginTop: 2,
                paddingHorizontal: 7,
              }}
            >
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      {messageLoading || loading ? (
        <LoadingComponent />
      ) : (
        <View style={styles.container}>
          {(message && message?.length > 0 && (
            <>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={message}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                style={styles.flatList}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={fetchMessageData}
                  />
                }
              />
            </>
          )) || (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Image
                  source={require("../assets/no-data-found.jpg")}
                  style={{ height: 100, width: 100 }}
                />
                <Text
                  style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 18,
                    color: "black",
                  }}
                >
                  NO MESSAGES FOUND
                </Text>
              </View>
            </View>
          )}
        </View>
      )}

      <Modal visible={isModalVisible} transparent={true} animationType="none">
        <View style={styles.modalContainer}>
          <View style={styles.deleteContainer}>
            <TouchableOpacity
              onPress={() => {
                setIsModalVisible(false);
              }}
              style={{
                position: "relative",
                alignSelf: "flex-end",
                marginRight: 15,
              }}
            >
              <Ionicons
                name={"close-circle-outline"}
                color={"black"}
                size={30}
              />
            </TouchableOpacity>

            <AntDesign name={"exclamationcircle"} color={"orange"} size={50} />
            <Text style={styles.ohSnap}>ALERT!</Text>
            <Text style={styles.modalText}>
              Are You Sure You Want To Delete This Message?
            </Text>
            <TouchableOpacity
              style={styles.dismiss}
              onPress={handleDeleteProject}
            >
              <Text style={styles.dismissText}>DELETE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ProposalListScreen;

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
    padding: 10,
    marginVertical: 5,
  },

  flatList: {
    flex: 1,
  },

  newLabel: {
    color: "red", // or any color you prefer
    fontFamily: "Roboto-Bold",
    fontSize: 12,
    marginLeft: 5,
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  deleteContainer: {
    paddingTop: 15,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    maxHeight: 300,
    backgroundColor: "white",
  },

  ohSnap: {
    fontFamily: "Roboto-Medium",
    fontSize: 24,
    color: "black",
    marginTop: 12,
  },
  modalText: {
    fontFamily: "Roboto-Light",
    fontSize: 18,
    textAlign: "center",
    paddingHorizontal: 10,
    color: "#393939",
    marginBottom: 20,
    marginTop: 8,
  },
  dismiss: {
    width: "100%",
    backgroundColor: "orange",
    position: "relative",
    bottom: -1,
  },
  dismissText: {
    fontFamily: "Roboto-Medium",
    color: "white",
    padding: 12,
    alignSelf: "center",
  },
});
