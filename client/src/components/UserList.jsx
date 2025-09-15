// client/src/components/UserList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Typography, CircularProgress, Alert, IconButton, Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch all users when the component mounts
  useEffect(() => {
    const fetchUsers = async (authToken) => {
      try {
        const config = { headers: { Authorization: `Bearer ${authToken}` } };
        const res = await axios.get('http://localhost:5000/api/users', config);
        setUsers(res.data.data.users);
      } catch (err) {
        setError('Failed to fetch users. You might not be authorized.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setCurrentUser(decodedToken);
      fetchUsers(token);
    } else {
      setError('No token found, please log in.');
      setLoading(false);
    }
  }, []);

  // Handler for deleting a user
  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to permanently delete this user?')) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`http://localhost:5000/api/users/${userId}`, config);
      setUsers(users.filter(user => user._id !== userId)); // Update UI instantly
    } catch (err) {
      setError('Failed to delete user.');
    }
  };

  // Handler for updating a user
  const handleUpdate = async (user) => {
    const newName = prompt("Enter new name:", user.name);
    if (newName === null || newName === "") return; // User cancelled or entered empty string

    const newEmail = prompt("Enter new email:", user.email);
    if (newEmail === null || newEmail === "") return; // User cancelled or entered empty string

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.put(
        `http://localhost:5000/api/users/${user._id}`, 
        { name: newName, email: newEmail },
        config
      );
      // Update the user in the list without a page refresh
      setUsers(users.map(u => (u._id === user._id ? res.data : u)));
    } catch (err) {
      setError('Failed to update user.');
    }
  };

  if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />;
  if (error) return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', mt: 4 }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="h2">
          Registered Users
        </Typography>
      </Box>
      <TableContainer>
        <Table stickyHeader aria-label="user table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Joined On</TableCell>
              {currentUser?.role === 'admin' && <TableCell align="right">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow hover key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell sx={{ textTransform: 'capitalize' }}>{user.role}</TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                {currentUser?.role === 'admin' && (
                  <TableCell align="right">
                    <IconButton onClick={() => handleUpdate(user)} color="primary" aria-label="edit user">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(user._id)} color="error" aria-label="delete user">
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