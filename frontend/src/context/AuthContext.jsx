import { createContext, useEffect, useState, useContext } from "react";
import { login as loginService, logout as logoutService, getCurrentUser} from '../services/authService';

const AuthContext = createContext();

export function AuthProvider ({children}) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const loginCheck = async () => {
        const token = localStorage.getItem('token');
        if (!token){
            setLoading(false);
            return;
        }
        try {
            const userData = await getCurrentUser();
            setUser(userData);
            return {success: true};
        } catch (error) {return {error: 'خطای ناشناخته'};
        } finally {setLoading(false);}
    }

    useEffect(() => {loginCheck();}, []);

    const login = async (username, password) => {
        try {
            const loginResponse = await loginService(username, password);
            if (!loginResponse.token)
                return loginResponse;
            

            const userData = await getCurrentUser();
            setUser(userData);
            return {success: true};
        } catch (error) {
            return {error: 'مشکلی در ورود پیش آمده  است'};
        }
    }

    const logout = async () => {
        const result = await logoutService();
        setUser(null);
        return {success: true};
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}


export function useAuth() {
  return useContext(AuthContext);
}

