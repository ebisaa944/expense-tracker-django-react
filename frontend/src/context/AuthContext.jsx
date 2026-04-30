import { useEffect, useState } from 'react';
import { getCurrentUser, loginUser, signupUser } from '../services/auth';
import AuthContext from './authContext';
import { clearSession, clearStoredUser, getAccessToken, getStoredUser, storeSession, storeUser } from '../services/authStorage';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(() => Boolean(getAccessToken()));

  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      return;
    }

    getCurrentUser()
      .then((response) => {
        setUser(response.data);
        storeUser(response.data);
      })
      .catch(() => {
        clearSession();
        clearStoredUser();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const response = await loginUser(credentials);
    storeSession({
      access: response.data.access,
      refresh: response.data.refresh,
      remember: Boolean(credentials.remember_me),
    });
    storeUser(response.data.user);
    setUser(response.data.user);
    return response.data.user;
  };

  const signup = async (payload) => {
    const response = await signupUser(payload);
    return response.data;
  };

  const logout = () => {
    clearSession();
    clearStoredUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
