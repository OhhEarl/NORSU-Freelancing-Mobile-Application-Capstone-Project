import { useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Logout = () => {
    const { userData, setUserData, isLoading } = useAuthContext();
    const [token, setToken] = useState(null);
    console.log(userData)
    useEffect(() => {
        if (userData) {
            setToken(userData.token);
        }
    }, [userData]);


}

export default Logout