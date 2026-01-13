import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddTeacherModal from "../components/AddTeacherModal";
import useFetch from "../hooks/useFetch";
import { parseJwt } from "../utility/commonTask";
import { showToast } from "../utility/toastService";

function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [submitPayload, setSubmitPayload] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [editTeacher, setEditTeacher] = useState(null);

  const token = localStorage.getItem("authToken");
  const tokenDetails = parseJwt(token);

  const {
    data: teachersResponse,
    loading: teachersLoading,
    error: teachersError,
  } = useFetch(
    `/api/teachers/${tokenDetails.schoolId}`,
    undefined,
    !!tokenDetails?.schoolId,
  );

  useEffect(() => {
    if (teachersResponse) {
      console.log("teacher res", teachersResponse);
      setTeachers(teachersResponse?.teachers ?? []);
    }
  }, [teachersResponse]);

  const {
    data: subjectsResponse,
    loading: subjectsLoading,
    error: subjectsError,
  } = useFetch(
    `/api/subjects/${tokenDetails.schoolId}`,
    {},
    !!tokenDetails?.schoolId,
  );

  useEffect(() => {
    if (subjectsResponse) {
      console.log("hello subject res", subjectsResponse);
      const subjectNames = subjectsResponse?.subjects?.map((s) => s.name);
      console.log("hello subject subjectNames", subjectNames);

      setSubjects(subjectNames ?? []);
    }
  }, [subjectsResponse]);

  const {
    data: addTeacherResponse,
    loading: addingTeacher,
    error: addTeacherError,
  } = useFetch(
    submitPayload?.mode === "edit"
      ? `/api/teachers/${submitPayload.teacherId}`
      : "/api/teachers/addTeacher",
    {
      method: submitPayload?.mode === "edit" ? "PUT" : "POST",
      body: submitPayload,
    },
    submitPayload !== null,
  );

  useEffect(() => {
    if (addTeacherResponse) {
      showToast(addTeacherResponse?.message || "Teacher saved", "success");
      if (submitPayload?.mode === "edit") {
        setTeachers((prev) =>
          prev.map((t) =>
            t.id === addTeacherResponse.teacher.id
              ? addTeacherResponse.teacher
              : t,
          ),
        );
      } else {
        setTeachers((prev) => [...prev, addTeacherResponse.teacher]);
      }

      setOpen(false);
      setEditTeacher(null);
      setSubmitPayload(null);
    }
  }, [addTeacherResponse]);

  const handleAddTeacher = (data) => {
    const payload = {
      fullName: data.name,
      phone: data.phone,
      email: data.email,
      subjects: data.subjects,
      schoolId: tokenDetails.schoolId,
    };

    if (editTeacher) {
      setSubmitPayload({
        ...payload,
        teacherId: editTeacher.id,
        mode: "edit",
      });
    } else {
      setSubmitPayload({
        ...payload,
        email: data.email,
      });
    }

    setOpen(false);
  };

  const handleEditTeacher = (teacher) => {
    console.log("hw", teacher);
    setEditTeacher(teacher);
    setOpen(true);
  };

  const updateTeacherStatus = (teacherId, isActive) => {
    setTeachers((prev) =>
      prev.map((t) => (t.id === teacherId ? { ...t, isActive } : t)),
    );
  };

  const handleActivateTeacher = async (teacher) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/teachers/activate/${teacher.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!data.status) {
        showToast(data?.message || "Activation failed", "error");
        throw new Error(data?.message || "Activation failed");
      }

      showToast(data?.message || "Teacher activated", "success");

      // 🔁 re-fetch teachers
      updateTeacherStatus(teacher.id, true);
    } catch (error) {
      console.error("Activate failed", error);
      showToast(error.message || "Activate failed", "error");
    }
  };

  const handleDeActivateTeacher = async (teacher) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/teachers/deactivate/${teacher.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!data.status) {
        showToast(data?.message || "Deactivate failed", "error");
        throw new Error(data?.message || "Deactivate failed");
      }

      showToast(data?.message || "Teacher deactivated", "success");

      // 🔁 re-fetch teachers
      updateTeacherStatus(teacher.id, false);
    } catch (error) {
      console.error("Deactivate failed", error);
      showToast(error.message || "Deactivate failed", "error");
    }
  };

  const TEACHER_STATUS = {
    true: "ACTIVE",
    false: "INACTIVE",
  };
  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 3, mt: 4 }}>
        <Stack direction="row" justifyContent="space-between" mb={3}>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Teacher Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Add, edit and assign teachers to subjects and classes
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
          >
            Add Teacher
          </Button>
        </Stack>

        {/* Teacher Table */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Subjects</TableCell>
              <TableCell>Active</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {teachers?.map((teacher) => (
              <TableRow key={teacher?.id}>
                <TableCell>{teacher?.fullName}</TableCell>
                <TableCell>{teacher?.email}</TableCell>
                <TableCell>{teacher?.phone}</TableCell>
                <TableCell>
                  {teacher?.subjects?.map((s) => (
                    <Chip
                      key={s?.subject?.id}
                      label={s?.subject?.name}
                      size="small"
                      sx={{ mr: 0.5 }}
                    />
                  ))}
                </TableCell>

                <TableCell>
                  <Chip
                    label={TEACHER_STATUS[teacher.isActive]}
                    color={
                      TEACHER_STATUS[teacher.isActive] === "ACTIVE"
                        ? "success"
                        : "default"
                    }
                    size="small"
                  />
                </TableCell>

                <TableCell align="right">
                  <Button
                    size="small"
                    onClick={() => handleEditTeacher(teacher)}
                  >
                    Edit
                  </Button>
                  {TEACHER_STATUS[teacher.isActive] === "ACTIVE" ? (
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDeActivateTeacher(teacher)}
                    >
                      Deactivate
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleActivateTeacher(teacher)}
                    >
                      Activate
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <AddTeacherModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleAddTeacher}
        subjects={subjects}
        editTeacher={editTeacher}
      />
    </Container>
  );
}

export default TeachersPage;
