# @swiftcarrot/react-auth

[![npm](https://img.shields.io/npm/v/@swiftcarrot/react-auth.svg)](https://www.npmjs.com/package/@swiftcarrot/react-auth)
[![npm](https://img.shields.io/npm/dm/@swiftcarrot/react-auth.svg)](https://www.npmjs.com/package/@swiftcarrot/react-auth)
[![Build Status](https://travis-ci.org/swiftcarrot/react-auth.svg?branch=master)](https://travis-ci.org/swiftcarrot/react-auth)
[![codecov](https://codecov.io/gh/swiftcarrot/react-auth/branch/master/graph/badge.svg)](https://codecov.io/gh/swiftcarrot/react-auth)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

Authentication in React and React Native

### Installation

```sh
yarn add @swiftcarrot/react-auth
```

### Usage

```javascript
import React from 'react';
import { AuthProvider, AuthProtected, useAuth } from '@swiftcarrot/react-auth';

const getCurrentUser = () => fetch('/user');

const App = () => {
  return (
    <AuthProvider getCurrentUser={getCurrentUser}>
      <AuthProtected renderLoading={Loading} renderLogin={LoginPage}>
        <Dashboard />
      </AuthProtected>
    </AuthProvider>
  );
};

const Dashboard = () => {
  const { currentUser } = useAuth();
  return <div>{currentUser.name}</div>;
};
```

### API

#### AuthProvider

- getCurrentUser
- beforeLoginUser
- afterLoginUser
- beforeLogoutUser
- afterLogoutUser
- renderLoading

#### AuthProtected

- renderLoading
- renderLogin

#### AuthContext

#### useAuth

#### Methods

- loading
- setLoading
- currentUser
- setCurrentUser
- loginuser
- logoutUser

### License

MIT
