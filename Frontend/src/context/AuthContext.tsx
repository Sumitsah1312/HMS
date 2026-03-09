import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Expected User Structure based on API requirements:
 * {
 *   "username": "hr@yopmail.com",
 *   "email": "hr@yopmail.com",
 *   "phoneNumber": "8787215109",
 *   "name": "HR here",
 *   "roles": "hr,employee",
 *   "rolelist": ["hr", "employee"],
 *   "ispasswordchanged": false,
 *   "isTenantSubscribed": false,
 *   "access_token": "<JWT_TOKEN>",
 *   "token_type": "Bearer",
 *   "expires_in": 2592000
 * }
 */

interface User {
    username: string;
    email: string;
    name: string;
    rolelist: string[];
    ispasswordchanged: boolean;
    isTenantSubscribed: boolean;
    access_token: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (userData: User) => void;
    logout: () => void;
    checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = () => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('access_token');

        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    };

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('access_token', userData.access_token);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
