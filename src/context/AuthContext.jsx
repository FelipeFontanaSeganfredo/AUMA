import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('jwtToken'));
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || '');
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || '');

  const saveAuth = (data, email) => {
    localStorage.setItem('jwtToken', data.accessToken);
    localStorage.setItem('userName', data.name || email.split('@')[0]);
    localStorage.setItem('userRole', data.role || 'ADMIN');
    localStorage.setItem('userEmail', email);
    setToken(data.accessToken);
    setUserName(data.name || email.split('@')[0]);
    setUserRole(data.role || 'ADMIN');
    setUserEmail(email);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUserName('');
    setUserRole('');
    setUserEmail('');
  };

  return (
    <AuthContext.Provider value={{ token, userName, userRole, userEmail, saveAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
