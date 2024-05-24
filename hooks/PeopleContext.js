import React, { createContext, useContext, useEffect, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { URL } from '@env';
import { AuthProvider, useAuthContext } from '../hooks/AuthContext';
import { Alert } from 'react-native';

const PeopleContext = createContext({
    projectError: null,
    loading: true,
    peoples: [],
});

export const usePeopleContext = () => {
    return useContext(PeopleContext);
};

export const PeopleProvider = ({ children }) => {

    const [peopleError, setPeopleError] = useState(null);
    const [peopleLoading, setPeopleLoading] = useState(false);

    const [peoples, setPeoples] = useState([]);
    const { token, user } = useAuthContext();

    const fetchPeopleData = async () => {
        if (token || user) {
            try {
                setPeopleLoading(true);
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                };
                const response = await axios.get(`${URL}/fetch-people-lists`, config);

                if (response.status === 200) {

                    setPeoples(response.data.data);
                }
            } catch (error) {
                setPeopleError(error.message)
            } finally {
                setPeopleLoading(false);

            }

        }
    };
    useEffect(() => {
        fetchPeopleData();
    }, [token, user]);
    return (
        <PeopleContext.Provider
            value={{
                peopleError,
                peopleLoading,
                peoples,
                fetchPeopleData
            }}
        >
            {children}
        </PeopleContext.Provider>
    );
};
