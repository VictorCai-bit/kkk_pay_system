import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { API_ENDPOINTS } from '../config/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const merchant = localStorage.getItem('merchant');
    
    if (token && merchant) {
      setUser(JSON.parse(merchant));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post(API_ENDPOINTS.LOGIN, {
        username,
        password,
      });

      if (response.success) {
        const { token, merchant } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('merchant', JSON.stringify(merchant));
        setUser(merchant);
        toast.success('登录成功');
        navigate('/');
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('merchant');
    setUser(null);
    navigate('/login');
    toast.success('已退出登录');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
