import React from 'react';
import { AuthProvider, AuthProtected } from '../';
import renderer from 'react-test-renderer';

test('render', () => {
  const App = () => {
    return (
      <AuthProvider>
        hello<AuthProtected>world</AuthProtected>
      </AuthProvider>
    );
  };

  expect(renderer.create(<App />).toJSON()).toMatchInlineSnapshot(`"hello"`);
});
