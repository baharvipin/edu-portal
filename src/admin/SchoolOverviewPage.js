import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
} from "@mui/material";
import useFetch from "../hooks/useFetch";
import { showToast } from "../utility/toastService";

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

  const {
    data: dashboardRes,
    _loading,
    error,
  } = useFetch(`/api/school/${id}/overview`);

  useEffect(() => {
    if (dashboardRes) {
      setTeachers(dashboardRes?.teachers ?? []);
      setStudents(dashboardRes?.students ?? []);
      setSubjects(dashboardRes?.subjects ?? []);
      setClasses(dashboardRes?.classes ?? []);
    }
  }, [dashboardRes]);

  useEffect(() => {
    if (error) {
      showToast(error || "Failed to load overview", "error");
    }
  }, [error]);

  return (
    <>
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
              {teachers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                    <Typography variant="h6" color="text.secondary">
                      👨‍🏫 No teachers added yet
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Teachers will appear here once they are added to the
                      school.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                teachers.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>{t.fullName}</TableCell>
                    <TableCell>{t.email}</TableCell>
                    <TableCell>{t.phone}</TableCell>
                    <TableCell>
                      <StatusChip active={t.isActive} />
                    </TableCell>
                  </TableRow>
                ))
              )}
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
              {students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Typography variant="h6" color="text.secondary">
                      🎓 No students enrolled yet
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Students will appear here once they are added to a class.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                students.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>
                      {s.firstName} {s.lastName}
                    </TableCell>
                    <TableCell>{s.email}</TableCell>
                    <TableCell>{s.phone}</TableCell>
                    <TableCell>{s.parentName}</TableCell>
                    <TableCell>
                      <StatusChip active={s.isActive} />
                    </TableCell>
                  </TableRow>
                ))
              )}
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
              {subjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} align="center" sx={{ py: 6 }}>
                    <Typography variant="h6" color="text.secondary">
                      📘 No subjects added yet
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Subjects will appear here once they are created for this
                      school.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                subjects.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell>{sub.code || "-"}</TableCell>
                    <TableCell>{sub.name}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TabPanel>

        {/* ---------------- CLASSES & SECTIONS ---------------- */}
        <TabPanel value={tab} index={3}>
          {classes.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary">
                🏫 No classes created yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Classes and sections will appear here once they are added.
              </Typography>
            </Paper>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width="40%">Class</TableCell>
                  <TableCell width="40%">Section</TableCell>
                  <TableCell width="20%">Status</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {classes.map((cls) =>
                  cls.sections.length === 0 ? (
                    <TableRow key={cls.id}>
                      <TableCell>
                        <Typography fontWeight={600}>
                          {cls.displayName}
                        </Typography>
                      </TableCell>
                      <TableCell colSpan={2}>
                        <Typography color="text.secondary">
                          📂 No sections available
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    cls.sections.map((sec, index) => (
                      <TableRow key={sec.id}>
                        <TableCell>
                          {index === 0 && (
                            <Typography fontWeight={600}>
                              {cls.displayName}
                            </Typography>
                          )}
                        </TableCell>

                        <TableCell>{sec.name}</TableCell>

                        <TableCell>
                          <StatusChip active={sec.isActive} />
                        </TableCell>
                      </TableRow>
                    ))
                  ),
                )}
              </TableBody>
            </Table>
          )}
        </TabPanel>
      </Paper>
    </>
  );
}
