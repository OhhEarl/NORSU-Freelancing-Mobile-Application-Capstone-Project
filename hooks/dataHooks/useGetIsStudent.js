import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { URL } from '@env'

export const useGetIsStudent = () => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isStudent, setIsStudent] = useState(null);
  const [prevIsStudent, setPrevIsStudent] = useState(null);
  const [intervalId, setIntervalId] = useState(null);


  const getToken = async () => {
    try {
      const userInfo = await AsyncStorage.getItem('userInformation');
      const parsedUserInfo = JSON.parse(userInfo);
      const token = parsedUserInfo.token;
      setToken(token);
    } catch (error) {
      return;
    }
  };
  const fetchIsStudent = async () => {
    if (token) {
      setLoading(true);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(
          `${URL}/fetch-user-data`,
          config,
        );
        const data = response.data;
        if (data) {
          setIsStudent(data || [])
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  useEffect(() => {
    if (token) {
      fetchIsStudent();
      const id = setInterval(fetchIsStudent, 1800000); // Interval set to 3 minutes
      setIntervalId(id);
      return () => clearInterval(id); // Cleanup on unmount
    }
  }, [token]);

  useEffect(() => {
    if (isStudent && prevIsStudent && isStudent.is_student !== prevIsStudent.is_student) {
      clearInterval(intervalId);
    }
    setPrevIsStudent(isStudent);
  }, [isStudent, prevIsStudent, intervalId]);

  return [error, loading, isStudent, fetchIsStudent];
};

