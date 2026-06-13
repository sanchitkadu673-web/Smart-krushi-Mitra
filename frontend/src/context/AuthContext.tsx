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
  role: 'farmer' | 'admin' | 'super_admin' | 'shop_owner' | 'expert';
  shop_name?: string;
  license_number?: string;
  shop_address?: string;
}

interface AuthContextType {
  token: string | null;
  profile: Profile | null;
  loading: boolean;
  login: (credentials: { mobile?: string; email?: string }, otp: string) => Promise<Profile>;
  loginPassword: (mobile: string, password: string) => Promise<Profile>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateProfileState: (updatedProfile: Profile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [profile, setProfile] = useState<Profile | null>(() => {
    try {
      const saved = localStorage.getItem('profile');
      return saved && saved !== 'undefined' ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = async (credentials: { mobile?: string; email?: string }, otp: string): Promise<Profile> => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/verify-otp', { ...credentials, otp });
      const { token: receivedToken, profile: receivedProfile } = response.data;
      
      localStorage.setItem('token', receivedToken);
      localStorage.setItem('profile', JSON.stringify(receivedProfile));
      
      setToken(receivedToken);
      setProfile(receivedProfile);
      return receivedProfile;
    } catch (err) {
      throw err; // Login.tsx ला error दिसण्यासाठी
    } finally {
      setLoading(false);
    }
  };

  const loginPassword = async (mobile: string, password: string): Promise<Profile> => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login-password', { mobile, password });
      const { token: receivedToken, profile: receivedProfile } = response.data;
      
      localStorage.setItem('token', receivedToken);
      localStorage.setItem('profile', JSON.stringify(receivedProfile));
      
      setToken(receivedToken);
      setProfile(receivedProfile);
      return receivedProfile;
    } catch (err) {
      throw err;
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
        role: data.role || 'farmer',
        password: data.password,
        shopName: data.shopName,
        gstNumber: data.gstNumber
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

  const updateProfileState = (updatedProfile: Profile) => {
    localStorage.setItem('profile', JSON.stringify(updatedProfile));
    setProfile(updatedProfile);
  };

  return (
    <AuthContext.Provider value={{ token, profile, loading, login, loginPassword, register, logout, updateProfileState }}>
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
