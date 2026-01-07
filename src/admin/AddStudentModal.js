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
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import useFetch from "../hooks/useFetch";
import { parseJwt } from "../utility/commonTask";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 480,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

function AddStudentModal({ open, onClose, onSuccess }) {
  const token = localStorage.getItem("authToken");
  const { schoolId } = parseJwt(token);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    classId: "",
    sectionId: "",
    parentName: "",
    parentPhone: "",
  });

  const [errors, setErrors] = useState({});
  const [payload, setPayload] = useState(null);

  // 🔹 Fetch classes & sections
  const { data: classesRes } = useFetch(
    `/api/classes/${schoolId}`,
    {},
    !!schoolId
  );

  const { data: sectionsRes } = useFetch(
    form.classId ? `/api/sections/${form.classId}` : null,
    {},
    !!form.classId
  );

  // 🔹 Submit student
  const { data: addStudentRes, loading } = useFetch(
    "/api/students",
    {
      method: "POST",
      body: payload,
    },
    payload !== null
  );

  useEffect(() => {
    if (addStudentRes) {
      onSuccess?.(addStudentRes.student);
      handleClose();
    }
  }, [addStudentRes]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const e = {};

    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";

    if (!form.email) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      e.email = "Invalid email";

    if (!/^\d{10}$/.test(form.phone))
      e.phone = "Phone must be 10 digits";

    if (!form.classId) e.classId = "Class is required";
    if (!form.sectionId) e.sectionId = "Section is required";

    if (!form.parentName.trim())
      e.parentName = "Parent name is required";

    if (!/^\d{10}$/.test(form.parentPhone))
      e.parentPhone = "Parent phone must be 10 digits";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    setPayload({
      ...form,
      schoolId,
    });
  };

  const handleClose = () => {
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      classId: "",
      sectionId: "",
      parentName: "",
      parentPhone: "",
    });
    setErrors({});
    setPayload(null);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Add Student
        </Typography>

        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            <TextField
              label="First Name"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              error={!!errors.firstName}
              helperText={errors.firstName}
              fullWidth
            />
            <TextField
              label="Last Name"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              error={!!errors.lastName}
              helperText={errors.lastName}
              fullWidth
            />
          </Stack>

          <TextField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
          />

          <TextField
            label="Mobile"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            error={!!errors.phone}
            helperText={errors.phone}
            fullWidth
          />

          <FormControl fullWidth error={!!errors.classId}>
            <InputLabel>Class</InputLabel>
            <Select
              name="classId"
              value={form.classId}
              onChange={handleChange}
            >
              {classesRes?.classes?.map((cls) => (
                <MenuItem key={cls.id} value={cls.id}>
                  {cls.displayName}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.classId}</FormHelperText>
          </FormControl>

          <FormControl fullWidth error={!!errors.sectionId}>
            <InputLabel>Section</InputLabel>
            <Select
              name="sectionId"
              value={form.sectionId}
              onChange={handleChange}
              disabled={!form.classId}
            >
              {sectionsRes?.sections?.map((sec) => (
                <MenuItem key={sec.id} value={sec.id}>
                  {sec.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.sectionId}</FormHelperText>
          </FormControl>

          <TextField
            label="Parent Name"
            name="parentName"
            value={form.parentName}
            onChange={handleChange}
            error={!!errors.parentName}
            helperText={errors.parentName}
            fullWidth
          />

          <TextField
            label="Parent Phone"
            name="parentPhone"
            value={form.parentPhone}
            onChange={handleChange}
            error={!!errors.parentPhone}
            helperText={errors.parentPhone}
            fullWidth
          />
        </Stack>

        <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit} disabled={loading}>
            { "Save"}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}

export default AddStudentModal;
