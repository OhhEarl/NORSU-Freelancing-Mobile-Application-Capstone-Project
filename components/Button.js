import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import * as theme from "../assets/constants/theme";

const Button = (props) => {
    const filledBgColor = props.color || theme.colors.primary;
    const outlinedColor = theme.colors.WHITE;
    const bgColor = props.filled ? filledBgColor : outlinedColor;
    const textColor = props.filled ? theme.colors.WHITE : theme.colors.primary;

    return (
        <TouchableOpacity
            style={{
                ...styles.button,
                ...{ backgroundColor: bgColor },
                ...props.style
            }}
            onPress={props.onPress}
        >
            <Text style={{ fontSize: 18, ... { color: textColor, fontWeight: 'bold' } }}>{props.title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        paddingBottom: 16,
        paddingVertical: 10,
        borderColor: theme.colors.primary,
        borderWidth: 2,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center'
    }
})
export default Button