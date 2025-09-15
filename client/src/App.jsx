// client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, CssBaseline } from '@mui/material'; 
import { Typography } from '@mui/material';

import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import UserList from './components/UserList';

function App() {
  return (
    <Router>
      <CssBaseline />
      <Navbar />
      <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/" element={
            <Typography variant="h4" component="h1" gutterBottom textAlign="center">
              Welcome to the User Management System
            </Typography>
          } />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;