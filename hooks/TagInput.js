import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as theme from "../assets/constants/theme";
import Feather from "react-native-vector-icons/Feather";
const TagInput = ({ initialTags, onChangeTags }) => {
    const [inputValue, setInputValue] = useState('');
    const [tags, setTags] = useState(initialTags || []);

    const handleInputChange = (text) => {
        setInputValue(text);
    };

    const handleAddTag = () => {
        if (inputValue.trim() !== '' && !tags.includes(inputValue.trim())) {
            const newTags = [...tags, inputValue.trim()];
            setTags(newTags);
            onChangeTags(newTags);
            setInputValue('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        const newTags = tags.filter((tag) => tag !== tagToRemove);
        setTags(newTags);
        onChangeTags(newTags);
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    value={inputValue}
                    onChangeText={handleInputChange}
                    placeholder="Add a tag"
                    style={styles.input}
                    onSubmitEditing={handleAddTag}
                />
                <TouchableOpacity onPress={handleAddTag} style={styles.addButton}>
                    <Feather style={styles.addButtonText}
                        name={"plus-circle"}
                        size={25}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.tagsContainer}>
                {tags.map((tag, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => handleRemoveTag(tag)}
                        style={styles.tag}
                    >
                        <Text style={styles.tagText}>{tag}</Text>
                    </TouchableOpacity>
                ))}
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10
    },
    tag: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 10,
        margin: 5,
    },
    tagText: {
        fontSize: theme.sizes.h2,
        color: theme.colors.WHITE,
        fontFamily: 'Roboto-Light'
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    input: {
        flex: 1,
        backgroundColor: 'white',
        borderColor: theme.colors.primary,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
        paddingStart: 18
    },
    addButton: {
        marginLeft: 10,
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default TagInput;
