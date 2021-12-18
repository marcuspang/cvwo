import { NextPage } from "next";
import React, { useState } from "react";

interface AuthContextInterface {
  token: string | null;
  loggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
}

interface AuthContextProviderInterface {
  children?: React.ReactNode;
}

const AuthContext = React.createContext<AuthContextInterface | null>(null);

export const AuthContextProvider = ({
  children,
}: AuthContextProviderInterface) => {
  const tokenKey = "cvwoToken";

  const [token, setToken] = useState(localStorage.getItem(tokenKey));

  const loggedIn = !!token;

  const loginHandler = (token: string) => {
    setToken(token);
    localStorage.setItem(tokenKey, token);
  };

  const logoutHandler = () => {
    setToken(null);
    localStorage.removeItem(tokenKey);
  };

  const contextValue: AuthContextInterface = {
    token: token,
    loggedIn: loggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
