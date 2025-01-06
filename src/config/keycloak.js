import Keycloak from "keycloak-js";

const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL || "http://localhost:8080",
  realm: import.meta.env.VITE_KEYCLOAK_REALM || "your-realm",
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || "your-client-id",
};

// Create a single instance of Keycloak without freezing
const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
