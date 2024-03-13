import React from 'react'
import { View, Text } from 'react-native'
import COLORS from '../constants/colors';
import LinearGradient from 'react-native-linear-gradient';
const ProfileScreen = () => {
  return (
    
    <LinearGradient
      style={{
        flex: 1,
      }}
      colors={[COLORS.secondary, COLORS.primary]}>
      <View style={{flex: 1}}>
   

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


        

        </View>
      </View>
    </LinearGradient>
  );
}

export default ProfileScreen