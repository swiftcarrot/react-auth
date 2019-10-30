import React, { createContext, useState, useContext, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({
  children,
  getCurrentUser,
  beforeLoginUser,
  afterLoginUser,
  beforeLogoutUser,
  afterLogoutUser
}) => {
  const [loading, setLoading] = useState(getCurrentUser ? true : false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (getCurrentUser) {
      getCurrentUser()
        .then(user => {
          if (user) {
            setCurrentUser(user);
            setLoading(false);
          } else {
            setCurrentUser(null);
            setLoading(false);
          }
        })
        .catch(err => {
          console.warn(err);
          setCurrentUser(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [getCurrentUser]);

  function loginUser(user) {
    return beforeLoginUser(user)
      .then(user => {
        setCurrentUser(user);
        return user;
      })
      .then(user => afterLoginUser(user));
  }

  function logoutUser() {
    return beforeLogoutUser(currentUser)
      .then(user => {
        setCurrentUser(null);
        return user;
      })
      .then(user => afterLogoutUser(user));
  }

  const providerValue = {
    loading,
    setLoading,
    loginUser,
    logoutUser,
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

AuthProvider.defaultProps = {
  beforeLoginUser: user => Promise.resolve(user),
  afterLoginUser: user => Promise.resolve(user),
  beforeLogoutUser: user => Promise.resolve(user),
  afterLogoutUser: user => Promise.resolve(user)
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
