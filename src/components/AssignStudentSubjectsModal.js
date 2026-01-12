import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Stack,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  FormHelperText,
} from "@mui/material";

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

function AssignStudentSubjectsModal({
  open,
  onClose,
  onSubmit,
  loading,
  subjects, // [{ id, name }]
  student, // { id, firstName, lastName, subjects }
}) {
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [error, setError] = useState("");

  // Prefill when editing
  useEffect(() => {
    if (student?.studentSubjects?.length) {
      setSelectedSubjects(
        student.studentSubjects.map(
          (s) => s.subject.subjectId || s.subject?.id,
        ),
      );
    } else {
      setSelectedSubjects([]);
    }
  }, [student]);

  const handleChange = (e) => {
    setSelectedSubjects(e.target.value);
    setError("");
  };

  const handleSubmit = () => {
    if (!selectedSubjects.length) {
      setError("Select at least one subject");
      return;
    }

    onSubmit({
      studentId: student.id,
      subjectIds: selectedSubjects,
    });
  };

  const handleClose = () => {
    setSelectedSubjects([]);
    setError("");
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Assign Subjects
        </Typography>

        <Typography variant="body2" mb={2}>
          Student:{" "}
          <strong>
            {student?.firstName} {student?.lastName}
          </strong>
        </Typography>

        <Stack spacing={2}>
          <FormControl fullWidth error={!!error}>
            <InputLabel>Subjects</InputLabel>
            <Select
              multiple
              value={selectedSubjects}
              onChange={handleChange}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((id) => {
                    const subject = subjects.find((s) => s.id === id);
                    return <Chip key={id} label={subject?.name || "Unknown"} />;
                  })}
                </Box>
              )}
            >
              {subjects?.map((subject) => (
                <MenuItem key={subject.id} value={subject.id}>
                  {subject.name}
                </MenuItem>
              ))}
            </Select>
            {error && <FormHelperText>{error}</FormHelperText>}
          </FormControl>
        </Stack>

        <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
          <Button onClick={handleClose} variant="outlined" disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {loading ? "Saving..." : "Assign"}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}

export default AssignStudentSubjectsModal;
