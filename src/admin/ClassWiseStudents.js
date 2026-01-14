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
import AddSectionModal from "../components/AddSectionModal"; // New
import useFetch from "../hooks/useFetch";
import { parseJwt } from "../utility/commonTask";

function ClassWiseStudents() {
  const [classes, setClasses] = useState([]);
  const [_sections, _setSections] = useState([]);
  const [openClass, setOpenClass] = useState(false);
  const [openSection, setOpenSection] = useState(false);

  const [classPayload, setClassPayload] = useState(null);
  const [sectionPayload, setSectionPayload] = useState(null);

  const token = localStorage.getItem("authToken");
  const tokenDetails = parseJwt(token);

  /** Fetch classes */
  const { data: classRes } = useFetch(
    `/api/classes/${tokenDetails.schoolId}`,
    {},
    !!tokenDetails?.schoolId,
  );

  useEffect(() => {
    if (classRes) {
      setClasses(classRes.classes ?? []);
    }
  }, [classRes]);

  /** Add Class API */
  const { data: addClassRes } = useFetch(
    `/api/classes/addclasses/${tokenDetails.schoolId}`,
    {
      method: "POST",
      body: classPayload,
    },
    classPayload !== null,
  );

  useEffect(() => {
    if (addClassRes) {
      setClasses((prev) => [...prev, addClassRes.class]);
      setOpenClass(false);
      setClassPayload(null);
    }
  }, [addClassRes]);

  const handleAddClass = (data) => {
    setClassPayload({
      ...data,
      schoolId: tokenDetails.schoolId,
    });
  };

  /** Add Section API */
  const { data: addSectionRes } = useFetch(
    `/api/sections`,
    {
      method: "POST",
      body: sectionPayload,
    },
    sectionPayload !== null,
  );

  useEffect(() => {
    if (addSectionRes) {
      setClasses((prev) =>
        prev.map((cls) =>
          cls.id === addSectionRes.section.classId
            ? {
                ...cls,
                sections: [...(cls.sections || []), addSectionRes.section],
              }
            : cls,
        ),
      );

      setOpenSection(false);
      setSectionPayload(null);
    }
  }, [addSectionRes]);

  const handleAddSection = (data) => {
    setSectionPayload({
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

        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenSection(true)}
          >
            Add Section
          </Button>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenClass(true)}
          >
            Add Class
          </Button>
        </Box>
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
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cls.students.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>{s.firstName + s.lastName}</TableCell>
                      <TableCell>{s.email}</TableCell>
                      <TableCell>{s.phone}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {/* Sections inside the class */}
            {cls.sections?.length > 0 && (
              <Box mt={2}>
                <Typography variant="subtitle2">Sections:</Typography>
                <Box display="flex" gap={1} mt={1}>
                  {cls.sections.map((sec) => (
                    <Chip
                      key={sec.id}
                      label={sec.name}
                      color="primary"
                      size="small"
                    />
                  ))}
                </Box>
              </Box>
            )}
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Modals */}
      <AddClassModal
        open={openClass}
        onClose={() => setOpenClass(false)}
        onSubmit={handleAddClass}
      />

      <AddSectionModal
        open={openSection}
        onClose={() => setOpenSection(false)}
        onSubmit={handleAddSection}
        classes={classes}
      />
    </Box>
  );
}

export default ClassWiseStudents;
