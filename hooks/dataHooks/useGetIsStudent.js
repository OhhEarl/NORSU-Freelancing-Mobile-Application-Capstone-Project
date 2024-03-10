import React, {useState, useEffect} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useGetIsStudent = () => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isStudent, setIsStudent] = useState(null);
  const [prevIsStudent, setPrevIsStudent] = useState(null);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    console.log('Component mounted'); // Log when component mounts
    const getToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        setToken(token);
      } catch (error) {
        console.error('Error retrieving token:', error);
      }
    };
    getToken();

  }, []);

  useEffect(() => {
    if (token) {
      fetchIsStudent();
      const id = setInterval(fetchIsStudent, 180000); // Interval set to 3 minutes
      setIntervalId(id);
      return () => clearInterval(id); // Cleanup on unmount
    }
  }, [token]);

  useEffect(() => {
    if (
      isStudent &&
      prevIsStudent &&
      isStudent.is_student !== prevIsStudent.is_student
    ) {
      clearInterval(intervalId);
    }
    setPrevIsStudent(isStudent);
  }, [isStudent, prevIsStudent, intervalId]);

  const fetchIsStudent = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(
        'http://10.0.2.2:8000/api/fetch-user-data',
        config,
      );
      const data = response.data;
      if (data) {
        setIsStudent(data);
        setLoading(false);
      }else{
        setIsStudent(null)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      setError(error);
    }
  };

  return [error, loading, isStudent];
};
