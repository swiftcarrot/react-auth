# @swiftcarrot/react-auth

```javascript
import React from 'react';
import { AuthProvider, useAuth } from '@swiftcarrot/react-auth';

const App = () => {
  return (
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  );
};

const Dashboard = () => {
  const { currentUser } = useAuth();
  return <div>{currentUser.id}</div>;
};
```
