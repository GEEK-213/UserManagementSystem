// client/src/components/UserList.jsx
import React, { useState, useEffect } from "react";
import api from "../api/api";
import { jwtDecode } from "jwt-decode";
import EditUserDialog from "./EditUserDialog";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  // Fetch all users when the component mounts
  useEffect(() => {
    const fetchUsers = async (authToken) => {
      try {
        const res = await api.get("/users");
        setUsers(res.data.data.users);
      } catch (err) {
        setError("Failed to fetch users. You might not be authorized.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setCurrentUser(decodedToken);
      fetchUsers(token);
    } else {
      setError("No token found, please log in.");
      setLoading(false);
    }
  }, []);

  // Handler for deleting a user
  const handleDelete = async (userId) => {
    if (
      !window.confirm("Are you sure you want to permanently delete this user?")
    )
      return;
    try {
      await api.delete(`/users/${userId}`);
      setUsers((prev) => prev.filter((user) => user._id !== userId)); // Optimistic UI
      setSuccess("User deleted");
    } catch (err) {
      setError("Failed to delete user.");
    }
  };

  // Handler for updating a user
  const handleUpdate = async (user) => {
    setEditingUser(user);
  };

  const handleSaveEdit = async (data) => {
    try {
      const res = await api.put(`/users/${editingUser._id}`, data);
      setUsers((prev) =>
        prev.map((u) => (u._id === editingUser._id ? res.data : u))
      );
      setSuccess("User updated");
      setEditingUser(null);
    } catch (err) {
      setError("Failed to update user.");
    }
  };

  if (loading)
    return (
      <CircularProgress sx={{ display: "block", margin: "auto", mt: 4 }} />
    );

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", mt: 4 }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="h2">
          Registered Users
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}
      </Box>
      <EditUserDialog
        open={!!editingUser}
        onClose={() => setEditingUser(null)}
        user={editingUser}
        onSave={handleSaveEdit}
      />
      <TableContainer>
        <Table stickyHeader aria-label="user table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Joined On</TableCell>
              {currentUser?.role === "admin" && (
                <TableCell align="right">Actions</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow hover key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell sx={{ textTransform: "capitalize" }}>
                  {user.role}
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                {currentUser?.role === "admin" && (
                  <TableCell align="right">
                    <IconButton
                      onClick={() => handleUpdate(user)}
                      color="primary"
                      aria-label="edit user"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(user._id)}
                      color="error"
                      aria-label="delete user"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default UserList;
