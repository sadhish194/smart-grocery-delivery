import { createContext, useContext, useState } from 'react';
import { loginUser as apiLogin, registerUser as apiRegister, getProfile } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); }
    catch { return null; }
  });

  const persist = (data) => {
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
  };

  // Called from Login.jsx as: login(email, password)
  const login = async (email, password) => {
    const { data } = await apiLogin({ email, password });
    persist(data);
    return data;
  };

  // Called from Register.jsx as: register(formData)
  const register = async (formData) => {
    const { data } = await apiRegister(formData);
    persist(data);
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const updateUser = (data) => {
    const updated = { ...user, ...data };
    persist(updated);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
