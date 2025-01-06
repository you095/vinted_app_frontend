import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import keycloak from "../config/keycloak";
import axiosInstance from "../config/axios";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const initializingRef = useRef(false);

  useEffect(() => {
    const initKeycloak = async () => {
      if (initializingRef.current) {
        return;
      }

      initializingRef.current = true;

      try {
        const authenticated = await keycloak.init({
          onLoad: "check-sso",
          silentCheckSsoRedirectUri:
            window.location.origin + "/silent-check-sso.html",
          pkceMethod: "S256",
        });

        if (authenticated) {
          try {
            // First register the user with the backend
            await axiosInstance.post("/register/");

            // Then fetch user data
            const response = await axiosInstance.get("/users/me");
            setCurrentUser({
              id: keycloak.subject,
              email: keycloak.tokenParsed.email,
              displayName: keycloak.tokenParsed.name,
              roles: keycloak.realmAccess?.roles || [],
              ...response.data, // Merge API data with Keycloak data
            });
          } catch (error) {
            console.error("Failed to fetch user data:", error);
            setCurrentUser({
              id: keycloak.subject,
              email: keycloak.tokenParsed.email,
              displayName: keycloak.tokenParsed.name,
              roles: keycloak.realmAccess?.roles || [],
            });
          }
        }
      } catch (error) {
        console.error("Keycloak init error:", error);
      } finally {
        setLoading(false);
        initializingRef.current = false;
      }
    };

    initKeycloak();
  }, []);

  const login = async () => {
    try {
      await keycloak.login({
        redirectUri: window.location.origin + "/profile",
      });
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await keycloak.logout({
        redirectUri: window.location.origin,
      });
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  const value = {
    currentUser,
    login,
    logout,
    keycloak,
    api: axiosInstance, // Expose the axios instance
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
