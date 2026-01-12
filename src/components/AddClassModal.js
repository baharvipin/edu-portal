import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
} from "@mui/material";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

function AddClassModal({ open, onClose, onSubmit, loading, editClass }) {
  const [form, setForm] = useState({
    name: "",
    displayName: "",
    order: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editClass) {
      setForm({
        name: editClass.name,
        displayName: editClass.displayName ?? "",
        order: editClass.order ?? "",
      });
    } else {
      setForm({ name: "", displayName: "", order: "" });
    }
  }, [editClass]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = "Class name is required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit(form);

    // Reset form only if adding a new class (not editing)
    if (!editClass) {
      setForm({ name: "", displayName: "", order: "" });
      setErrors({});
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" fontWeight={700} mb={2}>
          {editClass ? "Edit Class" : "Add Class"}
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Class Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
          />

          <TextField
            label="Display Name"
            name="displayName"
            value={form.displayName}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Order"
            name="order"
            type="number"
            value={form.order}
            onChange={handleChange}
            fullWidth
          />
        </Stack>

        <Stack direction="row" justifyContent="flex-end" spacing={2} mt={3}>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}

export default AddClassModal;
