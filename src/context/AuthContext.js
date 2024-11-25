import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() => {
    const tokens = localStorage.getItem('authTokens');
    return tokens ? JSON.parse(tokens) : null;
  });

  useEffect(() => {
    if (authTokens) {
      localStorage.setItem('authTokens', JSON.stringify(authTokens));
    } else {
      localStorage.removeItem('authTokens');
    }
  }, [authTokens]);

  const logout = () => {
    setAuthTokens(null);
    localStorage.removeItem('authTokens');
  };

  const value = {
    authTokens,
    setAuthTokens,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};