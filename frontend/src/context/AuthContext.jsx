import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api/admin`;

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('admin_token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const response = await axios.get(`${API}/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setAdminEmail(response.data.email);
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.removeItem('admin_token');
          setToken(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };
    verifyToken();
  }, [token]);

  const login = async (email, password) => {
    const response = await axios.post(`${API}/login`, { email, password });
    const { token: newToken, email: userEmail } = response.data;
    localStorage.setItem('admin_token', newToken);
    setToken(newToken);
    setAdminEmail(userEmail);
    setIsAuthenticated(true);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
    setAdminEmail(null);
    setIsAuthenticated(false);
  };

  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${token}` }
  });

  return (
    <AuthContext.Provider value={{
      token,
      isAuthenticated,
      loading,
      adminEmail,
      login,
      logout,
      getAuthHeader
    }}>
      {children}
    </AuthContext.Provider>
  );
};
