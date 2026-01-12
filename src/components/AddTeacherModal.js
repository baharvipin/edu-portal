import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  FormHelperText,
} from "@mui/material";
import useFetch from "../hooks/useFetch";
import { parseJwt } from "../utility/commonTask";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

function AddTeacherModal({
  open,
  onClose,
  onSubmit,
  loading,
  subjects,
  editTeacher,
}) {
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    phone: "",
    subjects: [],
  });

  console.log("editTeacher", editTeacher);

  const [errors, setErrors] = React.useState({});

  useEffect(() => {
    if (editTeacher) {
      // Map teacher's subjects to an array of subject names
      const subjectNames =
        editTeacher?.subjects?.map((s) => s.subject.name) || [];

      setForm({
        name: editTeacher.fullName || "",
        email: editTeacher.email || "",
        phone: editTeacher.phone || "",
        subjects: subjectNames,
      });
    } else {
      // For Add mode, reset form
      setForm({
        name: "",
        email: "",
        phone: "",
        subjects: [],
      });
    }
  }, [editTeacher, open]); // ✅ depend on open to reset when modal is reopened

  // useEffect(() => {
  //   if (editTeacher) {
  //     console.log("check if", editTeacher);
  //     const subjectNames = editTeacher?.subjects?.map((s) => s.subject.name);

  //     setForm({
  //       name: editTeacher.fullName,
  //       email: editTeacher.email,
  //       phone: editTeacher.phone,
  //       subjects: subjectNames,
  //     });
  //   } else {
  //     console.log("check else", form);
  //     setForm({
  //       name: "",
  //       email: "",
  //       phone: "",
  //       subjects: subjects,
  //     });
  //   }
  // }, [editTeacher]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    // Clear error on change
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubjectsChange = (e) => {
    setForm({ ...form, subjects: e.target.value });
    setErrors({ ...errors, subjects: "" });
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Teacher name is required";
    } else if (form.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Invalid email address";
    }

    if (form.phone && !/^\d{10}$/.test(form.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }

    if (!form.subjects.length) {
      newErrors.subjects = "Select at least one subject";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSubmit(form); // ✅ API call only if valid
  };

  const handleClose = () => {
    setForm({ name: "", email: "", phone: "", subjects: [] });
    setErrors({});
    onClose();
  };
  console.log("form.subjects subjects", form.subjects, subjects);

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Add Teacher
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Teacher Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            error={!!errors.name}
            helperText={errors.name}
          />

          <TextField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            error={!!errors.email}
            helperText={errors.email}
          />

          <TextField
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            fullWidth
            error={!!errors.phone}
            helperText={errors.phone}
          />

          <FormControl fullWidth error={!!errors.subjects}>
            <InputLabel>Subjects</InputLabel>
            <Select
              multiple
              value={form.subjects}
              onChange={handleSubjectsChange}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {subjects?.map((subject) => (
                <MenuItem key={subject} value={subject}>
                  {subject}
                </MenuItem>
              ))}
            </Select>
            {errors.subjects && (
              <FormHelperText>{errors.subjects}</FormHelperText>
            )}
          </FormControl>
        </Stack>

        <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
          <Button onClick={handleClose} variant="outlined" disabled={loading}>
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

export default AddTeacherModal;
