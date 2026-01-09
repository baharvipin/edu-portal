import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Stack,
} from "@mui/material";
import useFetch from "../hooks/useFetch";

export default function AssignModal({
  open,
  onClose,
  onSubmit,
  editData,
  schoolId,
}) {
  const [teacherId, setTeacherId] = useState("");
  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [errors, setErrors] = useState({});

  /* ---------------- FETCH DATA ---------------- */

  const { data: teachersRes } = useFetch(
    `/api/teachers/${schoolId}`,
    undefined,
    !!schoolId,
  );

  const { data: classesRes } = useFetch(
    `/api/classes/${schoolId}`,
    undefined,
    !!schoolId,
  );

  const { data: subjectsRes } = useFetch(
    `/api/subjects/${schoolId}`,
    undefined,
    !!schoolId,
  );

  const teachers = teachersRes?.teachers ?? [];
  const classes = classesRes?.classes ?? [];
  const subjects = subjectsRes?.subjects ?? [];

  //   console.log("classes in assign modal", classes);
  //   console.log("teachers in assign modal", teachers);
  //   console.log("subjects in assign modal", subjects);

  const selectedClass = classes?.find((c) => c.id === classId);

  /* ---------------- PREFILL EDIT ---------------- */

  useEffect(() => {
    console.log("editData in assign modal", editData);
    if (editData) {
      setTeacherId(editData?.teacherId);
      setClassId(editData?.class?.id);
      setSectionId(editData?.section?.id);
      setSubjectId(editData?.subject?.id);
    } else {
      resetForm();
    }
  }, [editData, open]);

  const resetForm = () => {
    setTeacherId("");
    setClassId("");
    setSectionId("");
    setSubjectId("");
    setErrors({});
  };

  /* ---------------- VALIDATION ---------------- */

  const validate = () => {
    const newErrors = {};

    if (!teacherId) newErrors.teacherId = "Teacher is required";
    if (!classId) newErrors.classId = "Class is required";
    if (!sectionId) newErrors.sectionId = "Section is required";
    if (!subjectId) newErrors.subjectId = "Subject is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSave = () => {
    if (!validate()) return;

    onSubmit({
      teacherId,
      classId,
      sectionId,
      subjectId,
    });
  };

  /* ---------------- UI ---------------- */

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {editData ? "Edit Teaching Assignment" : "Assign Teacher"}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          {/* Teacher */}
          <FormControl fullWidth error={!!errors.teacherId}>
            <InputLabel>Teacher</InputLabel>
            <Select
              value={teacherId}
              label="Teacher"
              onChange={(e) => {
                console.log("selected teacher id", e.target.value);
                setTeacherId(e.target.value);
              }}
            >
              {teachers.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.fullName}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.teacherId}</FormHelperText>
          </FormControl>

          {/* Class */}
          <FormControl fullWidth error={!!errors.classId}>
            <InputLabel>Class</InputLabel>
            <Select
              value={classId}
              label="Class"
              onChange={(e) => {
                setClassId(e.target.value);
                setSectionId("");
              }}
            >
              {classes.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.displayName}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.classId}</FormHelperText>
          </FormControl>

          {/* Section */}
          <FormControl fullWidth disabled={!classId} error={!!errors.sectionId}>
            <InputLabel>Section</InputLabel>
            <Select
              value={sectionId}
              label="Section"
              onChange={(e) => setSectionId(e.target.value)}
            >
              {selectedClass?.sections?.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.sectionId}</FormHelperText>
          </FormControl>

          {/* Subject */}
          <FormControl fullWidth error={!!errors.subjectId}>
            <InputLabel>Subject</InputLabel>
            <Select
              value={subjectId}
              label="Subject"
              onChange={(e) => setSubjectId(e.target.value)}
            >
              {subjects.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.subjectId}</FormHelperText>
          </FormControl>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          {editData ? "Update" : "Assign"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
