// Step1.js
import React from 'react';
import { View, TextInput, Button } from 'react-native';

const Step1Screen = ({ onNext, values, setValues }) => {
    return (
        <View>
            <TextInput
                placeholder="Enter your name"
                value={values.name}
                onChangeText={text => setValues({ ...values, name: text })}
            />
            <Button title="Next" onPress={onNext} />
        </View>
    );
};

export default Step1Screen;