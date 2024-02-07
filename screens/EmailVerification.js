import {View, Text, Pressable, Image} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import COLORS from '../constants/colors';
import Button from '../components/Button';
import {useState, useEffect} from 'react';

import auth from '@react-native-firebase/auth';
import {BackHandler} from 'react-native';

const EmailVerification = ({navigation}) => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [email, setEmail] = useState();
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        // Navigate back only if the user is not logged in
        if (!user) {
          navigation.navigate('Login');
          return true; // Return true to indicate that we've handled the back button press
        }
        navigation.push('EmailVerification');
      },
    );

    const unsubscribe = auth().onAuthStateChanged(onAuthStateChanged);
    return () => {
      unsubscribe();
      backHandler.remove(); // Remove the event listener when the component unmounts
    };
  }, [navigation, user]);
  function onAuthStateChanged(user) {
    setUser(user);
    if (user) {
      setEmail(user.email);
    }
    if (initializing) setInitializing(false);
  }

  const handleResendEmail = async () => {
    try {
      await user.sendEmailVerification();
      console.log('Verification email sent.');
    } catch (error) {
      console.error('Error sending verification email:', error);
    }
  };

  return (
    <LinearGradient
      style={{
        flex: 1,
        justifyContent: 'center', // Center content vertically
      }}
      colors={[COLORS.secondary, COLORS.primary]}>
      <View style={{flex: 1}}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Image
            source={require('../assets/Email.png')}
            style={{
              height: 300,
              width: 300,
              marginTop: 30
            }}
          />
        </View>

        <View
          style={{
            paddingHorizontal: 25,
            position: 'absolute',
            top: 370,
            width: '100%',
          }}>
          <Text
            style={{
              fontSize: 25,
              fontWeight: 700,
              color: COLORS.white,
              justifyContent: 'center',
              textAlign: 'center',
            }}>
            Confirm your email address
          </Text>

          <View
            style={{
              marginVertical: 0,
              alignItems: 'center',
              marginHorizontal: 10,
              marginTop: 20,
            }}>
            <Text
              style={{
                fontSize: 17,
                color: COLORS.white,
                marginVertical: 4,
                textAlign: 'center',
              }}>
              We sent a confirmation email to:
            </Text>
            <Text
              style={{
                fontSize: 17,
                color: '#00ffff',
              }}>
              {email}
            </Text>
          </View>

          <View
            style={{
              marginVertical: 20,
              alignItems: 'center',
              marginHorizontal: 10,
            }}>
            <Text
              style={{
                fontSize: 17,
                color: COLORS.white,
                marginVertical: 4,
                textAlign: 'center',
              }}>
              Check your email and click on the confirmation link to continue.
            </Text>
          </View>

          <Button
            title="Resend Email"
            onPress={handleResendEmail}
            style={{
              marginTop: 30,
              width: '100%',
            }}
          />
        </View>
      </View>
    </LinearGradient>
  );
};

export default EmailVerification;
