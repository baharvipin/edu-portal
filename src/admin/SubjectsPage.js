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
  const [selectedSubject, setSelectedSubject] = useState({});

  const [submitPayload, setSubmitPayload] = useState(null);
  const [submitPayloadEdit, setSubmitPayloadEdit] = useState(null);

  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [subjectsError, setSubjectsError] = useState(null);

  const token = localStorage.getItem("authToken");
  const tokenDetails = parseJwt(token);

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
    `/api/subjects/${selectedSubject.id}`,
    {
      method: "PUT",
      body: submitPayloadEdit,
    },
    submitPayloadEdit !== null,
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
      schoolId: tokenDetails.schoolId,
    };

    if (data.id) {
      payload.id = data.id;
      setSubmitPayloadEdit(payload);
    } else {
      setSubmitPayload(payload);
    }

    setOpen(false);
  };

  const handleEditClick = (subject) => {
    setSelectedSubject(subject);
    setOpen(true);
  };

  const handleDeleteSubject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?"))
      return;

    try {
      await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/subjects/${id}`, {
        method: "DELETE",
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
                    onClick={() => handleDeleteSubject(subject.id)}
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
      />
    </Box>
  );
}

export default SubjectsPage;
