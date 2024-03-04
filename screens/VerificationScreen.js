import {View, TextInput, StyleSheet, Image, Text} from 'react-native';
import Button from '../components/Buttons/Button';
import COLORS from '../constants/colors';
import {React, useEffect, useState, useContext} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuthContext} from '../hooks/AuthContext';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import RNFS from 'react-native-fs';

const VerificationScreen = ({navigation, route}) => {
  const {userData} = useAuthContext(); // Access onGoogleButtonPress function
  const [token, setToken] = useState('');
  const [selectedImageUriFront, setSelectedImageUriFront] = useState(null);
  const [selectedImageUriBack, setSelectedImageUriBack] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [course, setCourse] = useState('');

  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        setToken(token);
      } catch (error) {
        console.error('Error retrieving token:', error);
      }
    };
    getToken(); // Call getToken when component mounts
  }, []);

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      await auth().signOut();
      let url = 'http://10.0.2.2:8000/api/google-callback/auth/google-signout';
      let response = await axios.post(url, token, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error revoking token:', error);
    }
  };

  useEffect(() => {
    return () => {
      // Clean up or reset uri on component unmount or other events
      setSelectedImageUriFront(null);
      setSelectedImageUriBack(null);
    };
  }, []); // Empty dependency array means it runs only on mount and unmount

  const frontID = async () => {
    try {
      const result = await launchImageLibrary();
      if (result.didCancel) {
        return;
      }
      if (result.error) {
        console.error('ImagePicker Error: ', result.error);
        return;
      }
      const fileSizeLimitMB = 2;
      const fileSizeInMB = result.assets[0].fileSize / (1024 * 1024); // Convert to MB
      const fileFormatType = result.assets[0].type; // Get file format type
      const fileFormat = ['image/jpeg', 'image/jpg', 'image/png'];
      if (fileSizeInMB > fileSizeLimitMB) {
        alert('Cannot upload files larger than 2MB');
      }else if (!fileFormat.includes(fileFormatType)) {
        alert('Please upload an image in JPEG, JPG, or PNG format.');
      }else {
        const selectedImageUriFront = result.assets[0].uri;
        setSelectedImageUriFront(selectedImageUriFront);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const backID = async () => {

    try {
      const result = await launchImageLibrary();
      if (result.didCancel) {
        return;
      }
      if (result.error) {
        console.error('ImagePicker Error: ', result.error);
        return;
      }
      const fileSizeLimitMB = 2;
      const fileSizeInMB = result.assets[0].fileSize / (1024 * 1024); // Convert to MB
      const fileFormatType = result.assets[0].type; // Get file format type
      const fileFormat = ['image/jpeg', 'image/jpg', 'image/png'];
      if (fileSizeInMB > fileSizeLimitMB) {
        alert('Cannot upload files larger than 2MB');
      }else if (!fileFormat.includes(fileFormatType)) {
        alert('Please upload an image in JPEG, JPG, or PNG format.');
      }else {
        const selectedImageUriBack = result?.assets[0]?.uri;
        setSelectedImageUriBack(selectedImageUriBack);
      }
    } catch (error) {
      console.error('Error:', error);
    }
   
  };

  const studentValidation = async () => {
    if (
      !selectedImageUriFront ||
      !selectedImageUriBack ||
      !firstName ||
      !lastName ||
      !course
    ) {
      alert('Please fill all fields and select both front and back images');
      return;
    }
  
    const frontFileName = selectedImageUriFront.split('/').pop();
    const backFileName = selectedImageUriBack.split('/').pop();
    const frontExtension = frontFileName.split('.').pop();
    const backExtension = backFileName.split('.').pop();
    const formData = new FormData();
    formData.append('imageFront', {
      uri: selectedImageUriFront,
      name: `${frontFileName}`,
      type: `image/${frontExtension}`,
    });
    formData.append('imageBack', {
      uri: selectedImageUriBack,
      name: `${backFileName}`,
      type: `image/${backExtension}`,
    });
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('course', course);
    formData.append('user_id', 2);

    try {
      let url = 'http://10.0.2.2:8000/api/student-validation';
      const response = await axios.post(url, formData, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = response.data;
    if(data){
      console.log(data);
    }
    } catch (err) {
      console.log(err);
      alert('Something went wrong');
    } finally {
      // Reset state variables
      setSelectedImageUriFront(null);
      setSelectedImageUriBack(null);
      setFirstName('');
      setLastName('');
      setCourse('');
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <View style={{flex: 1, marginHorizontal: 22, justifyContent: 'center'}}>
        <View style={{marginVertical: 22}}>
          <Text
            style={{
              fontSize: 20,
              color: COLORS.black,
              fontWeight: 700,
            }}>
            Please fill up the following to proceed!
          </Text>
        </View>
        <View style={{marginBottom: 12}}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 400,
              marginVertical: 8,
            }}>
            First Name
          </Text>

          <View
            style={{
              width: '100%',
              height: 48,
              borderColor: COLORS.black,
              borderWidth: 1,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
              paddingLeft: 22,
            }}>
            <TextInput
              placeholder="Enter your first name"
              placeholderTextColor={COLORS.black}
              onChangeText={text => setFirstName(text)}
              value={firstName}
              autoCapitalize="words"
              style={{
                width: '100%',
              }}
            />
          </View>
        </View>

        <View style={{marginBottom: 12}}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 400,
              marginVertical: 8,
            }}>
            Last Name
          </Text>

          <View
            style={{
              width: '100%',
              height: 48,
              borderColor: COLORS.black,
              borderWidth: 1,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
              paddingLeft: 22,
            }}>
            <TextInput
              placeholder="Enter your last name"
              placeholderTextColor={COLORS.black}
              onChangeText={text => setLastName(text)}
              value={lastName}
              autoCapitalize="words"
              style={{
                width: '100%',
              }}
            />
          </View>
        </View>

        <View style={{marginBottom: 18}}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 400,
              marginVertical: 8,
            }}>
            Course
          </Text>

          <View
            style={{
              width: '100%',
              height: 48,
              borderColor: COLORS.black,
              borderWidth: 1,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
              paddingLeft: 22,
            }}>
            <TextInput
              placeholder="Enter your full course"
              placeholderTextColor={COLORS.black}
              onChangeText={text => setCourse(text)}
              value={course}
              autoCapitalize="words"
              style={{
                width: '100%',
              }}
            />
          </View>
        </View>

        <View style={styles.idContainer}>
          <View style={styles.eachIDContainer}>
            {selectedImageUriFront && (
              <Image
                source={{uri: selectedImageUriFront}}
                style={styles.image}
              />
            )}
          </View>
          <View style={styles.eachIDContainer}>
            {selectedImageUriBack && (
              <Image
                source={{uri: selectedImageUriBack}}
                style={styles.image}
              />
            )}
          </View>
        </View>
        <View style={styles.idContainerButton}>
          <Button
            title="Front ID"
            onPress={frontID}
            style={styles.button}
            filled
          />
          <Button
            title="Back ID"
            onPress={backID}
            style={styles.button}
            filled
          />
        </View>

        {/* <View style={{marginBottom: 12}}>
          <Button
            onPress={signOut}
            title="Sign Up"
            filled
            style={{
              marginTop: 18,
              marginBottom: 4,
            }}
          />
        </View> */}

        <View style={{marginBottom: 12}}>
          <Button
            onPress={studentValidation}
            title="Submit"
            filled
            style={{
              marginTop: 18,
              marginBottom: 4,
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default VerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  idContainerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 40, // Add horizontal margin to each containe
  },
  button: {
    margin: 6,
    borderRadius: 6,
    width: '30%',
  },
  text: {
    padding: 10,
    color: '#555555',
    textAlign: 'center',
    fontSize: 20,
  },

  idContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 175,
  },
  eachIDContainer: {
    flex: 0.5, // Set each container to 50% width
    alignItems: 'center', // Center image horizontally
    justifyContent: 'center', // Center image vertically
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 6,
    marginHorizontal: 15, // Add horizontal margin to each containe
  },

  image: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    resizeMode: 'stretch',
  },
});
