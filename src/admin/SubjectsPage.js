import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import AddSubjectModal from "../components/AddSubjectModal";
import useFetch from "../hooks/useFetch";
import { parseJwt } from "../utility/commonTask";

function SubjectsPage() {
  const [open, setOpen] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const [submitPayload, setSubmitPayload] = useState(null);
  const [submitPayloadEdit, setSubmitPayloadEdit] = useState(null);

  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [subjectsError, setSubjectsError] = useState(null);
const [classes, setClasses] = useState([]);
const [refreshStudents, setRefreshStudents] = useState(true);
  const token = localStorage.getItem("authToken");
  const tokenDetails = parseJwt(token);


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

  /* =======================
     ADD SUBJECT
  ======================= */

  const { data: subjectAddResponse } = useFetch(
    "/api/subjects/addSubject",
    {
      method: "POST",
      body: submitPayload,
    },
    submitPayload !== null,
  );

  useEffect(() => {
    if (!subjectAddResponse) return;

    const handleAdd = async () => {
      await fetchAllSubjects();
      setSubmitPayload(null);
    };

    handleAdd();
  }, [subjectAddResponse]);

  /* =======================
     EDIT SUBJECT
  ======================= */

  const { data: subjectEditResponse } = useFetch(
    `/api/subjects/${selectedSubject?.id}`,
    {
      method: "PUT",
      body: submitPayloadEdit,
    },
     !!submitPayloadEdit && !!selectedSubject?.id
  );

  useEffect(() => {
    if (!subjectEditResponse) return;

    const handleEdit = async () => {
      await fetchAllSubjects();
      setSubmitPayloadEdit(null);
      setSelectedSubject({});
    };

    handleEdit();
  }, [subjectEditResponse]);

  /* =======================
     FETCH ALL SUBJECTS
  ======================= */

  const fetchAllSubjects = async () => {
    try {
      setSubjectsLoading(true);
      setSubjectsError(null);

      const token = localStorage.getItem("authToken");
// /api/classes/${tokenDetails.schoolId}
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
    } finally {
      setSubjectsLoading(false);
    }
  };

  useEffect(() => {
    if (tokenDetails?.schoolId) {
      fetchAllSubjects();
    }
  }, [tokenDetails?.schoolId]);

  /* =======================
     HANDLERS
  ======================= */

  const handleAddSubject = (data) => {
  const payload = {
    name: data.name,
    code: data.code,
    classId: data.classId,
    sectionId: data.sectionId,
    schoolId: tokenDetails.schoolId,
  };

  if (data.id) {
    // ✅ UPDATE
    setSubmitPayloadEdit(payload);
    setSelectedSubject({ id: data.id }); // keep id
  } else {
    // ✅ CREATE
    setSubmitPayload(payload);
  }

  setOpen(false);
};


  const handleEditClick = (subject) => {
    console.log("edit", subject);
    setSelectedSubject(subject);
    setOpen(true);
  };

  const handleDeleteSubject = async (subject) => {
    if (!window.confirm("Are you sure you want to delete this subject?"))
      return;

    try {
      await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/subjects/${subject.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: true, schoolId: tokenDetails.schoolId,  }),
      });

      fetchAllSubjects();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  /* =======================
     RENDER
  ======================= */

  return (
    <Box p={3}>
      <Paper elevation={4} sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="h6" fontWeight={700}>
            Subject Management
          </Typography>

          <Button variant="contained" onClick={() => setOpen(true)}>
            Add Subject
          </Button>
        </Box>

        {subjectsLoading && <p>Loading...</p>}
        {subjectsError && <p style={{ color: "red" }}>{subjectsError}</p>}

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Subject Name</strong>
              </TableCell>
              <TableCell>
                <strong>Code</strong>
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {subjects.map((subject) => (
              <TableRow key={subject.id}>
                <TableCell>{subject.name}</TableCell>
                <TableCell>{subject.code}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => handleEditClick(subject)}>
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDeleteSubject(subject)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {!subjects.length && !subjectsLoading && (
          <Typography mt={2}>No records found</Typography>
        )}
      </Paper>

      <AddSubjectModal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        onSubmit={handleAddSubject}
        selectedSubject={selectedSubject}
        classes={classes}
      />
    </Box>
  );
}

export default SubjectsPage;
