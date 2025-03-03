/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  if (isLoggedIn) {
    return <Navigate to="/home" replace />;
  }
  return children;
};
