import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,

} from 'react-native';


const VerificationConfirmation = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View>
          <Text style={styles.header}>
            We need to verify your identification
          </Text>
        </View>

        <View style={styles.firstParagraphHeader}>
          <Text style={styles.firstParagraph}>
            In order to proceed, we need to be 100% sure that you are a student
            of Negros Oriental State University (NORSU) Dumaguete City.
          </Text>
          <Text style={styles.secondParagraphHeader}>
            You just need to fill up some information which will help us to
            build a secure system together
          </Text>
        </View>
      </View>

 
    </SafeAreaView>
  );
};

export default VerificationConfirmation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  content: {
    paddingHorizontal: 30,
  },
  header: {
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 20,
    color: '#0d0a0b',
  },
  firstParagraphHeader: {
    marginVertical: 24,
  },
  firstParagraph: {
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 16,
  },
  secondParagraphHeader: {
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 16,
  },
});
