import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import COLORS from '../constants/colors';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useGetIsStudent} from '../hooks/dataHooks/useGetIsStudent';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const ProfileScreen = ({navigation}) => {
  const [error, loading, isStudent] = useGetIsStudent();

  return (
    <ImageBackground
      source={require('../assets/ProfileBackground.jpg')}
      style={styles.backgroundImage}>
      <ScrollView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.mainContainer}>
            <View style={styles.container}>
              <View style={styles.logoutContainer}>
                <Feather
                  name="arrow-left"
                  size={24}
                  color= {COLORS.black}
                  onPress={() => {
                    navigation.goBack();
                  }}
                />

                <TouchableOpacity>
                  <View style={styles.log}>
                    <Entypo
                      name="log-out"
                      size={20}
                      color="white"
                      style={{alignSelf: 'center', marginLeft: 5}}
                    />
                    <Text style={styles.logout}>LOGOUT</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.innerContainer}>
                <Image
                  style={styles.image}
                  source={{
                    uri: `https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?w=740&t=st=1670148608~exp=1670149208~hmac=bc57b66d67d2b9f4929c8e592ff17e8c8660721608add2f18fc20d19c1aab7e4`,
                  }}
                />
                <Text style={styles.userText}>{isStudent?.first_name}</Text>
                <Text style={{marginBottom: 48}}>{isStudent?.course}</Text>
              </View>
              <TouchableOpacity activeOpacity={0.5}>
                <View style={styles.seperateContainer}>
                  <Text style={styles.seperateText}>
                    Total Proposals Submitted
                  </Text>
                  <AntDesign
                    name="arrowright"
                    size={20}
                    style={{
                      alignSelf: 'center',
                      right: 10,
                      position: 'absolute',
                    }}
                    color="black"
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.5}>
                <View style={styles.seperateContainer}>
                  <Text style={styles.seperateText}>Accepted Proposals</Text>
                  <AntDesign
                    name="arrowright"
                    size={20}
                    style={{
                      alignSelf: 'center',
                      right: 10,
                      position: 'absolute',
                    }}
                    color="black"
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.5}>
                <View style={styles.seperateContainer}>
                  <Text style={styles.seperateText}>Completed Projects</Text>

                  <AntDesign
                    name="arrowright"
                    size={20}
                    style={{
                      alignSelf: 'center',
                      right: 10,
                      position: 'absolute',
             
                    }}
                    color="black"
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.5} onPress={()=>{navigation.navigate("EditProfileScreen")}}>
                <View style={styles.seperateContainer}>
                  <Text style={styles.seperateText}>Edit Profile</Text>
                  <AntDesign
                    name="arrowright"
                    size={20}
                    style={{
                      alignSelf: 'center',
                      right: 10,
                      position: 'absolute',
                    }}
                    color="black"
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </ImageBackground>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container:{
    paddingHorizontal: 18
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch' or 'contain'
    justifyContent: 'center',
  },
  image: {
    height: 140,
    width: 140,
    borderRadius: 70,

    borderWidth: 1,
    marginBottom: 10,
  },
  innerContainer: {
    marginHorizontal: 30,
    alignItems: 'center',
  },
  userText: {
    marginHorizontal: 50,
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoutContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 32,
    alignItems: 'center',
   
  },
  log: {
    flexDirection: 'row',
    alignSelf: 'center', // Center the button horizontally
    borderRadius: 50,
    borderColor: '#D6E6FF',
    padding: 6,
    backgroundColor: COLORS.primary,
  },
  logout: {
    margin: 5,
    color: COLORS.white,
    fontWeight: '600',
  },
  seperateContainer: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 3,
    paddingStart: 15,
    borderRadius: 10,
    elevation: 3,
    marginTop: 15,
    alignItems: 'center',
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },

  seperateText: {
    margin: 18,
    fontSize: 16,
    fontWeight: '600',
  },
});
