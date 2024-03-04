import React from 'react';
import {View, Text, Image, ActivityIndicator} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import COLORS from '../constants/colors';
import Button from '../components/Buttons/Button';
import {useState, useEffect, useContext } from 'react';
import { AuthContext } from '../hooks/AuthContext';
import auth from '@react-native-firebase/auth';

const EmailVerification = ({navigation}) => {
  const [initializing, setInitializing] = useState(true);
  const [email, setEmail] = useState();
  const [verificationError, setVerificationError] = useState(null);
  const { user, isLoading, error } = useContext(AuthContext);

  const handleResendEmail = async () => {
    if (user) { // Check if user exists before calling the method
      try {
        await user.sendEmailVerification();
        console.log('Verification email sent.');
      } catch (error) {
        console.error('Error sending verification email:', error);
        setVerificationError('Failed to resend verification email. Please try again later.');

      }
    } else {
      console.error('User not available for sending verification email.');

    }
  };

  if(initializing) setInitializing(false);

  return (
    <LinearGradient
      style={{
        flex: 1,
        justifyContent: 'center',
      }}
      colors={[COLORS.secondary, COLORS.primary]}>
      {initializing ? (
        <ActivityIndicator size="large" color={COLORS.white} />
      ) : (
        <View style={{flex: 1}}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Image
              source={require('../assets/Email.png')}
              style={{height: 300, width: 300, marginTop: 30}}
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
              <Text style={{fontSize: 17, color: '#00ffff'}}>{email}</Text>
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
              style={{marginTop: 30, width: '100%'}}
            />
          </View>
        </View>
      )}
    </LinearGradient>
  );
};

export default EmailVerification;
