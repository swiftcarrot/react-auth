import React from 'react';
import { AuthProvider, AuthProtected, AuthContext } from '../';
import { create, act } from 'react-test-renderer';

const Loading = () => 'loading';

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
  expect(
    create(
      <AuthProvider>
        hello
        <AuthProtected renderLoading={Loading}>world</AuthProtected>
      </AuthProvider>
    ).toJSON()
  ).toMatchInlineSnapshot(`"hello"`);
});

test('renderLoading', () => {
  expect(
    create(
      <AuthProvider
        getCurrentUser={() => Promise.resolve({ id: '1' })}
        renderLoading={Loading}
      >
        hello
        <AuthProtected renderLoading={Loading}>world</AuthProtected>
      </AuthProvider>
    ).toJSON()
  ).toMatchInlineSnapshot(`"loading"`);
});

test('getCurrentUser', async () => {
  let root;
  let resolve;
  function getCurrentUser() {
    return new Promise((_resolve) => {
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

test('loginUser', async () => {
  let root;
  let _loginUser;

  function beforeLoginUser(user) {
    expect(user.id).toEqual('1');
    return Promise.resolve(user);
  }

  function afterLoginUser(user) {
    expect(user.id).toEqual('1');
    return user;
  }

  act(() => {
    root = create(
      <AuthProvider
        beforeLoginUser={beforeLoginUser}
        afterLoginUser={afterLoginUser}
      >
        hello
        <AuthContext.Consumer>
          {({ loginUser }) => {
            _loginUser = loginUser;
          }}
        </AuthContext.Consumer>
        <AuthProtected renderLoading={Loading}>
          <AuthContext.Consumer>
            {({ currentUser }) => currentUser.name}
          </AuthContext.Consumer>
        </AuthProtected>
      </AuthProvider>
    );
  });

  expect(root.toJSON()).toMatchInlineSnapshot(`"hello"`);

  await act(async () => {
    _loginUser({ id: '1', name: 'test' });
  });

  expect(root.toJSON()).toMatchInlineSnapshot(`
    Array [
      "hello",
      "test",
    ]
  `);
});

test('logoutUser', async () => {
  let root;
  let _loginUser;
  let _logoutUser;

  function beforeLogoutUser(user) {
    expect(user.id).toEqual('1');
    return Promise.resolve(user);
  }

  function afterLogoutUser(user) {
    expect(user.id).toEqual('1');
    return user;
  }

  act(() => {
    root = create(
      <AuthProvider
        beforeLogoutUser={beforeLogoutUser}
        afterLogoutUser={afterLogoutUser}
      >
        hello
        <AuthContext.Consumer>
          {({ loginUser, logoutUser }) => {
            _loginUser = loginUser;
            _logoutUser = logoutUser;
          }}
        </AuthContext.Consumer>
        <AuthProtected renderLoading={Loading}>
          <AuthContext.Consumer>
            {({ currentUser }) => currentUser.name}
          </AuthContext.Consumer>
        </AuthProtected>
      </AuthProvider>
    );
  });

  expect(root.toJSON()).toMatchInlineSnapshot(`"hello"`);

  await act(async () => {
    _loginUser({ id: '1', name: 'test' });
  });

  expect(root.toJSON()).toMatchInlineSnapshot(`
    Array [
      "hello",
      "test",
    ]
  `);

  await act(async () => {
    _logoutUser();
  });

  expect(root.toJSON()).toMatchInlineSnapshot(`"hello"`);
});
