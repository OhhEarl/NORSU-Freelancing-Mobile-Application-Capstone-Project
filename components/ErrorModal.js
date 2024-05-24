import React, { useState } from 'react';
import { Feather, Modal, SafeAreaView, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Button from './Button';
import Foundation from "react-native-vector-icons/Foundation";
const ErrorModal = ({ errorMessage, onClose }) => {
    return (
        <Modal visible={!!errorMessage} transparent={true} animationType="none">
            <SafeAreaView style={styles.modalContainer}>
                <View style={styles.errorContainer}>
                    <Foundation
                        name={'alert'}
                        color={'red'}
                        size={50}

                    />
                    <Text style={styles.ohSnap}>Oh snap!</Text>
                    <Text style={styles.modalText}>{errorMessage}</Text>
                    <TouchableOpacity onPress={onClose} style={styles.dismiss} >
                        <Text style={styles.dismissText}>DISMISS</Text>
                    </TouchableOpacity>
                </View>

            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    errorContainer: {
        paddingTop: 15,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
        maxHeight: 300,
        backgroundColor: 'white'
    },

    ohSnap: {
        fontFamily: 'Roboto-Medium',
        fontSize: 24,
        color: 'black'
    },
    modalText: {
        fontFamily: 'Roboto-Light',
        fontSize: 18,
        textAlign: 'center',
        paddingHorizontal: 10,
        color: '#393939',
        marginBottom: 20,
        marginTop: 8

    },
    dismiss: {
        width: "100%",
        backgroundColor: 'red',
        position: 'relative',
        bottom: -1
    },
    dismissText: {
        fontFamily: 'Roboto-Medium',
        color: 'white',
        padding: 12,
        alignSelf: 'center',

    }
});

export default ErrorModal;