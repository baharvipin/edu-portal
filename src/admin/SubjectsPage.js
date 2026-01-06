import React , {useEffect, useState}from "react";
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
import useFetch from "../hooks/useFetch";
import { parseJwt } from "../utility/commonTask";

function SubjectsPage() {
  const [open, setOpen] =  useState(false);
  const [subjects, setSubjects] = useState([]);

  const token = localStorage.getItem("authToken");
  const tokenDetails = parseJwt(token);

  const [submitPayload, setSubmitPayload] = useState(null);


const {
  data: subjectAddResponse,
  loading,
  error: subjectAddError,
} = useFetch(
  "/api/subjects/addSubject",
  {
    method: "POST",
    body: submitPayload,
  },
  submitPayload !== null
);

useEffect(() => {
  if (subjectAddResponse) {
    setSubjects([...subjects, subjectAddResponse])
    setSubmitPayload(null); // reset trigger
  }
}, [subjectAddResponse]);

useEffect(() => {
  if (subjectAddError) {
    setSubmitPayload(null);
  }
}, [subjectAddError]);


  const {
    data: subjectsResponse,
    loading: subjectsLoading,
    error: subjectsError,
  } = useFetch(`/api/subjects/${tokenDetails.schoolId}`,  {},
    !!tokenDetails?.schoolId);
  
    useEffect(() => {
      if(subjectsResponse) {
        console.log("hello subject res",subjectsResponse )
        setSubjects(subjectsResponse?.subjects ?? []);
      }
  
    }, [subjectsResponse])


  const handleAddSubject = (data) => {
    const payload = {
    name: data.name,
    code: data.code,
    schoolId: tokenDetails.schoolId
  };
    setSubmitPayload(payload);
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
            {subjects?.map((subject) => (
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
        {
          !subjects?.length && <h6>No recorde are found</h6>
        }
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
