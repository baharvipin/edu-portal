import React, { useState, useEffect, Fragment } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
} from "@mui/material";
import AddStudentModal from "../admin/AddStudentModal";
import useFetch from "../hooks/useFetch";
import { parseJwt } from "../utility/commonTask";

function StudentsPage() {
  const [editStudent, setEditStudent] = useState(null);
  const [refreshStudents, setRefreshStudents] = useState(true);
  const [deleteStudentId, setDeleteStudentId] = useState(null);
  const [activateStudentId, setActivateStudentId] = useState(null);

  const [open, setOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState("All");
  const [classes, setClasses] = useState([]);

  const [students, setStudents] = React.useState([]);

  const token = localStorage.getItem("authToken");
  const tokenDetails = parseJwt(token);

  const { data: activateRes } = useFetch(
    activateStudentId ? `/api/students/${activateStudentId}/activate` : null,
    { method: "PUT" },
    !!activateStudentId,
  );

  useEffect(() => {
    if (activateRes) {
      setActivateStudentId(null);
      setRefreshStudents(true); // triggers refetch
    }
  }, [activateRes]);

  const { data: deleteRes } = useFetch(
    deleteStudentId ? `/api/students/${deleteStudentId}/delete` : null,
    { method: "PUT" },
    !!deleteStudentId,
  );

  useEffect(() => {
    if (deleteRes) {
      setDeleteStudentId(null);
      setRefreshStudents(true); // 🔥 refetch classes + students
    }
  }, [deleteRes]);

  /** Fetch classes */
  const { data: classRes } = useFetch(
    `/api/classes/${tokenDetails.schoolId}`,
    {},
    !!tokenDetails?.schoolId && refreshStudents,
  );

  useEffect(() => {
    if (classRes) {
      setClasses(classRes.classes ?? []);
      setRefreshStudents(false); // stop refetch
    }
  }, [classRes]);

  // const filteredStudents =
  //   selectedClass === "All"
  //     ? students
  //     : students.filter((s) => s.class === selectedClass);

  // const handleAddStudent = (data) => {
  //   setStudents((prev) => [
  //     ...prev,
  //     {
  //       id: `STU${Date.now().toString().slice(-4)}`,
  //       ...data,
  //     },
  //   ]);
  //   setOpen(false);
  // };

  // console.log("editStudent", editStudent)
  return (
    <Box p={3}>
      <Paper elevation={4} sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="h6" fontWeight={700}>
            Student Management
          </Typography>

          <Button variant="contained" onClick={() => setOpen(true)}>
            Add Student
          </Button>
        </Box>

        {/* Class Filter */}
        {/* <Box mb={2} display="flex" alignItems="center" gap={2}>
          <Typography variant="body2">Filter by Class:</Typography>
          <Select
            size="small"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            {classes.map((cls) => (
              <MenuItem key={cls.id} value={cls?.name}>
                {cls?.displayName}
              </MenuItem>
            ))}
          </Select>
        </Box> */}

        {/* Student Table */}
        {classes.map((c) => {
          return (
            <Fragment key={c.id}>
              {c.students.length ? (
                <Fragment>
                  <Typography variant="h6" fontWeight={700}>
                    {c.displayName}
                  </Typography>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <strong>Student ID</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Name</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Class</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Email</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Actions</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {c.students.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>{student.id}</TableCell>
                          <TableCell>
                            {student.firstName + student.lastName}
                          </TableCell>
                          <TableCell>{student.class}</TableCell>
                          <TableCell>{student.email}</TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              onClick={() => setEditStudent(student)}
                            >
                              Edit
                            </Button>

                            {student.isActive ? (
                              <Button
                                size="small"
                                color="error"
                                onClick={() => setDeleteStudentId(student.id)}
                              >
                                Remove
                              </Button>
                            ) : (
                              <Button
                                size="small"
                                color="success"
                                onClick={() => setActivateStudentId(student.id)}
                              >
                                Activate
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Fragment>
              ) : null}
            </Fragment>
          );
        })}
      </Paper>

      {/* <AddStudentModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleAddStudent}
      /> */}
      <AddStudentModal
        open={open || !!editStudent}
        student={editStudent}
        onClose={() => {
          setOpen(false);
          setEditStudent(null);
        }}
        onSuccess={() => {
          setRefreshStudents(true); //  refetch from API
        }}
      />
    </Box>
  );
}

export default StudentsPage;
