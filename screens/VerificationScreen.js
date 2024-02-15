import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Button from '../components/Button';
import COLORS from '../constants/colors';
import {useEffect, React, useState, useContext} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import { AuthContext } from '../hooks/AuthContext';


const VerificationScreen = ({navigation}) => {
  const { user, isLoading, error } = useContext(AuthContext);
  const [email, setEmail] = useState();



  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      await auth().signOut();
      setUser(null);
      navigation.navigate('Login');
    } catch (error) {}
  };


  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <View style={{flex: 1, marginHorizontal: 22, justifyContent: 'center'}}>
        <View style={{marginVertical: 22, alignItems: 'center'}}>
          <Text
            style={{
              fontSize:20,
              fontWeight: 'bold',
              marginVertical: 12,
              color: COLORS.black,
            }}>
            Pleas fill up the form to continue.
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
              placeholder="Enter your email address"
              placeholderTextColor={COLORS.black}
              // onChangeText={text => setEmail(text)}
              // value={email}
              keyboardType="email-address"
              autoCapitalize="none"
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
              placeholder="Enter your email address"
              placeholderTextColor={COLORS.black}
              // onChangeText={text => setEmail(text)}
              // value={email}
              keyboardType="email-address"
              autoCapitalize="none"
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
              placeholder="Enter your email address"
              placeholderTextColor={COLORS.black}
              // onChangeText={text => setEmail(text)}
              // value={email}
              keyboardType="email-address"
              autoCapitalize="none"
              style={{
                width: '100%',
              }}
            />
          </View>
        </View>

  
        <Button
        onPress={signOut}
          title="Sign Up"
          filled
          style={{
            marginTop: 18,
            marginBottom: 4,
          }}
        />

     
      </View>
    </SafeAreaView>
  );
};

export default VerificationScreen;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 16,
    margin: 6,
    borderRadius: 6,
    elevation: 3,
    backgroundColor: '#33B6FF',
    width: '50%',
  },
  text: {
    padding: 10,
    color: '#555555',
    textAlign: 'center',
    fontSize: 20,
  },
});
