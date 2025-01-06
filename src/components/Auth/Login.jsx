import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./Auth.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await login();
      //navigate Keycloak will handle the redirect automatically
      //navigate("/profile");
    } catch (error) {
      console.error("Failed to login:", error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Log in</h2>
        <button onClick={handleLogin} className="auth-button">
          Login with Keycloak
        </button>
      </div>
    </div>
  );
};

export default Login;
