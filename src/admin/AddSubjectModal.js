import React, { useEffect } from "react";
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

function AddSubjectModal({ open, onClose, onSubmit, selectedSubject }) {
  console.log("selectedSubject", selectedSubject);
  const [form, setForm] = React.useState({
    name: "",
    code: "",
  });

  const [errors, setErrors] = React.useState({});

  useEffect(() => {
    setForm(selectedSubject);
  }, [selectedSubject]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    // Clear error when user types
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    let tempErrors = {};

    if (!form.name.trim()) {
      tempErrors.name = "Subject name is required";
    }

    if (!form.code.trim()) {
      tempErrors.code = "Subject code is required";
    }

    setErrors(tempErrors);

    // valid if no error keys
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return; // ❌ stop API call

    onSubmit(form); // ✅ API call only if valid

    setForm({ name: "", code: "" });
    setErrors({});
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Add Subject
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Subject Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            error={!!errors.name}
            helperText={errors.name}
          />

          <TextField
            label="Subject Code"
            name="code"
            value={form.code}
            onChange={handleChange}
            fullWidth
            error={!!errors.code}
            helperText={errors.code}
          />
        </Stack>

        <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            Save
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}

export default AddSubjectModal;
