import React from 'react';
import { View, Text, Button } from 'react-native';

const Step3Screen = ({ onPrev, values }) => {
    return (
        <View>
            <Text>Name: {values.name}</Text>
            <Text>Email: {values.email}</Text>
            <Button title="Previous" onPress={onPrev} />
            {/* You can add a submit button here to perform any final actions */}
        </View>
    );
};

export default Step3Screen;