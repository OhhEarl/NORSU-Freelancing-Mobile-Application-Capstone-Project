import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
const OpeningScreen = () => {
    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/images/norsu-logo.png')}
                style={styles.image}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 200, // set your desired width
        height: 200, // set your desired height
        resizeMode: 'contain', // or 'cover' depending on your requirement
    },
});


export default OpeningScreen