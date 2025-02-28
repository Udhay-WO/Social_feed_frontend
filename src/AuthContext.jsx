/* eslint-disable react/prop-types */
import { createContext, useContext } from "react";
import Cookie from "js-cookie";
import { useState, useEffect } from "react";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = Cookie.get("accessToken");
      if (storedToken) {
        setIsLoggedIn(true);
      } else {
        Cookie.remove("token");
        setIsLoggedIn(false);
      }
    };
    initializeAuth();
  }, []);
  const login = (userData) => {
    setUser(userData);
    Cookie.set("accessToken", userData.accessToken, {
      expires: 1,
      secure: true,
      sameSite: "Strict",
    });
    setIsLoggedIn(true);
  };
  const logout = () => {
    setUser(null);
    Cookie.remove("accessToken");
    setIsLoggedIn(false);
  };
  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};
