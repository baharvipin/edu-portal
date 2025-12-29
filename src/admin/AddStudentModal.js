import React from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Select,
  MenuItem,
} from "@mui/material";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 420,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

function AddStudentModal({ open, onClose, onSubmit }) {
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    class: "",
  });

  const classes = ["Class 1", "Class 2", "Class 3"];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit(form);
    setForm({ name: "", email: "", class: "" });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Add Student
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Student Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
          />

          <Select
            name="class"
            value={form.class}
            onChange={handleChange}
            displayEmpty
            fullWidth
          >
            <MenuItem value="">
              <em>Select Class</em>
            </MenuItem>
            {classes.map((cls) => (
              <MenuItem key={cls} value={cls}>
                {cls}
              </MenuItem>
            ))}
          </Select>
        </Stack>

        <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            Save
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}

export default AddStudentModal;
