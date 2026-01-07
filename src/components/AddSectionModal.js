import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { parseJwt } from "../utility/commonTask";

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

function AddSectionModal({ open, onClose, onSubmit, loading, editSection, classes }) {
  const token = localStorage.getItem("authToken");
  const { schoolId } = parseJwt(token);

  const [form, setForm] = useState({
    classId: "",
    name: "",
  });

  const [errors, setErrors] = useState({});

  // Populate form if editing
  useEffect(() => {
    if (editSection) {
      setForm({
        classId: editSection.classId,
        name: editSection.name,
      });
    } else {
      setForm({ classId: "", name: "" });
    }
    setErrors({});
  }, [editSection, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const err = {};

    if (!form.classId) err.classId = "Please select a class";
    if (!form.name.trim()) err.name = "Section name is required";
    else if (!/^[A-Z]$/.test(form.name))
      err.name = "Use a single capital letter (A, B, C)";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSubmit({
      schoolId,
      classId: form.classId,
      name: form.name.toUpperCase(), // ensure uppercase
    });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" fontWeight={700} mb={2}>
          {editSection ? "Edit Section" : "Add Section"}
        </Typography>

        <Stack spacing={2}>
          <FormControl fullWidth error={!!errors.classId}>
            <InputLabel id="class-label">Class</InputLabel>
            <Select
              labelId="class-label"
              name="classId"
              value={form.classId}
              onChange={handleChange}
              displayEmpty
            >
              {/* <MenuItem value="">
                <em>Select Class</em>
              </MenuItem> */}
              {classes?.map((cls) => (
                <MenuItem key={cls.id} value={cls.id}>
                  {cls.displayName ?? cls.name}
                </MenuItem>
              ))}
            </Select>
            {errors.classId && <FormHelperText>{errors.classId}</FormHelperText>}
          </FormControl>

          <TextField
            label="Section Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name || "Single uppercase letter, e.g., A, B, C"}
            inputProps={{ maxLength: 1 }}
            fullWidth
          />
        </Stack>

        <Stack direction="row" justifyContent="flex-end" spacing={2} mt={3}>
          <Button onClick={onClose} variant="outlined" disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}

export default AddSectionModal;
