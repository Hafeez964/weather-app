import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
  searchHistory: SearchHistoryItem[];
  preferences: {
    temperatureUnit: 'metric' | 'imperial';
    defaultLocation?: {
      city: string;
      country: string;
    };
  };
  token: string;
}

interface SearchHistoryItem {
  city: string;
  country: string;
  timestamp: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  addToSearchHistory: (city: string, country: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem('weatherAppUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data } = await axios.post('/api/users/login', { email, password });
      
      setUser(data);
      localStorage.setItem('weatherAppUser', JSON.stringify(data));
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data } = await axios.post('/api/users', { name, email, password });
      
      setUser(data);
      localStorage.setItem('weatherAppUser', JSON.stringify(data));
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('weatherAppUser');
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      setLoading(true);
      setError(null);
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
      };
      
      const { data } = await axios.put('/api/users/profile', userData, config);
      
      setUser(prevUser => {
        if (!prevUser) return data;
        return { ...prevUser, ...data };
      });
      localStorage.setItem('weatherAppUser', JSON.stringify({ ...user, ...data }));
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred while updating profile');
    } finally {
      setLoading(false);
    }
  };

  const addToSearchHistory = async (city: string, country: string) => {
    if (!user) return;
    
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      
      const { data } = await axios.post(
        '/api/users/history', 
        { city, country }, 
        config
      );
      
      setUser(prevUser => {
        if (!prevUser) return null;
        return { ...prevUser, searchHistory: data };
      });
      
      // Update localStorage
      if (user) {
        localStorage.setItem(
          'weatherAppUser', 
          JSON.stringify({ ...user, searchHistory: data })
        );
      }
    } catch (error) {
      console.error('Error adding to search history:', error);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    addToSearchHistory,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;