// import React, { useEffect } from "react";
// import {
//   Modal,
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Stack,
// } from "@mui/material";

// const modalStyle = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 400,
//   bgcolor: "background.paper",
//   borderRadius: 2,
//   boxShadow: 24,
//   p: 4,
// };

// function AddSubjectModal({ open, onClose, onSubmit, selectedSubject }) {
//   console.log("selectedSubject", selectedSubject);
//   const [form, setForm] = React.useState({
//     name: "",
//     code: "",
//   });

//   const [errors, setErrors] = React.useState({});
//     const { data: classesRes } = useFetch(
//       `/api/classes/${schoolId}`,
//       undefined,
//       !!schoolId,
//     );

//   useEffect(() => {
//     setForm(selectedSubject);
//   }, [selectedSubject]);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });

//     // Clear error when user types
//     setErrors({ ...errors, [e.target.name]: "" });
//   };

//   const validate = () => {
//     let tempErrors = {};

//     if (!form.name.trim()) {
//       tempErrors.name = "Subject name is required";
//     }

//     if (!form.code.trim()) {
//       tempErrors.code = "Subject code is required";
//     }

//     setErrors(tempErrors);

//     // valid if no error keys
//     return Object.keys(tempErrors).length === 0;
//   };

//   const handleSubmit = () => {
//     if (!validate()) return; // ❌ stop API call

//     onSubmit(form); // ✅ API call only if valid

//     setForm({ name: "", code: "" });
//     setErrors({});
//     onClose();
//   };

//   const classes = classesRes?.classes ?? [];

//   return (
//     <Modal open={open} onClose={onClose}>
//       <Box sx={modalStyle}>
//         <Typography variant="h6" fontWeight={700} mb={2}>
//           Add Subject
//         </Typography>

//         <Stack spacing={2}>
//           <TextField
//             label="Subject Name"
//             name="name"
//             value={form.name}
//             onChange={handleChange}
//             fullWidth
//             error={!!errors.name}
//             helperText={errors.name}
//           />

//           <TextField
//             label="Subject Code"
//             name="code"
//             value={form.code}
//             onChange={handleChange}
//             fullWidth
//             error={!!errors.code}
//             helperText={errors.code}
//           />
//         </Stack>

//         <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
//           <Button onClick={onClose} variant="outlined">
//             Cancel
//           </Button>
//           <Button onClick={handleSubmit} variant="contained">
//             Save
//           </Button>
//         </Stack>
//       </Box>
//     </Modal>
//   );
// }

// export default AddSubjectModal;

import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 420,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

function AddSubjectModal({
  open,
  onClose,
  onSubmit,
  selectedSubject,
  classes,
}) {
  /* ---------------- STATE ---------------- */
  const [form, setForm] = useState({
    name: "",
    code: "",
    classId: "",
    sectionId: "",
  });

  const [errors, setErrors] = useState({});
  const [sections, setSections] = useState([]);

  /* ---------------- LOAD EDIT DATA ---------------- */
  useEffect(() => {
    if (!selectedSubject) {
      setForm({
        id: null,
        name: "",
        code: "",
        classId: "",
        sectionId: "",
      });
      return;
    }
    console.log("selectedSubject", selectedSubject, classes);

    setForm({
      id: selectedSubject?.id,
      name: selectedSubject?.name || "",
      code: selectedSubject?.code || "",
      classId: selectedSubject?.classId || "",
      sectionId: selectedSubject?.sectionId || "",
    });

    const selectedClass = classes.find(
      (c) => c.id === selectedSubject?.classId,
    );
    console.log(
      "selectedSubjectselectedSubject",
      selectedClass,
      selectedSubject,
    );
    setSections(selectedClass ? selectedClass.sections || [] : []);
  }, [selectedSubject]);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "classId" ? { sectionId: "" } : {}),
    }));
    // Update sections when class changes
    if (name === "classId") {
      const selectedClass = classes.find((c) => c.id === value);
      setSections(selectedClass ? selectedClass.sections || [] : []);
    }

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const temp = {};

    if (!form.name.trim()) temp.name = "Subject name is required";
    if (!form.code.trim()) temp.code = "Subject code is required";
    if (!form.classId) temp.classId = "Class is required";
    if (!form.sectionId) temp.sectionId = "Section is required";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSubmit(form);

    setForm({
      name: "",
      code: "",
      classId: "",
      sectionId: "",
      schoolId: "",
    });

    setErrors({});
    onClose();
  };

  /* ---------------- UI ---------------- */
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" fontWeight={700} mb={2}>
          {selectedSubject ? "Edit Subject" : "Add Subject"}
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Subject Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            error={!!errors.name}
            helperText={errors.name}
          />

          <TextField
            label="Subject Code"
            name="code"
            value={form.code}
            onChange={handleChange}
            fullWidth
            error={!!errors.code}
            helperText={errors.code}
          />

          {/* CLASS */}
          <FormControl fullWidth error={!!errors.classId}>
            <InputLabel>Class</InputLabel>
            <Select
              disabled={selectedSubject}
              name="classId"
              value={form.classId}
              label="Class"
              onChange={handleChange}
            >
              {classes.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c?.displayName || c.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.classId}</FormHelperText>
          </FormControl>

          {/* SECTION */}
          <FormControl
            fullWidth
            error={!!errors.sectionId}
            disabled={!form.classId}
          >
            <InputLabel>Section</InputLabel>
            <Select
              disabled={selectedSubject}
              name="sectionId"
              value={form.sectionId}
              label="Section"
              onChange={handleChange}
            >
              {sections.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.sectionId}</FormHelperText>
          </FormControl>
        </Stack>

        <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            {selectedSubject ? "Update" : "Save"}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}

export default AddSubjectModal;
