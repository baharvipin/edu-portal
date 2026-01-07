import React, { useEffect, useState } from "react";
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
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import AddClassModal from "../components/AddClassModal";
import useFetch from "../hooks/useFetch";
import { parseJwt } from "../utility/commonTask";

function ClassWiseStudents() {
  const [classes, setClasses] = useState([]);
  const [open, setOpen] = useState(false);
  const [submitPayload, setSubmitPayload] = useState(null);

  const token = localStorage.getItem("authToken");
  const tokenDetails = parseJwt(token);

  /** Fetch classes */
  const { data: classRes } = useFetch(
    `/api/classes/${tokenDetails.schoolId}`,
    {},
    !!tokenDetails?.schoolId
  );

  useEffect(() => {
    if (classRes) {
      setClasses(classRes.classes ?? []);
    }
  }, [classRes]);

  /** Add class */
  const { data: addClassRes } = useFetch(
    `/api/classes/addclasses/${tokenDetails?.schoolId}`,
    {
      method: "POST",
      body: submitPayload,
    },
    submitPayload !== null
  );

  useEffect(() => {
    if (addClassRes) {
      setClasses((prev) => [...prev, addClassRes.class]);
      setOpen(false);
      setSubmitPayload(null);
    }
  }, [addClassRes]);

  const handleAddClass = (data) => {
    setSubmitPayload({
      ...data,
      schoolId: tokenDetails.schoolId,
    });
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h6" fontWeight={700}>
          Class-wise Students
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Add Class
        </Button>
      </Box>

      {classes.map((cls) => (
        <Accordion key={cls.id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box display="flex" justifyContent="space-between" width="100%">
              <Typography fontWeight={600}>
                {cls.displayName ?? cls.name}
              </Typography>

              <Chip
                label={`${cls.students?.length ?? 0} Students`}
                size="small"
              />
            </Box>
          </AccordionSummary>

          <AccordionDetails>
            {!cls.students?.length ? (
              <Typography color="text.secondary">
                No students assigned to this class
              </Typography>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cls.students.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>{s.id}</TableCell>
                      <TableCell>{s.fullName}</TableCell>
                      <TableCell>{s.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </AccordionDetails>
        </Accordion>
      ))}

      <AddClassModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleAddClass}
      />
    </Box>
  );
}

export default ClassWiseStudents;
