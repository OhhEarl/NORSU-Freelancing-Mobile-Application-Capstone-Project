import React from "react";
import { StyleSheet, View, Image } from "react-native";
import LottieView from "lottie-react-native";

const NoConnection = () => {
    return (
        <View style={styles.container}>
            <View style={styles.overlay}>
                <LottieView
                    source={require("../assets/NoConnection.json")}
                    autoPlay
                    loop
                    style={styles.lottie}
                    speed={1.5}
                />
            </View>
        </View>
    )
}

export default NoConnection
const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject, // Make the overlay cover the entire screen
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'white',
    },
    lottie: {
        width: 300,
        height: 300,
    },
});