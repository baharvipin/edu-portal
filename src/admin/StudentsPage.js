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
import AddStudentModal from "../components/AddStudentModal";
import useFetch from "../hooks/useFetch";
import { parseJwt } from "../utility/commonTask";
import BulkStudentUpload from "../components/BulkStudentUpload";
import AssignStudentSubjectsModal from "../components/AssignStudentSubjectsModal";
import { showToast } from "../utility/toastService";

function StudentsPage() {
  const [openSubject, setOpenSubject] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [refreshStudents, setRefreshStudents] = useState(true);
  const [deleteStudentId, setDeleteStudentId] = useState(null);
  const [activateStudentId, setActivateStudentId] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState("All");
  const [classes, setClasses] = useState([]);

  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [subjectsError, setSubjectsError] = useState(null);

  const [subjects, setSubjects] = React.useState([]);

  const token = localStorage.getItem("authToken");
  const tokenDetails = parseJwt(token);

  /* =======================
       FETCH ALL SUBJECTS
    ======================= */

  const fetchAllSubjects = async () => {
    try {
      setSubjectsLoading(true);
      setSubjectsError(null);

      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/subjects/${tokenDetails.schoolId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch subjects");
      }

      setSubjects(result?.subjects ?? []);
    } catch (err) {
      setSubjectsError(err.message);
      showToast(err.message || "Failed to fetch subjects", "error");
    } finally {
      setSubjectsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllSubjects();
  }, []);

  const { data: activateRes, error: activateError } = useFetch(
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

  useEffect(() => {
    if (activateRes) {
      showToast(activateRes?.message || "Student activated", "success");
    }
    if (activateError) {
      showToast(activateError || "Activation failed", "error");
    }
  }, [activateRes, activateError]);

  const { data: deleteRes, error: deleteError } = useFetch(
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

  useEffect(() => {
    if (deleteRes) {
      showToast(deleteRes?.message || "Student removed", "success");
    }
    if (deleteError) {
      showToast(deleteError || "Remove failed", "error");
    }
  }, [deleteRes, deleteError]);

  /** Fetch classes */
  const { data: classRes, error: classError } = useFetch(
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

  useEffect(() => {
    if (classError) {
      showToast(classError || "Failed to fetch classes", "error");
    }
  }, [classError]);

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

  const refetchStudents = () => {
    setRefreshStudents(true); //  refetch from API
  };
  const getSectionName = (sections, sectionId) => {
    const section = sections.find((sec) => sec.id === sectionId);
    return section ? section.name : "";
  };

  // 3️⃣ Open modal
  const handleOpenAssign = (student) => {
    setSelectedStudent(student);
    setOpenSubject(true);
  };

  const handleAssignSubjects = async ({ studentId, subjectIds }) => {
    try {
      setSaving(true);

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/subjects/assign-subjects`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            schoolId: tokenDetails.schoolId,
            studentId,
            subjectIds,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        showToast(result?.message || "Failed to assign subjects", "error");
        throw new Error(result?.message || "Failed to assign subjects");
      }

      showToast(result?.message || "Subjects assigned", "success");
      setOpen(false);
      setSelectedStudent(null);
      setRefreshStudents(true); //  refetch from API
      // 🔁 Refresh students list
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Assign subjects error:", error);
      showToast(error.message || "Assign subjects failed", "error");
    } finally {
      setSaving(false);
      setOpenSubject(false);
    }
  };

  function concatStudentSubjects(studentSubjects = []) {
    if (!Array.isArray(studentSubjects) || studentSubjects.length === 0) {
      return "";
    }

    return studentSubjects
      .map((ss) => ss.subject?.name) // History, Mathematics, Physics
      .join(", ");
  }

  return (
    <Box p={3}>
      <BulkStudentUpload
        schoolId={tokenDetails?.schoolId}
        onSuccess={() => refetchStudents()} // optional
      />
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
                          <strong>Name</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Class</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Section</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Email</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Subjects</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Actions</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {c.students.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>
                            {student.firstName + student.lastName}
                          </TableCell>
                          <TableCell>
                            {c.id == student.classId ? c.displayName : ""}
                          </TableCell>
                          <TableCell>
                            {getSectionName(c.sections, student.sectionId)}
                          </TableCell>
                          <TableCell>{student.email}</TableCell>
                          <TableCell>
                            {concatStudentSubjects(student.studentSubjects)}
                          </TableCell>
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

                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleOpenAssign(student)}
                            >
                              Assign Subjects
                            </Button>
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

      <AssignStudentSubjectsModal
        open={openSubject}
        onClose={() => setOpenSubject(false)}
        onSubmit={handleAssignSubjects}
        loading={saving}
        student={selectedStudent}
        subjects={subjects}
      />
    </Box>
  );
}

export default StudentsPage;
