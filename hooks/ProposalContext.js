// import React, { createContext, useContext, useEffect, useState } from 'react';

// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { URL } from '@env';
// import { AuthProvider, useAuthContext } from '../hooks/AuthContext';
// import { Alert } from 'react-native';

// const ProposalContext = createContext({
//     proposalError: null,
//     loading: true,
//     proposals: [],
// });

// export const useProposalContext = () => {
//     return useContext(ProposalContext);
// };

// export const ProposalProvider = ({ children }) => {

//     const [proposalError, setProposalError] = useState(null);
//     const [proposalLoading, setProposalLoading] = useState(false);

//     const [proposals, setProposals] = useState([]);
//     const { token, user } = useAuthContext();

//     const fetchProposals = async () => {
//         if (token) {
//             try {
//                 setProposalLoading(true);
//                 const config = {
//                     headers: {
//                         "Content-Type": "application/json",
//                         Accept: "application/json",
//                         Authorization: `Bearer ${token}`,
//                     },
//                 };
//                 const response = await axios.get(`${URL}/project/proposal/show`, config);
//                 if (response.status === 200) {

//                     setProposals(response.data.data);
//                 }
//             } catch (error) {
//                 setProposalError(error.message)
//             } finally {
//                 setProposalLoading(false);

//             }

//         }
//     };
//     useEffect(() => {
//         fetchProposals();
//     }, [token]);
//     return (
//         <ProposalContext.Provider
//             value={{
//                 proposalError,
//                 proposalLoading,
//                 proposals,
//                 fetchProposals
//             }}
//         >
//             {children}
//         </ProposalContext.Provider>
//     );
// };
