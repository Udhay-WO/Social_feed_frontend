/* eslint-disable react/prop-types */
import { createContext, useContext } from "react";
import Cookie from "js-cookie";
import { useState, useEffect } from "react";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = Cookie.get("accessToken");
      if (storedToken) {
        try {
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Invalid token:", error);
          Cookie.remove("accessToken");
          setIsLoggedIn(false);
        }
      } else {
        Cookie.remove("accessToken");
        setIsLoggedIn(false);
      }
      setLoading(false);
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
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
