import React, { createContext, useContext, useState, useEffect } from "react";
import { Signup, Login } from "../../api/Api";

//Context component to provide login and signup functions plus to share token and user details with all child components

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const signup = (userData) => {
    return Signup(userData);
  };

  const loginUser = async (credentials, callback) => {
    await Login(credentials)
      .then(({ data }) => {
        setToken("Bearer " + data.access);
        setUser(data.user);
      })
      .catch((e) => {
        if (e.response.status === 401) {
          callback("Gebruikersnaam of wachtwoord onjuist");
        } else {
          callback(e.response.data.detail);
        }
      });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
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
