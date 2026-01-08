import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom"
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import useFetch from "../hooks/useFetch";

function StatusChip({ active }) {
  return (
    <Chip
      label={active ? "Active" : "Inactive"}
      color={active ? "success" : "error"}
      size="small"
    />
  );
}

function TabPanel({ value, index, children }) {
  return value === index && <Box mt={2}>{children}</Box>;
}

export default function SchoolOverviewPage() {
  const [tab, setTab] = useState(0);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
 const { id } = useParams();
  const { data: dashboardRes, loading } = useFetch(
    `/api/school/${id}/overview`,
  );

  useEffect(() => {
    if (dashboardRes) {
      console.log("result dashboard", dashboardRes);
      setTeachers(dashboardRes?.teachers?? []);
      setStudents(dashboardRes?.students??[]);
      setSubjects(dashboardRes?.subjects??[]);
      setClasses(dashboardRes?.classes??[]);
    }
  }, [dashboardRes]);
 

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700} mb={2}>
        School Overview
      </Typography>

      <Tabs value={tab} onChange={(e, v) => setTab(v)}>
        <Tab label="Teachers" />
        <Tab label="Students" />
        <Tab label="Subjects" />
        <Tab label="Classes & Sections" />
      </Tabs>

      {/* ---------------- TEACHERS ---------------- */}
      <TabPanel value={tab} index={0}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teachers.map(t => (
              <TableRow key={t.id}>
                <TableCell>{t.fullName}</TableCell>
                <TableCell>{t.email}</TableCell>
                <TableCell>{t.phone}</TableCell>
                <TableCell>
                  <StatusChip active={t.isActive} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabPanel>

      {/* ---------------- STUDENTS ---------------- */}
      <TabPanel value={tab} index={1}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Parent</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map(s => (
              <TableRow key={s.id}>
                <TableCell>{s.firstName} {s.lastName}</TableCell>
                <TableCell>{s.email}</TableCell>
                <TableCell>{s.phone}</TableCell>
                <TableCell>{s.parentName}</TableCell>
                <TableCell>
                  <StatusChip active={s.isActive} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabPanel>

      {/* ---------------- SUBJECTS ---------------- */}
      <TabPanel value={tab} index={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subjects.map(sub => (
              <TableRow key={sub.id}>
                <TableCell>{sub.code}</TableCell>
                <TableCell>{sub.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabPanel>

      {/* ---------------- CLASSES & SECTIONS ---------------- */}
      <TabPanel value={tab} index={3}>
        {classes.map(cls => (
          <Accordion key={cls.id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight={600}>
                {cls.displayName}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {cls.sections.length ? (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Section</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cls.sections.map(sec => (
                      <TableRow key={sec.id}>
                        <TableCell>{sec.name}</TableCell>
                        <TableCell>
                          <StatusChip active={sec.isActive} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Typography color="text.secondary">
                  No sections available
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
      </TabPanel>
    </Paper>
  );
}
