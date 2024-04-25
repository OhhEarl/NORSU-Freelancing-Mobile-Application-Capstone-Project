import React, { createContext, useContext, useEffect, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { URL } from '@env';

const ProjectContext = createContext({
    projectError: null,
    loading: true,
    projects: [],
});

export const useProjectContext = () => {
    return useContext(ProjectContext);
};

export const ProjectProvider = ({ children, navigation }) => {
    const [token, setToken] = useState(null);
    const [projectError, setProjectError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState([]);

    const [tokenRetrieved, setTokenRetrieved] = useState(false);

    const getToken = async () => {
        if (!tokenRetrieved) { // Check if token has already been retrieved
            setLoading(true);
            try {
                const userInfo = await AsyncStorage.getItem('userInformation');
                const parsedUserInfo = JSON.parse(userInfo);
                const token = parsedUserInfo?.token;
                if (token) {
                    await setToken(token);
                    setTokenRetrieved(true);
                }
            } catch (error) {
                setProjectError(error);
            } finally {
                setLoading(false);
            }
        }
    };
    const fetchData = async () => {
        await getToken();
        if (token) {
            try {
                setLoading(true);
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                const response = await axios.get(`${URL}/api/fetch-job-lists`, config);
                if (response) {
                    setProjects(response.data.jobs);
                }
            } catch (error) {
                setProjectError(error.message);
            } finally {
                setLoading(false);
            }
        }
    };
    useEffect(() => {

        fetchData();

    }, [token]);



    return (
        <ProjectContext.Provider
            value={{
                projectError,
                loading,
                projects,
                fetchData
            }}
        >
            {children}
        </ProjectContext.Provider>
    );
};
