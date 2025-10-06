// client/src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container, CssBaseline, Card, CardContent } from "@mui/material";
import { Typography } from "@mui/material";
import "./App.css";

import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Login from "./components/Login";
import UserList from "./components/UserList";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <CssBaseline />
      <Navbar />
      <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <div className="app-center">
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/users"
              element={
                <PrivateRoute>
                  <UserList />
                </PrivateRoute>
              }
            />
            <Route
              path="/"
              element={
                <Card className="card">
                  <CardContent>
                    <Typography
                      variant="h3"
                      component="h1"
                      gutterBottom
                      textAlign="center"
                    >
                      Welcome to the User Management System
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      textAlign="center"
                    >
                      Manage users, roles and access with a modern UI.
                    </Typography>
                  </CardContent>
                </Card>
              }
            />
          </Routes>
        </div>
      </Container>
    </Router>
  );
}

export default App;
