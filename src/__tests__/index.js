import React from 'react';
import { AuthProvider, AuthProtected, AuthContext } from '../';
import { create, act } from 'react-test-renderer';

test('render', () => {
  expect(
    create(
      <AuthProvider>
        hello<AuthProtected>world</AuthProtected>
      </AuthProvider>
    ).toJSON()
  ).toMatchInlineSnapshot(`"hello"`);
});

test('loading', () => {
  const Loading = () => 'loading';

  expect(
    create(
      <AuthProvider>
        hello
        <AuthProtected renderLoading={Loading}>world</AuthProtected>
      </AuthProvider>
    ).toJSON()
  ).toMatchInlineSnapshot(`
    Array [
      "hello",
      "loading",
    ]
  `);
});

test('getCurrentUser', async () => {
  let root;
  let resolve;
  function getCurrentUser() {
    return new Promise(_resolve => {
      resolve = _resolve;
    });
  }

  act(() => {
    root = create(
      <AuthProvider getCurrentUser={getCurrentUser}>
        hello
        <AuthProtected>
          <AuthContext.Consumer>
            {({ currentUser }) => currentUser.name}
          </AuthContext.Consumer>
        </AuthProtected>
      </AuthProvider>
    );
  });

  expect(root.toJSON()).toMatchInlineSnapshot(`"hello"`);

  await act(async () => {
    resolve({ id: '1', name: 'test' });
  });

  expect(root.toJSON()).toMatchInlineSnapshot(`
    Array [
      "hello",
      "test",
    ]
  `);
});
