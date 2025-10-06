// client/src/components/Navbar.jsx
import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import logo from "../assets/react.svg";
import { Snackbar, Alert } from "@mui/material";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  let user = null;
  try {
    if (token) user = jwtDecode(token);
  } catch (e) {
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const [open, setOpen] = React.useState(false);
  const handleLogoutClick = () => {
    localStorage.removeItem("token");
    navigate("/login");
    setOpen(true);
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  return (
    <AppBar position="static" color="primary" elevation={2}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            User Management
          </Link>
        </Typography>

        {user ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              component={Link}
              to="/users"
              variant="outlined"
              sx={{
                color: "white",
                borderColor: "rgba(255,255,255,0.16)",
                "&:hover": { borderColor: "rgba(255,255,255,0.24)" },
              }}
            >
              Users
            </Button>
            <Typography sx={{ ml: 1, mr: 1 }}>{user.name}</Typography>
            <Avatar sx={{ width: 36, height: 36, bgcolor: "secondary.main" }}>
              {user.name?.charAt(0)?.toUpperCase()}
            </Avatar>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleLogoutClick}
              sx={{ ml: 1 }}
            >
              Logout
            </Button>
          </Box>
        ) : (
          <Box>
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              sx={{
                color: "white",
                borderColor: "rgba(255,255,255,0.16)",
                mr: 1,
              }}
            >
              Login
            </Button>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              color="secondary"
            >
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Logged out
        </Alert>
      </Snackbar>
    </AppBar>
  );
};

export default Navbar;
