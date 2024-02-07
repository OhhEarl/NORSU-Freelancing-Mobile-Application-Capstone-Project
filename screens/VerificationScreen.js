import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useEffect, React, useState} from 'react';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

const VerificationScreen = ({navigation}) => {
  const [initializing, setInitializing] = useState(true);
  const [email, setEmail] = useState();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  function onAuthStateChanged(user) {
    setUser(user);
    if (user) {
      setEmail(user.email);
      
    }
    if (initializing) setInitializing(false);
  }

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      await auth().signOut();
      setUser(null);
      navigation.navigate('Login');
    } catch (error) {
     
    }
  };
  if (initializing) return null;

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={styles.text}>Already logged In</Text>
      <Text style={styles.text}>Welcome {email}</Text>
      <Pressable onPress={signOut} style={styles.button}>
        <Text style={styles.text}>Log Out</Text>
      </Pressable>
    </View>
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
