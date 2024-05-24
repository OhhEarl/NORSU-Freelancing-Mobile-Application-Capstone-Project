import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Button,
  Modal,
  Alert,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";
import * as theme from "../assets/constants/theme";
const TermsAndConditions = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
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
            fontFamily: "Roboto-Medium",
            color: theme.colors.BLACKS,
            fontSize: 14,
          }}
        >
          NORSU Mobile Freelancing Application
        </Text>
        <Text>{"   "}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { fontSize: 18, marginTop: 10 }]}>
          Terms and Conditions
        </Text>
        <View style={styles.holder}>
          <Text style={styles.title}>Eligibility:</Text>
          <Text style={styles.text}>
            {"\u2B24"} You must be a currently enrolled student at Negros
            Oriental State University (NORSU) to use this application.
          </Text>
        </View>
        <View style={styles.holder}>
          <Text style={styles.title}>User Accounts:</Text>
          <Text style={styles.text}>
            {"\u2B24"} You are responsible for maintaining the confidentiality
            of your account credentials and for all activities that occur under
            your account.
          </Text>
        </View>
        <View style={styles.holder}>
          <Text style={styles.title}>User Project Proposals and Fees:</Text>
          <Text style={styles.text}>
            {"\u2B24"} You understand that a 2% project proposal budget
            deduction will be applied to each proposal submitted.
          </Text>
          <Text style={styles.text}>
            {"\u2B24"} This deduction will be used to support and maintain the
            NORSU Mobile Freelancing Application and related services for the
            benefit of the university and its students.
          </Text>
          <Text style={styles.text}>
            {"\u2B24"} You are solely responsible for setting your project
            proposal budgets and any fees associated with your services.
          </Text>
        </View>

        <View style={styles.holder}>
          <Text style={styles.title}>Content and Conduct:</Text>
          <Text style={styles.text}>
            {"\u2B24"} You are responsible for all content you submit to the
            application, including project proposals and communication with
            other users.
          </Text>
          <Text style={styles.text}>
            {"\u2B24"} You agree not to submit any content that is unlawful,
            harmful, threatening, abusive, harassing, defamatory, obscene,
            hateful, or racially or ethnically offensive.
          </Text>
          <Text style={styles.text}>
            {"\u2B24"} You agree to use the application in a respectful and
            professional manner.
          </Text>
        </View>

        <View style={styles.holder}>
          <Text style={styles.title}>Termination:</Text>
          <Text style={styles.text}>
            {"\u2B24"} NORSU Mobile Freelancing Application reserves the right
            to terminate your account at any time for any reason, including, but
            not limited to, violations of these Terms and Conditions.
          </Text>
        </View>

        <View style={styles.holder}>
          <Text style={styles.title}>Disclaimer:</Text>
          <Text style={styles.text}>
            {"\u2B24"} NORSU Mobile Freelancing Application does not guarantee
            the success of any project proposal. You are responsible for
            securing project contracts and completing projects according to your
            agreements with clients.
          </Text>
          <Text style={styles.text}>
            {"\u2B24"} The application acts as a platform to connect students
            and potential clients. We are not responsible for the quality of
            services provided or the outcome of any projects.
          </Text>
        </View>

        <Text style={[styles.title, { fontSize: 18, marginTop: 10 }]}>
          Privacy Policy
        </Text>

        <View style={styles.holder}>
          <Text style={styles.title}>Information Collection and Use:</Text>
          <Text style={styles.text}>
            {"\u2B24"} We collect certain personal information when you register
            for an account, such as your name, student ID, and contact
            information.
          </Text>
          <Text style={styles.text}>
            {"\u2B24"} We may collect additional information as you use the
            application, such as your project proposals and communication with
            other users.
          </Text>
          <Text style={styles.text}>
            {"\u2B24"} We use this information to operate and maintain the
            application, to provide you with services, and to connect you with
            potential clients.
          </Text>
          <Text style={styles.text}>
            {"\u2B24"} We will not share your personal information with any
            third parties without your consent, except as required by law.
          </Text>
        </View>

        <View style={styles.holder}>
          <Text style={styles.title}>Data Security:</Text>
          <Text style={styles.text}>
            {"\u2B24"} We take reasonable steps to protect your personal
            information from unauthorized access, disclosure, alteration, or
            destruction.
          </Text>
          <Text style={styles.text}>
            {"\u2B24"} However, no website or internet transmission is
            completely secure. We cannot guarantee the security of your
            information.
          </Text>
        </View>

        <View style={styles.holder}>
          <Text style={styles.title}>Your Choices:</Text>
          <Text style={styles.text}>
            {"\u2B24"} You have the right to access and update your personal
            information.
          </Text>
          <Text style={styles.text}>
            {"\u2B24"} However, no website or internet transmission is
            completely secure. We cannot guarantee the security of your
            information.
          </Text>
        </View>
        <View style={styles.holder}>
          <Text style={styles.title}>Additional Terms:</Text>
          <Text style={styles.text}>
            {"\u2B24"} NORSU Mobile Freelancing Application reserves the right
            to update these Terms and Conditions and Privacy Policy at any time.
          </Text>
          <Text style={styles.text}>
            {"\u2B24"} Continued use of the application following any changes
            constitutes your acceptance of the revised terms.
          </Text>
        </View>
        <View style={styles.holder}>
          <Text style={styles.title}>Governing Law:</Text>
          <Text style={styles.text}>
            {"\u2B24"} These Terms and Conditions and Privacy Policy will be
            governed by and construed in accordance with the laws of the
            Philippines.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsAndConditions;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.WHITE,
    padding: 24,
  },
  holder: {
    paddingVertical: 10,
  },
  title: {
    fontFamily: "Roboto-Medium",
    color: "black",
  },
  text: {
    marginVertical: 5,
    fontFamily: "Roboto-Light",
    color: "#696969",
  },
});
