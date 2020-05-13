import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useReducer,
} from 'react';

export const AuthContext = createContext();

export function reducer(state, action) {
  switch (action.type) {
    case 'loading': {
      return { ...state, loading: action.payload };
    }
    case 'currentUser': {
      return { ...state, currentUser: action.payload };
    }
  }

  return state;
}

export const AuthProvider = ({
  children,
  getCurrentUser,
  beforeLoginUser,
  afterLoginUser,
  beforeLogoutUser,
  afterLogoutUser,
  renderLoading,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    loading: getCurrentUser ? true : false,
    currentUser: null,
  });
  const { loading, currentUser } = state;

  function setLoading(payload) {
    dispatch({ type: 'loading', payload });
  }

  function setCurrentUser(payload) {
    dispatch({ type: 'currentUser', payload });
  }

  useEffect(() => {
    if (getCurrentUser) {
      getCurrentUser()
        .then((user) => {
          if (user) {
            return loginUser(user).then(() => {
              setLoading(false);
            });
          } else {
            setCurrentUser(null);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.warn(err);
          setCurrentUser(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [getCurrentUser, loginUser]);

  const loginUser = useCallback(
    (user) => {
      return beforeLoginUser(user)
        .then((user) => {
          setCurrentUser(user);
          return user;
        })
        .then((user) => afterLoginUser(user));
    },
    [beforeLoginUser, afterLoginUser]
  );

  const logoutUser = useCallback(() => {
    return beforeLogoutUser(currentUser)
      .then((user) => {
        setCurrentUser(null);
        return user;
      })
      .then((user) => afterLogoutUser(user));
  }, [currentUser, beforeLogoutUser, afterLogoutUser]);

  const providerValue = {
    loading,
    setLoading,
    loginUser,
    logoutUser,
    currentUser,
    setCurrentUser,
  };

  if (loading && renderLoading) {
    return (
      <AuthContext.Provider value={providerValue}>
        {React.createElement(renderLoading)}
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={providerValue}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.defaultProps = {
  beforeLoginUser: (user) => Promise.resolve(user),
  afterLoginUser: (user) => Promise.resolve(user),
  beforeLogoutUser: (user) => Promise.resolve(user),
  afterLogoutUser: (user) => Promise.resolve(user),
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
