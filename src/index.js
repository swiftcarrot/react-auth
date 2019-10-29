import React, { createContext, useState, useContext, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children, getCurrentUser }) => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (getCurrentUser) {
      getCurrentUser()
        .then(user => {
          if (user) {
            setCurrentUser(user);
            setLoading(false);
          }
        })
        .catch(err => {
          console.warn(err);
          setCurrentUser(null);
          setLoading(false);
        });
    }
  }, []);

  function login(user) {
    setCurrentUser(user);
  }

  function logout() {
    setCurrentUser(null);
  }

  const providerValue = {
    loading,
    setLoading,
    login,
    logout,
    currentUser,
    setCurrentUser,
    getCurrentUser
  };

  return (
    <AuthContext.Provider value={providerValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};

export const AuthProtected = ({ renderLoading, renderLogin, children }) => {
  const { loading, currentUser } = useAuth();

  if (loading) {
    return renderLoading ? React.createElement(renderLoading) : null;
  }

  if (!currentUser) {
    return renderLogin ? React.createElement(renderLogin) : null;
  }

  return children;
};
