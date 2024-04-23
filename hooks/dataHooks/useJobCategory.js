import { useState, useEffect } from 'react';
import axios from 'axios';
import { useGetIsStudent } from './useGetIsStudent'

const useJobCategory = () => {
    const [jobCategories, setJobCategories] = useState([]);
    const [categoryLoading, setLoading] = useState(true);
    const [error, loading, isStudent] = useGetIsStudent();




    useEffect(() => {
        // Check if loading is false before fetching
        if (!loading && isStudent?.token) {
            fetchJobCategories();
        }
    }, [loading, isStudent?.token]); // Add loading and isStudent?.token as dependencies
    const fetchJobCategories = async () => {
        try {
            const response = await axios.get('http://10.0.2.2:8000/api/jobCategories/fetch-all-categories', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${isStudent?.token}`,
                },
            });
            const data = await response.data;

            const transformedData = data.map(item => ({
                key: item.id.toString(),
                value: item.value,
            }));

            setJobCategories(transformedData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching job categories:', error);
            setLoading(false);
        }
    };

    return [jobCategories, categoryLoading];
};

export default useJobCategory;