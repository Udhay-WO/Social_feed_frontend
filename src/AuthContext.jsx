/* eslint-disable react/prop-types */
import { createContext, useContext } from "react";
import Cookie from "js-cookie";
import { useState } from "react";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
    
  const login = (userData) => {
    setUser(userData);
    Cookie.set("accessToken", userData.accessToken, {
      expires: 1,
      secure: true,
      sameSite: "Strict",
    });
  };
  const logout = () => {
    setUser(null);
    Cookie.remove("accessToken");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};
