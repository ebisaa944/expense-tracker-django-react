import { useState } from 'react';
import { loginUser } from '../services/auth';
import AuthContext from './authContext';

function getStoredUser() {
  const token = localStorage.getItem('accessToken');
  const username = localStorage.getItem('username');

  if (token && username) {
    return { token, username };
  }

  return null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const login = async (credentials) => {
    const response = await loginUser(credentials);

    localStorage.setItem('accessToken', response.data.access);
    localStorage.setItem('refreshToken', response.data.refresh);
    localStorage.setItem('username', credentials.username);
    setUser({ token: response.data.access, username: credentials.username });
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading: false }}>
      {children}
    </AuthContext.Provider>
  );
}
