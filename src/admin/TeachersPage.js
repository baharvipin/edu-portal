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
import AddTeacherModal from "./AddTeacherModal";
import useFetch from "../hooks/useFetch";
import { parseJwt } from "../utility/commonTask";
const mockTeachers = [
  {
    id: 1,
    name: "Raj Kumar",
    email: "raj@school.com",
    subjects: ["Math"],
    classes: ["8-A"],
    status: "ACTIVE",
  },
  {
    id: 2,
    name: "Anita Sharma",
    email: "anita@school.com",
    subjects: ["Science"],
    classes: ["7-B"],
    status: "INACTIVE",
  },
];

function TeachersPage() {
  const [teachers, setTeachers] = useState(mockTeachers);
  const [open, setOpen] = React.useState(false);
  const [submitPayload, setSubmitPayload] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const token = localStorage.getItem("authToken");
  const tokenDetails = parseJwt(token);

const {
  data: subjectsResponse,
  loading: subjectsLoading,
  error: subjectsError,
} = useFetch(`/subjects/${tokenDetails.schoolId}`,  {},
  !!tokenDetails?.schoolId);

  useEffect(() => {
    if(subjectsResponse) {
      console.log("hello subject res",subjectsResponse )
      setSubjects(subjectsResponse?.subjects ?? []);
    }

  }, [subjectsResponse])
const {
  data: addTeacherResponse,
  loading: addingTeacher,
  error: addTeacherError,
} = useFetch(
  "/api/teachers/addTeacher",
  {
    method: "POST",
    body: submitPayload,
  },
  submitPayload !== null // explicit & safe
);

  useEffect(() => {
    
  if (addTeacherResponse) {
    console.log("Teacher added:", addTeacherResponse);
    setOpen(false);
    setSubmitPayload(null);
  }
}, [addTeacherResponse]);

useEffect(() => {
  if (addTeacherError) {
    console.error(addTeacherError);
  }
}, [addTeacherError]);





  const handleAddTeacher = (data) => {
    const payload = {
    fullName: data.name,
    email: data.email,
    phone: data.phone,
    schoolId: tokenDetails.schoolId,
    subjects: data.subjects,
  };

  setSubmitPayload(payload);
  setOpen(false);
  };

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 3, mt: 4 }}>
        {/* Header */}
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
              <TableCell>Subjects</TableCell>
              <TableCell>Classes</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {teachers.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell>{teacher.name}</TableCell>
                <TableCell>{teacher.email}</TableCell>

                <TableCell>
                  {teacher.subjects.map((s) => (
                    <Chip key={s} label={s} size="small" sx={{ mr: 0.5 }} />
                  ))}
                </TableCell>

                <TableCell>
                  {teacher.classes.map((c) => (
                    <Chip key={c} label={c} size="small" sx={{ mr: 0.5 }} />
                  ))}
                </TableCell>

                <TableCell>
                  <Chip
                    label={teacher.status}
                    color={teacher.status === "ACTIVE" ? "success" : "default"}
                    size="small"
                  />
                </TableCell>

                <TableCell align="right">
                  <Button size="small">Edit</Button>
                  <Button size="small" color="error">
                    Deactivate
                  </Button>
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
      />
    </Container>
  );
}

export default TeachersPage;
