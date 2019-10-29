# @swiftcarrot/react-auth

### Installation

```sh
yarn add @swiftcarrot/react-auth
```

### Usage

```javascript
import React from 'react';
import { AuthProvider, AuthProctected, useAuth } from '@swiftcarrot/react-auth';

const App = () => {
  return (
    <AuthProvider getCurrentUser={getCurrentUser}>
      <AuthProtected renderLoading={<Loading />} renderLogin={LoginPage}>
        <Dashboard />
      </AuthProtected>
    </AuthProvider>
  );
};

const Dashboard = () => {
  const { currentUser } = useAuth();
  return <div>{currentUser.id}</div>;
};
```
