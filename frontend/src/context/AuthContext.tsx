import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  mobile: string;
  state: string;
  district: string;
  taluka: string;
  village: string;
  role: 'farmer' | 'admin';
}

interface AuthContextType {
  token: string | null;
  profile: Profile | null;
  loading: boolean;
  login: (credentials: { mobile?: string; email?: string }, otp: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [profile, setProfile] = useState<Profile | null>(
    localStorage.getItem('profile') ? JSON.parse(localStorage.getItem('profile')!) : null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = async (credentials: { mobile?: string; email?: string }, otp: string) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/verify-otp', { ...credentials, otp });
      const { token: receivedToken, profile: receivedProfile } = response.data;
      
      localStorage.setItem('token', receivedToken);
      localStorage.setItem('profile', JSON.stringify(receivedProfile));
      
      setToken(receivedToken);
      setProfile(receivedProfile);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: any) => {
    setLoading(true);
    try {
      await axios.post('/api/auth/register', {
        fullName: data.fullName,
        mobile: data.mobile,
        state: data.state,
        district: data.district,
        taluka: data.taluka,
        village: data.village,
        role: data.role || 'farmer'
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('profile');
    setToken(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ token, profile, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
