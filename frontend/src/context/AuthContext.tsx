import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import type { WrappedResponse } from '../services/courseService';

export interface UserProfile {
  id: number;
  email: string;
  is_active: boolean;
  is_admin: boolean;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string, isAdmin: boolean) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const decodeToken = (token: string) => {
  try {
    const payloadB64 = token.split('.')[0];
    const jsonPayload = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUserProfile = async (authToken: string, userId: number) => {
    try {
      // Temporarily store token in localStorage so interceptor can use it
      localStorage.setItem('auth_token', authToken);
      const res = await api.get<WrappedResponse<UserProfile>>(`/users/${userId}`);
      if (res && res.response) {
        setUser(res.response);
        setToken(authToken);
      } else {
        logout();
      }
    } catch (e) {
      logout();
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken) {
        const decoded = decodeToken(storedToken);
        if (decoded && decoded.sub && decoded.exp * 1000 > Date.now()) {
          await fetchUserProfile(storedToken, decoded.sub);
        } else {
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post<WrappedResponse<{ access_token: string; token_type: string }>>('/auth/login', {
      email,
      password,
    });
    if (res && res.response && res.response.access_token) {
      const authToken = res.response.access_token;
      const decoded = decodeToken(authToken);
      if (decoded && decoded.sub) {
        await fetchUserProfile(authToken, decoded.sub);
      }
    } else {
      throw new Error('Invalid login response');
    }
  };

  const signup = async (email: string, password: string, fullName: string, isAdmin: boolean) => {
    await api.post<WrappedResponse<UserProfile>>('/users/', {
      email,
      password,
      full_name: fullName,
      is_admin: isAdmin,
      is_active: true,
    });
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
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
