// SuperAdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Modal,
  Stack,
} from "@mui/material";
import { showToast } from "../utility/toastService";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const token = localStorage.getItem("authToken"); // SUPER_ADMIN JWT
        // const user = parseJwt(token);

        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/superadmin/schools`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(errText || "Failed to fetch schools");
        }

        const result = await response.json();
        setSchools(result.data); // backend returns { count, data }
      } catch (err) {
        console.error(err);
        setError("Unable to load schools");
        showToast(err.message || "Unable to load schools", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, []);

  const handleAction = (school) => {
    if (school.status !== "ACTIVE" && school.status !== "PROFILE_SUBMITTED") {
      showToast(
        "School admin has not completed school profile, once they will complete the profile, you will be able to perform action.",
        "error",
      );
      return;
    }

    setSelectedSchool(school);
    setModalOpen(true);
  };

  const handleView = (school) => {
    navigate(`/superadmin/school/${school?.id}`, { replace: true });
  };

  const handleClose = () => {
    setSelectedSchool(null);
    setModalOpen(false);
  };

  const handleApprove = async (schoolId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken"); // SUPER_ADMIN JWT
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/superadmin/schools/${schoolId}/approve`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();

      if (!response.ok) {
        showToast(
          data.message || "Approval failed. Please try again.",
          "error",
        );
        throw new Error(data.message || "Approval failed. Please try again.");
      }

      const updatedSchools = schools.map((s) =>
        s.id === schoolId ? { ...s, status: "ACTIVE" } : s,
      );
      setSchools(updatedSchools);
      handleClose();
      showToast(data.message || "School approved", "success");
    } catch (err) {
      console.error(err);
      showToast(err.message || "Approve failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (schoolId) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("authToken");

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/superadmin/schools/${schoolId}/reject`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            reason: "Incomplete or invalid school details", // optional
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        showToast(data.message || "Reject failed", "error");
        throw new Error(data.message || "Reject failed");
      }

      // Update UI state
      setSchools((prev) =>
        prev.map((s) => (s.id === schoolId ? { ...s, status: "REJECTED" } : s)),
      );

      handleClose();
      showToast(data.message || "School rejected", "success");
    } catch (err) {
      console.error("Reject error:", err.message);
      showToast(err.message || "Reject failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async (schoolId) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("authToken");

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/superadmin/schools/${schoolId}/suspend`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            reason: "Policy violation", // optional
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        showToast(data.message || "Suspend failed", "error");
        throw new Error(data.message || "Suspend failed");
      }

      setSchools((prev) =>
        prev.map((s) =>
          s.id === schoolId ? { ...s, status: "SUSPENDED" } : s,
        ),
      );

      handleClose();
      showToast(data.message || "School suspended", "success");
    } catch (err) {
      console.error("Suspend error:", err.message);
      showToast(err.message || "Suspend failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (schoolId) => {
    try {
      setLoading(true); // optional, if you have a loading state

      const token = localStorage.getItem("authToken"); // SUPER_ADMIN JWT

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/superadmin/schools/${schoolId}/deactivate`,
        {
          method: "PATCH", // PATCH is correct for updating status
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        showToast(
          data.message || "Deactivation failed. Please try again.",
          "error",
        );
        throw new Error(
          data.message || "Deactivation failed. Please try again.",
        );
      }

      // Update local state
      const updatedSchools = schools.map((s) =>
        s.id === schoolId ? { ...s, status: "INACTIVE" } : s,
      );
      setSchools(updatedSchools);

      handleClose(); // close modal
      showToast(data.message || "School deactivated", "success");
    } catch (err) {
      console.error(err);
      alert(
        err.message || "Something went wrong while deactivating the school.",
      );
      showToast(err.message || "Deactivation failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const actionsByStatus = {
    PROFILE_SUBMITTED: ["APPROVE", "REJECT"],
    PROFILE_INCOMPLETE: ["APPROVE", "REJECT"],
    ACTIVE: ["SUSPEND", "DEACTIVATE"],
    SUSPENDED: ["ACTIVATE", "DEACTIVATE"],
    INACTIVE: ["ACTIVATE"],
  };

  const getAllowedActions = (status) => actionsByStatus[status] ?? [];

  // const getAllowedActions = (status) => {

  //   switch (status) {
  //     case "PROFILE_SUBMITTED":
  //     case "PROFILE_INCOMPLETE":
  //       return ["APPROVE", "REJECT"];

  //     case "ACTIVE":
  //       return ["SUSPEND", "DEACTIVATE"];

  //     case "INACTIVE":
  //       return ["ACTIVATE"];

  //     case "SUSPENDED":
  //       return ["REACTIVATE"];

  //     default:
  //       return [];
  //   }
  // };

  if (loading) return <p>Loading schools...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Superadmin Dashboard
      </Typography>

      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          School Registrations List
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>School Name</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Board</TableCell>
                <TableCell>Submitted On</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {schools.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Typography variant="h6" color="text.secondary">
                      🏫 No schools registered yet
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Once schools submit registrations, they will appear here.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                schools.map((school) => (
                  <TableRow key={school.id}>
                    <TableCell>{school.name}</TableCell>
                    <TableCell>{school.city}</TableCell>
                    <TableCell>{school.board}</TableCell>
                    <TableCell>
                      {new Date(school.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={() => handleAction(school)}
                      >
                        Action
                      </Button>

                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleView(school)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Modal open={modalOpen} onClose={handleClose}>
        <Box sx={modalStyle}>
          {selectedSchool && (
            <>
              <Typography variant="h6" mb={2}>
                {selectedSchool.name} - Profile
              </Typography>

              <Stack spacing={1} mb={2}>
                <Typography>
                  <strong>Address:</strong>{" "}
                  {selectedSchool?.profile?.fullAddress ?? ""}
                </Typography>
                <Typography>
                  <strong>Registration Number:</strong>{" "}
                  {selectedSchool?.profile?.registrationNumber ?? ""}
                </Typography>
                <Typography>
                  <strong>Medium:</strong>{" "}
                  {selectedSchool?.profile?.medium ?? ""}
                </Typography>
                <Typography>
                  <strong>Year Established:</strong>{" "}
                  {selectedSchool?.profile?.yearEstablished ?? ""}
                </Typography>
                <Typography>
                  <strong>Academic Year:</strong>{" "}
                  {selectedSchool?.profile?.academicYear ?? ""}
                </Typography>
                <Typography>
                  <strong>School Timings:</strong>{" "}
                  {selectedSchool?.profile?.schoolTimings ?? ""}
                </Typography>
                <Typography>
                  <strong>Grading System:</strong>{" "}
                  {selectedSchool?.profile?.gradingSystem ?? ""}
                </Typography>
                <Typography>
                  <strong>Attendance Mode:</strong>{" "}
                  {selectedSchool?.profile?.attendanceMode ?? ""}
                </Typography>
                <Typography>
                  <strong>Notification Mode:</strong>{" "}
                  {selectedSchool?.profile?.notificationMode ?? ""}
                </Typography>
                <Typography>
                  <strong>Modules:</strong> Exams(
                  {selectedSchool?.profile?.examsModuleEnabled ? "Yes" : "No"}),
                  Homework(
                  {selectedSchool?.profile?.homeworkModuleEnabled
                    ? "Yes"
                    : "No"}
                  )
                </Typography>
              </Stack>

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                {getAllowedActions(selectedSchool.status).includes(
                  "APPROVE",
                ) && (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleApprove(selectedSchool.id)}
                  >
                    Approve
                  </Button>
                )}

                {getAllowedActions(selectedSchool.status).includes(
                  "REJECT",
                ) && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleReject(selectedSchool.id)}
                  >
                    Reject
                  </Button>
                )}

                {getAllowedActions(selectedSchool.status).includes(
                  "SUSPEND",
                ) && (
                  <Button
                    variant="outlined"
                    color="warning"
                    onClick={() => handleSuspend(selectedSchool.id)}
                  >
                    Suspend
                  </Button>
                )}

                {getAllowedActions(selectedSchool.status).includes(
                  "DEACTIVATE",
                ) && (
                  <Button
                    variant="outlined"
                    onClick={() => handleDeactivate(selectedSchool.id)}
                  >
                    Deactivate
                  </Button>
                )}

                {getAllowedActions(selectedSchool.status).includes(
                  "ACTIVATE",
                ) && (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleApprove(selectedSchool.id)}
                  >
                    Approve
                  </Button>
                )}

                {getAllowedActions(selectedSchool.status).includes(
                  "REACTIVATE",
                ) && (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleApprove(selectedSchool.id)}
                  >
                    Re-Approve
                  </Button>
                )}

                <Button variant="text" onClick={handleClose}>
                  Close
                </Button>
              </Stack>
            </>
          )}
        </Box>
      </Modal>
    </Container>
  );
}

export default SuperAdminDashboard;
