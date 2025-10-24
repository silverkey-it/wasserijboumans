import {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import type {ReactNode} from 'react';

type AuthContextType = {
    isAuthenticated: boolean;
    loading: boolean;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'wasserijboumans_token';

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem(STORAGE_KEY);
        if (storedToken) setToken(storedToken);
        setLoading(false);
    }, []);

    const login = useCallback((newToken: string) => {
        localStorage.setItem(STORAGE_KEY, newToken);
        setToken(newToken);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY);
        setToken(null);
    }, []);

    const value = useMemo(
        () => ({
            isAuthenticated: Boolean(token),
            loading,
            token,
            login,
            logout,
        }),
        [loading, login, logout, token],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
