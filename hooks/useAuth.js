import React, { useState, useEffect } from 'react';
import auth from 'firebase/auth';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      setIsLoading(false);
      if (user) {
        console.log("the user is: " + user.email);
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, isLoading, error };
};

export default useAuth;