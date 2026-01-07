import React from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const data = [
  {
    className: "Class 1",
    students: [
      { id: "STU001", name: "Rahul Sharma", email: "rahul@gmail.com" },
      { id: "STU002", name: "Amit Verma", email: "amit@gmail.com" },
    ],
  },
  {
    className: "Class 2",
    students: [{ id: "STU003", name: "Neha Singh", email: "neha@gmail.com" }],
  },
  {
    className: "Class 3",
    students: [],
  },
];

function ClassWiseStudents() {
  return (
    <Box p={3}>
      <Typography variant="h6" fontWeight={700} mb={2}>
        Class-wise Students
      </Typography>

      {data.map((cls) => (
        <Accordion key={cls.className}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box
              display="flex"
              justifyContent="space-between"
              width="100%"
              alignItems="center"
            >
              <Typography fontWeight={600}>{cls.className}</Typography>

              <Chip
                label={`${cls.students.length} Students`}
                color={cls.students.length ? "primary" : "default"}
                size="small"
              />
            </Box>
          </AccordionSummary>

          <AccordionDetails>
            {cls.students.length === 0 ? (
              <Typography color="text.secondary">
                No students assigned to this class
              </Typography>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>ID</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Email</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cls.students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.id}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}

export default ClassWiseStudents;
