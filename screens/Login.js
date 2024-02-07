import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {useState, useEffect, React} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import COLORS from '../constants/colors';
import Button from '../components/Button';

import {useIsFocused} from '@react-navigation/native';

import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId:
    '1070570385371-oki1o1e7h9mph2qnk0evo7l22k80683c.apps.googleusercontent.com',
});

const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const isFocused = useIsFocused();
  useEffect(() => {
    if (!isFocused) {
      // Clear text fields when screen is blurred
      setEmail('');
      setPassword('');
      setErrorMessage('');
    }
  }, [isFocused]);

  async function onGoogleButtonPress() {
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      const {idToken} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      return auth().signInWithCredential(googleCredential);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        await GoogleSignin.revokeAccess();
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        console.log(statusCodes.PLAY_SERVICES_NOT_AVAILABLE);
      } else if (emailVerified === 'false') {
        // play services not available or outdated
        console.log(statusCodes.PLAY_SERVICES_NOT_AVAILABLE);
      } else {
        navigation.navigate('Login');
      }
    }
  }

    const handleSignIn = async () => {
      auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (!user.emailVerified) {
          navigation.navigate('EmailVerification');
        }
      })
      .catch((error) => {
        if (error.code === 'auth/invalid-email') {
          setErrorMessage('Invalid email address.');
        } else if (error.code === 'auth/user-disabled') {
          setErrorMessage('The user account has been disabled.');
        } else if (error.code === 'auth/invalid-credential') {
          setErrorMessage('Invalid email address or password.');
        } else {
          setErrorMessage(error.message || error.toString()); // Update this line to display the error message
        }
      });
    };
  

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <View style={{flex: 1, marginHorizontal: 22, justifyContent: 'center'}}>
        <View style={{marginVertical: 22}}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: 'bold',
              marginVertical: 12,
              color: COLORS.black,
            }}>
            Hi Welcome Back ! 👋
          </Text>

          <Text
            style={{
              fontSize: 16,
              color: COLORS.black,
            }}>
            Hello again you have been missed!
          </Text>
        </View>

        <View style={{marginBottom: 12}}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 400,
              marginVertical: 8,
            }}>
            Email address
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
              keyboardType="email-address"
              onChangeText={text => setEmail(text)}
              value={email}
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
            Password
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
              placeholder="Enter your password"
              placeholderTextColor={COLORS.black}
              onChangeText={text => setPassword(text)}
              value={password}
              style={{
                width: '100%',
              }}
            />

            {/* <TouchableOpacity
                    onPress={() => setIsPasswordShown(!isPasswordShown)}
                    style={{
                        position: "absolute",
                        right: 12
                    }}
                >
                    {
                        isPasswordShown == true ? (
                            <Ionicons name="eye-off" size={24} color={COLORS.black} />
                        ) : (
                            <Ionicons name="eye" size={24} color={COLORS.black} />
                        )
                    }

                </TouchableOpacity> */}
          </View>

          <Text
            style={{
              fontSize: 14,
              fontWeight: 400,
              marginVertical: 8,
              color:'red',
              marginLeft: 3
            }}>
          {errorMessage}
          </Text>

        </View>

        {/* <View style={{
            flexDirection: 'row',
            marginVertical: 6
        }}>
            <Checkbox
                style={{ marginRight: 8 }}
                value={isChecked}
                onValueChange={setIsChecked}
                color={isChecked ? COLORS.primary : undefined}
            />

            <Text>Remenber Me</Text>
        </View> */}

        <Button
          onPress={handleSignIn}
          title="Login"
          filled
          style={{
            marginTop: 18,
            marginBottom: 4,
          }}
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 20,
          }}>
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: COLORS.grey,
              marginHorizontal: 10,
            }}
          />
          <Text style={{fontSize: 14}}>Or Login with</Text>
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: COLORS.grey,
              marginHorizontal: 10,
            }}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            onPress={() =>
              onGoogleButtonPress()
                .then(() => {
                  navigation.navigate('VerificationScreen');
                })
                .catch(error => {
                  console.log(error);
                })
            }
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              height: 60,
              borderWidth: 2,
              borderColor: COLORS.grey,
              marginRight: 4,
              borderRadius: 10,
            }}>
            <Image
              source={require('../assets/google.png')}
              style={{
                height: 36,
                width: 36,
                marginRight: 8,
              }}
              resizeMode="contain"
            />

            <Text style={{fontSize: 18, fontWeight: '500', color: '#696969'}}>
              Login with Google
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginVertical: 22,
          }}>
          <Text style={{fontSize: 16, color: COLORS.black}}>
            Don't have an account?
          </Text>
          <Pressable onPress={() => navigation.navigate('Signup')}>
            <Text
              style={{
                fontSize: 16,
                color: COLORS.primary,
                fontWeight: 'bold',
                marginLeft: 6,
                textDecorationLine: 'underline',
              }}>
              Register
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
