import React, { createContext, useContext, useEffect, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { URL } from '@env';
import { AuthProvider, useAuthContext } from '../hooks/AuthContext';
import { Alert } from 'react-native';

const ProjectContext = createContext({
    projectError: null,
    loading: true,
    projects: [],
});

export const useProjectContext = () => {
    return useContext(ProjectContext);
};

export const ProjectProvider = ({ children }) => {

    const [projectError, setProjectError] = useState(null);
    const [loading, setLoading] = useState(false);

    const [projects, setProjects] = useState([]);
    const { token, user } = useAuthContext();


    const fetchData = async () => {
        if (token) {
            try {
                setLoading(true);
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                };
                const response = await axios.get(`${URL}/fetch-job-lists`, config);
                if (response.status === 200) {
                    setProjects(response.data.jobs);
                }
            } catch (error) {
                setProjectError(error.message)
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
