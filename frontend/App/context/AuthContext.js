import React, { createContext, useContext, useState, useEffect } from "react";
import { View } from "react-native";
import { Signup, Login } from "../../api/Api";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const signup = (user) => {
    return Signup(user);
  };

  const loginUser = async (credentials, callback) => {
    await Login(credentials)
      .then(({ data }) => {
        setToken("Bearer " + data.access);
        setUser(data.user);
      })
      .catch((e) => {
        callback(e.response.data.detail);
      });
  };

  const logout = () => {
    setToken(null);
  };

  const contextvalue = {
    user,
    signup,
    loginUser,
    token,
    logout,
  };

  return (
    <AuthContext.Provider value={contextvalue}>{children}</AuthContext.Provider>
  );
};
