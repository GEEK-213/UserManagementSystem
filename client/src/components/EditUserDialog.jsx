import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";

export default function EditUserDialog({ open, onClose, user, onSave }) {
  const { register, handleSubmit, reset } = useForm({ defaultValues: user });

  React.useEffect(() => {
    reset(user);
  }, [user, reset]);

  const save = (data) => {
    onSave(data);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Edit user</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Name"
          fullWidth
          {...register("name")}
        />
        <TextField
          margin="dense"
          label="Email"
          fullWidth
          {...register("email")}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit(save)} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
