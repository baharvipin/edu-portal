// SuperAdminDashboard.jsx
import React, { useState, useEffect } from 'react';
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
} from '@mui/material'; 

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

function SuperAdminDashboard() {
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Fetch pending school profiles
    // fetch
    //   .get('/api/schools/pending') // Backend API: returns schools with status PROFILE_SUBMITTED
    //   .then((res) => setSchools(res.data))
    //   .catch((err) => console.error(err));
  }, []);

  const handleView = (school) => {
    setSelectedSchool(school);
    setModalOpen(true);
  };

  const handleClose = () => {
    setSelectedSchool(null);
    setModalOpen(false);
  };

  const handleApprove = async (schoolId) => {
    try {
      await fetch.post(`/api/schools/${schoolId}/approve`);
      setSchools(schools.filter((s) => s.id !== schoolId));
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (schoolId) => {
    try {
      await fetch.post(`/api/schools/${schoolId}/reject`);
      setSchools(schools.filter((s) => s.id !== schoolId));
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Superadmin Dashboard
      </Typography>

      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6">Pending School Registrations</Typography>
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
              {schools.map((school) => (
                <TableRow key={school.id}>
                  <TableCell>{school.name}</TableCell>
                  <TableCell>{school.city}</TableCell>
                  <TableCell>{school.board}</TableCell>
                  <TableCell>{new Date(school.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button variant="outlined" size="small" onClick={() => handleView(school)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
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
                <Typography><strong>Address:</strong> {selectedSchool.fullAddress}</Typography>
                <Typography><strong>Registration Number:</strong> {selectedSchool.registrationNumber}</Typography>
                <Typography><strong>Medium:</strong> {selectedSchool.medium}</Typography>
                <Typography><strong>Year Established:</strong> {selectedSchool.yearEstablished}</Typography>
                <Typography><strong>Academic Year:</strong> {selectedSchool.academicYear}</Typography>
                <Typography><strong>School Timings:</strong> {selectedSchool.schoolTimings}</Typography>
                <Typography><strong>Grading System:</strong> {selectedSchool.gradingSystem}</Typography>
                <Typography><strong>Attendance Mode:</strong> {selectedSchool.attendanceMode}</Typography>
                <Typography><strong>Notification Mode:</strong> {selectedSchool.notificationMode}</Typography>
                <Typography><strong>Modules:</strong> Exams({selectedSchool.examsModuleEnabled ? 'Yes' : 'No'}), Homework({selectedSchool.homeworkModuleEnabled ? 'Yes' : 'No'})</Typography>
              </Stack>

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="contained" color="success" onClick={() => handleApprove(selectedSchool.id)}>
                  Approve
                </Button>
                <Button variant="outlined" color="error" onClick={() => handleReject(selectedSchool.id)}>
                  Reject
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
