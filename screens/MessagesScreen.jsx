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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";

import * as theme from "../assets/constants/theme";
import Feather from "react-native-vector-icons/Feather";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import LoadingComponent from "../components/LoadingComponent";
import dayjs from "dayjs";
import "dayjs/locale/en";
import { URL } from "@env";
import { Rating } from "react-native-ratings";
import { useMessageContext } from "../hooks/MessageContext";
const ProposalListScreen = ({ route, navigation }) => {
  const { messageError, messageLoading, message, fetchMessageData } =
    useMessageContext();
  const [refreshing, setRefreshing] = useState(false);

  const renderItem = ({ item, project }) => {
    const createdAt = dayjs(item.created_at);
    const now = dayjs();
    const isNew = now.diff(createdAt, "hour") < 12;
    return (
      <View style={styles.item}>
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "Roboto-Light",
                fontSize: 12,
                color: "black",
              }}
            >
              {createdAt.format("MMMM D, YYYY h:mm A")}
            </Text>
            <Text style={styles.dateText}>
              {isNew && <Text style={styles.newLabel}>NEW</Text>}
            </Text>
          </View>

          <Text
            style={{ color: "black", fontFamily: "Roboto-Light", fontSize: 14 }}
          >
            {item.message}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      {messageLoading ? (
        <LoadingComponent />
      ) : (
        <View style={styles.container}>
          {(message && (
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
    padding: 20,
    marginVertical: 8,
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
});
