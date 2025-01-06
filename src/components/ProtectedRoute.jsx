import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { currentUser, keycloak } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    // Store the attempted URL for redirection after login
    sessionStorage.setItem("redirectUrl", location.pathname);
    return <Navigate to="/login" />;
  }

  // Check for specific roles if needed
  // if (!currentUser.roles.includes('required-role')) {
  //   return <Navigate to="/unauthorized" />;
  // }

  return children;
};

export default ProtectedRoute;
