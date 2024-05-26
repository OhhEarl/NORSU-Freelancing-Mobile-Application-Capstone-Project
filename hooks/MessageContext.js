import React, { createContext, useContext, useEffect, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { URL } from '@env';
import { AuthProvider, useAuthContext } from '../hooks/AuthContext';
import { Alert } from 'react-native';
import LoadingComponent from '../components/LoadingComponent';

const MessageContext = createContext({
    messageError: null,
    loading: true,
    message: [],
});

export const useMessageContext = () => {
    return useContext(MessageContext);
};

export const MessageProvider = ({ children }) => {

    const [messageError, setMessageError] = useState(null);
    const [messageLoading, setMessageLoading] = useState(false);

    const [message, setMessage] = useState([]);
    const { token, isLoading, isStudent, user, } = useAuthContext();

    const fetchMessageData = async () => {

        if (token || user) {

            const id = isStudent?.studentInfo.id
            try {
                setMessageLoading(true);
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                };
                const response = await axios.get(`${URL}/fetch-message-lists/${id}`, config);


                if (response.status === 200) {
                    setMessage(response.data.data);
                }
            } catch (error) {
                setMessageError(error.message)
            } finally {
                setMessageLoading(false);
            }

        }
    };
    useEffect(() => {
        fetchMessageData();
    }, [token, isStudent]);
    return (
        <MessageContext.Provider
            value={{
                messageError,
                messageLoading,
                message,
                fetchMessageData
            }}
        >
            {children}
        </MessageContext.Provider>
    );
};
