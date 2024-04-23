import React from "react";
import { StyleSheet, View, Image } from "react-native";
import LottieView from "lottie-react-native";

const NoConnection = () => {
    return (
        <View style={styles.container}>
            <View style={styles.overlay}>
                <Image
                    source={require("../assets/noConnection.jpg")}
                    style={{
                        height: 300,
                        width: "100%",
                        objectFit: 'contain',
                        justifyContent: 'center',
                        alignContent: 'center'
                    }}
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

});
