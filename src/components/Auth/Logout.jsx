import React, { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

const Logout = () => {
  const { logout } = useAuth();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logout();
        // Keycloak will handle the redirect
      } catch (error) {
        console.error("Failed to logout", error);
      }
    };

    handleLogout();
  }, [logout]);

  return null;
};

export default Logout;
