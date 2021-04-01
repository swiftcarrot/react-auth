import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useReducer
} from 'react';

type AuthContextValue = {
  login: (params: any) => Promise<any>;
  logout: (params: any) => Promise<void | false | string>;
  getViewer?: () => Promise<any>;
  [key: string]: any;
};

export const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export function useLogin() {
  const context = useContext(AuthContext);
  return context.login;
}

export function useLogout() {
  const context = useContext(AuthContext);
  return context.logout;
}

export function useViewer() {
  const context = useContext(AuthContext);
  return context.viewer;
}

export function AuthProvider({ children, provider, renderLoading }) {
  const [{ loading, viewer, error }, setState] = useState({
    loading: provider.getViewer ? true : false,
    viewer: null,
    error: null
  });

  const setViewer = (viewer) => {
    setState({ loading: false, viewer, error: null });
  };

  const refreshViewer = useCallback(() => {
    if (provider.getViewer) {
      provider
        .getViewer()
        .then((viewer) => {
          if (viewer) {
            setState({ loading: false, viewer, error: null });
          }
        })
        .catch((error) => {
          setState({ loading: false, viewer: null, error });
        });
    }
  }, [provider]);

  useEffect(() => {
    refreshViewer();
  }, [refreshViewer]);

  const providerValue = {
    loading,
    viewer,
    setViewer,
    refreshViewer,
    login: provider.login,
    logout: provider.logout
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
}

export const AuthProtected = ({ renderLoading, renderLogin, children }) => {
  const { loading, viewer } = useAuth();

  if (loading) {
    return renderLoading ? React.createElement(renderLoading) : null;
  }

  if (!viewer) {
    return renderLogin ? React.createElement(renderLogin) : null;
  }

  return children;
};
