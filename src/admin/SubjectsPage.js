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
} from "@mui/material";
import AddSubjectModal from "../admin/AddSubjectModal";

function SubjectsPage() {
  const [open, setOpen] = React.useState(false);
  const [subjects, setSubjects] = React.useState([
    { id: 1, name: "Mathematics", code: "MATH" },
    { id: 2, name: "Science", code: "SCI" },
  ]);

  const handleAddSubject = (data) => {
    setSubjects((prev) => [...prev, { id: Date.now(), ...data }]);
    setOpen(false);
  };

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
                  <Button size="small">Edit</Button>
                  <Button size="small" color="error">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <AddSubjectModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleAddSubject}
      />
    </Box>
  );
}

export default SubjectsPage;
