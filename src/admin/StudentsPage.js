import React from "react";
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

function StudentsPage() {
  const [open, setOpen] = React.useState(false);
  const [selectedClass, setSelectedClass] = React.useState("All");

  const classes = ["All", "Class 1", "Class 2", "Class 3"];

  const [students, setStudents] = React.useState([
    {
      id: "STU001",
      name: "Rahul Sharma",
      class: "Class 1",
      email: "rahul@gmail.com",
    },
    {
      id: "STU002",
      name: "Anjali Verma",
      class: "Class 2",
      email: "anjali@gmail.com",
    },
  ]);

  const filteredStudents =
    selectedClass === "All"
      ? students
      : students.filter((s) => s.class === selectedClass);

  const handleAddStudent = (data) => {
    setStudents((prev) => [
      ...prev,
      {
        id: `STU${Date.now().toString().slice(-4)}`,
        ...data,
      },
    ]);
    setOpen(false);
  };

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
        <Box mb={2} display="flex" alignItems="center" gap={2}>
          <Typography variant="body2">Filter by Class:</Typography>
          <Select
            size="small"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            {classes.map((cls) => (
              <MenuItem key={cls} value={cls}>
                {cls}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {/* Student Table */}
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
            {filteredStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.id}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.class}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>
                  <Button size="small">Edit</Button>
                  <Button size="small" color="error">
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <AddStudentModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleAddStudent}
      />
    </Box>
  );
}

export default StudentsPage;
