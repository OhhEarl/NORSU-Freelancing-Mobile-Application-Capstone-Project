import React from "react";
import { StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";

const LoadingComponent = () => {
    return (
        <View style={styles.container}>
            <View style={styles.overlay}>
                <LottieView
                    source={require("../assets/loading.json")}
                    autoPlay
                    loop
                    style={styles.lottie}
                    speed={2.5}
                />
            </View>
        </View>
    );
};

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
        width: 120,
        height: 120,
    },
});

export default LoadingComponent;
