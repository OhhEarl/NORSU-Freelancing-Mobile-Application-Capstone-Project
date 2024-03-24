import React from 'react';
import { View, TextInput, Button } from 'react-native';

const Step2Screen = ({ onPrev, onNext, values, setValues }) => {
    return (
        <View>
            <TextInput
                placeholder="Enter your email"
                value={values.email}
                onChangeText={text => setValues({ ...values, email: text })}
            />
            <Button title="Previous" onPress={onPrev} />
            <Button title="Next" onPress={onNext} />
        </View>
    );
};

export default Step2Screen;