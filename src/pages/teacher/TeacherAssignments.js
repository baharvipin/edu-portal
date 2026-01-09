import React, { useEffect, useState } from "react";
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
  Stack,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";

import AssignModal from "../../components/AssignModal";
import useFetch from "../../hooks/useFetch";
import { parseJwt } from "../../utility/commonTask";

export default function TeacherAssignments() {
  const token = localStorage.getItem("authToken");
  const tokenDetails = parseJwt(token);

  const schoolId = tokenDetails.schoolId;

  const [assignments, setAssignments] = useState([]);
  const [open, setOpen] = useState(false);
  const [editAssignment, setEditAssignment] = useState(null);
  const [submitPayload, setSubmitPayload] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  /* ---------------- FETCH ASSIGNMENTS ---------------- */

  const {
    data: assignmentsResponse,
    loading,
    error,
  } = useFetch(
    `/api/teachers/${schoolId}/teacher-assignments`,
    { refreshKey },
    !!schoolId,
  );

  useEffect(() => {
    if (assignmentsResponse) {
      setAssignments(assignmentsResponse ?? []);
    }
  }, [assignmentsResponse]);

  console.log("assignmentsResponse", assignmentsResponse);
  /* ---------------- CREATE / UPDATE ---------------- */

  // const { data: saveResponse, loading: saving } = useFetch(
  //   submitPayload?.mode === "edit"
  //     ? `/api/teachers/assignments/${submitPayload.assignmentId}`
  //     : `/api/teachers/${submitPayload?.teacherId}/assignments`,
  //   submitPayload
  //     ? {
  //         method: submitPayload.mode === "edit" ? "PUT" : "POST",
  //         body: submitPayload,
  //       }
  //     : null,
  //   submitPayload !== null,
  // );

  const METHOD_MODE= {
    EDIT: "edit",
    DELETE: "delete",
    CREATE: "create",
  };

  const { data: saveResponse, loading: saving } = useFetch(
    submitPayload?.mode === "edit"
      ? `/api/teachers/assignments/${submitPayload.assignmentId}`
      : submitPayload?.mode === "delete"
        ? `/api/teachers/assignments/delete/${submitPayload.assignmentId}`
        : `/api/teachers/${submitPayload?.teacherId}/assignments`,
    submitPayload
      ? {
          method:
            submitPayload.mode === "edit"
              ? "PUT"
              : submitPayload.mode === "delete"
                ? "DELETE"
                : "POST",
          body: submitPayload.mode === "delete" ? null : submitPayload,
        }
      : null,
    submitPayload !== null,
  );

  useEffect(() => {
    if (saveResponse) {
      setRefreshKey((prev) => prev + 1);
      setOpen(false);
      setEditAssignment(null);
      setSubmitPayload(null);
    }
  }, [saveResponse]);

  /* ---------------- HANDLERS ---------------- */

  const handleAdd = () => {
    setEditAssignment(null);
    setOpen(true);
  };

  const handleEdit = (assignment) => {
    setEditAssignment(assignment);
    setOpen(true);
  };

  const handleSubmit = (data) => {
    const payload = {
      teacherId: data.teacherId,
      schoolId,
      classId: data.classId,
      sectionId: data.sectionId,
      subjectId: data.subjectId,
    };

    if (editAssignment) {
      setSubmitPayload({
        ...payload,
        assignmentId: editAssignment.id,
        mode: "edit",
      });
    } else {
      setSubmitPayload(payload);
    }
  };

  const handleDelete = (assignmentId) => {
    if (!window.confirm("Are you sure you want to delete this assignment?"))
      return;

    setSubmitPayload({
      assignmentId,
      mode: "delete",
    });
  };

  const flattenedAssignments = assignments.flatMap((item) =>
    item.teacher.assignments.map((a) => ({
      id: a.id,
      teacherId: item.teacher.id,
      teacherName: item.teacher.fullName,
      class: a.class,
      section: a.section,
      subject: a.subject,
      isActive: true, // or from API
    })),
  );

  console.log("flattenedAssignments", flattenedAssignments);
  /* ---------------- UI ---------------- */

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 3, mt: 4 }}>
        <Stack direction="row" justifyContent="space-between" mb={3}>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Teaching Assignments
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Assign classes, sections and subjects to teacher
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
          >
            Assign
          </Button>
        </Stack>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Teacher</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Section</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {flattenedAssignments.map((a) => (
              <TableRow key={a.id}>
                <TableCell>{a.teacherName}</TableCell>
                <TableCell>{a.class.name}</TableCell>
                <TableCell>{a.section.name}</TableCell>
                <TableCell>{a.subject.name}</TableCell>
                <TableCell>
                  <Chip
                    label={a.isActive ? "ACTIVE" : "INACTIVE"}
                    color={a.isActive ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleEdit(a)}
                    >
                      Edit
                    </Button>

                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDelete(a.id)}
                    >
                      Delete
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}

            {!flattenedAssignments.length && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No assignments found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* -------- MODAL -------- */}
      <AssignModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
        editData={editAssignment}
        schoolId={schoolId}
      />
    </Container>
  );
}
