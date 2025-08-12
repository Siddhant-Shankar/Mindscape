import React, { createContext, useState, useEffect } from 'react';

// Create the AuthContext
export const AuthContext = createContext({
  token: null,
  login: () => {},
  logout: () => {}
});

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  // Keep localStorage in sync if token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  // login and logout helpers
  const login = newToken => setToken(newToken);
  const logout = () => setToken(null);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}


/* 
React context - way to share data across the component tree without having to manually pass props down through every level - useful for user authentication
we use useState to hold the JWT token
and useeffect to run side - effects (syncing with local Storage)

Creates a Context object.

The object you pass here is the default value, used only if a component tries to consume this context without being wrapped in a provider.
We shape it with:

token: initially null (no user logged in).

login: a placeholder function.

logout: a placeholder function.



export function AuthProvider({ children })

This is a React component that will “provide” (i.e. supply) the context values to everything inside it.
{ children } is a special prop: whatever JSX you nest inside <AuthProvider> ... </AuthProvider> will become children.

  const [token, setToken] = useState(() => localStorage.getItem('token')); 

  - state initialization
  - use state takes a function so we read from localstorage once on mount, rather than on every render
  - if local storage has a token we start with that user(stays logged in)

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

- Synchronizing side effects
Whenever token changes,
If there is a token, we save it in the browser’s localStorage so it persists across page reloads.
If there is no token(on logout), we remove it from localstorage

The {token} dependency array ensures this only runs when token changes


  
  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );


  Provider:

We render <AuthContext.Provider> around children.

We pass a value prop containing an object with:

token: the current JWT (or null).

login: the function to call when you get a new token.

logout: the function to clear it.

Any component nested inside this provider can use useContext(AuthContext) to get those three properties.



*/