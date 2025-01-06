import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  Button,
  IconButton,
  MenuItem,
  Select,
  Menu,
  InputAdornment,
} from "@mui/material";
import {
  Mail,
  Notifications,
  Favorite,
  AccountCircle,
  Search,
} from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    navigate("/profile");
    handleClose();
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleClose();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" className="logo" onClick={() => navigate("/")}>
          vinted
        </Typography>
        <div className="header-controls">
          <TextField
            variant="outlined"
            size="small"
            placeholder="Rechercher des articles"
            className="search-field"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "#999", marginRight: "4px" }} />
                </InputAdornment>
              ),
            }}
          />
          {currentUser ? (
            <Button
              variant="contained"
              className="sell-button"
              onClick={() => navigate("/sell")}
            >
              Vends maintenant
            </Button>
          ) : (
            <>
              <Button
                variant="outlined"
                className="auth-button"
                onClick={() => navigate("/login")}
              >
                Se connecter
              </Button>
              <Button
                variant="contained"
                className="sell-button"
                onClick={() => navigate("/signup")}
              >
                S'inscrire
              </Button>
            </>
          )}
        </div>
        {currentUser ? (
          <div className="icon-buttons">
            <IconButton className="icon-button">
              <Mail />
            </IconButton>
            <IconButton className="icon-button">
              <Notifications />
            </IconButton>
            <IconButton className="icon-button">
              <Favorite />
            </IconButton>
            <IconButton className="icon-button" onClick={handleMenu}>
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleProfile}>Mon profil</MenuItem>
              <MenuItem onClick={handleLogout}>Se déconnecter</MenuItem>
            </Menu>
          </div>
        ) : null}
        <Select defaultValue="fr" size="small" className="language-selector">
          <MenuItem value="fr">FR</MenuItem>
          <MenuItem value="en">EN</MenuItem>
        </Select>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
