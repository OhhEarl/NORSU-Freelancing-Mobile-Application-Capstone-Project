import { useState, useEffect } from 'react';
import axios from 'axios';
import { useGetIsStudent } from "./useGetIsStudent";

const useGetProjectList = () => {
    const [error, loading, isStudent] = useGetIsStudent();
    const [items, setItems] = useState([]);
    const [projectError, setProjectError] = useState('');
    const [listLoading, setListLoading] = useState(false);

    const fetchJobs = async () => {
        try {
            setListLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${isStudent?.token}`,
                },
            };
            const response = await axios.get(
                'http://10.0.2.2:8000/api/fetch-job-lists',
                config,
            );
            setItems(response.data.jobs); // Assuming the response data is the array of projects
        } catch (error) {
            setProjectError(error.toString());
        } finally {
            setListLoading(false);
        }
    };

    useEffect(() => {
        if (!loading && isStudent?.token) {
            fetchJobs();
        }
    }, [loading, isStudent?.token]); // Add loading and isStudent?.token as dependencies

    return { items, projectError, listLoading, isStudent, fetchJobs };
};

export default useGetProjectList;
