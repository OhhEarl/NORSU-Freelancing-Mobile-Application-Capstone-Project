import {View, Text, Image} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import COLORS from '../constants/colors';
import Button from '../components/Button';

const Welcome = ({navigation}) => {
  return (
    
    <LinearGradient
      style={{
        flex: 1,
      }}
      colors={[COLORS.secondary, COLORS.primary]}>
      <View style={{flex: 1}}>
        <View style={{justifyContent:'center'}}>
          <Image
            source={require('../assets/welcome.png')}
            style={{
              height: 400,
              width: 400,
              borderRadius: 20,
              position: 'absolute',
              top: 20,
              left: -10
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
              fontSize: 50,
              fontWeight: 800,
              color: COLORS.white,
            }}>
            Let's Get
          </Text>
          <Text
            style={{
              fontSize: 46,
              fontWeight: 800,
              color: COLORS.white,
            }}>
            Started
          </Text>

          <View style={{marginVertical: 0}}>
            <Text
              style={{
                fontSize: 16,
                color: COLORS.white,
                marginVertical: 4,
              }}>
              The Hustle Hub: Connect & Get Paid.
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: COLORS.white,
              }}>
              Find the perfect freelancer, every time.
            </Text>
          </View>

          <Button
            title="Login"
            onPress={() => navigation.navigate('Login')}
            style={{
              marginTop: 22,
              width: '100%',
            }}
          />

          <Button
            title="Sign up"
            onPress={() => navigation.navigate('Signup')}
            style={{
              marginTop: 5,
              width: '100%',
              backgroundColor: '#ffe4c4',
            }}
          />

        </View>
      </View>
    </LinearGradient>
  );
};

export default Welcome;
