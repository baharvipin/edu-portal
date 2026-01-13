import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/material";
import { showToast } from "../utility/toastService";

export default function BulkStudentUpload({ schoolId, onSuccess }) {
  const [students, setStudents] = useState([]);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  /* -----------------------------
     Handle JSON file upload
  -------------------------------- */
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/json") {
      setError("Please upload a valid JSON file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        console.log("parsed json", parsed);
        if (!Array.isArray(parsed)) {
          setError("JSON must be an array of students");
          return;
        }

        setStudents(parsed);
        setFileName(file.name);
        setError("");
        setResult(null);
      } catch (err) {
        setError("Invalid JSON file");
      }
    };

    reader.readAsText(file);
  };

  /* -----------------------------
     Upload to API
  -------------------------------- */
  const handleUpload = async () => {
    if (!students.length) {
      setError("No students found to upload");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("authToken");

      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/students/bulk-upload`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({
            schoolId,
            students,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        showToast(data.message || "Upload failed", "error");
        throw new Error(data.message || "Upload failed");
      }

      setResult(data);
      setStudents([]);
      setFileName("");

      onSuccess?.();
      showToast(data.message || "Students uploaded successfully", "success");
    } catch (err) {
      setError(err.message);
      showToast(err.message || "Upload failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3} border="1px solid #ddd" borderRadius={2}>
      <Typography variant="h6" fontWeight={700} mb={2}>
        Bulk Student Upload (JSON)
      </Typography>

      <Stack spacing={2}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mt={2}
        >
          <Button variant="outlined" component="label" sx={{ width: "25%" }}>
            Upload JSON File
            <input
              type="file"
              hidden
              accept=".json"
              onChange={handleFileUpload}
            />
          </Button>

          <Button
            variant="contained"
            disabled={loading}
            onClick={handleUpload}
            sx={{ width: "25%" }}
          >
            {loading ? <CircularProgress size={22} /> : "Upload Students"}
          </Button>
        </Stack>

        {fileName && (
          <Typography variant="body2">
            Selected File: <b>{fileName}</b>
          </Typography>
        )}

        {students.length > 0 && (
          <Alert severity="info">
            {students.length} students ready for upload
          </Alert>
        )}

        {error && <Alert severity="error">{error}</Alert>}

        {result && (
          <Alert severity="success">
            Uploaded: {result.insertedCount} students <br />
            Skipped: {result.skipped.length}
            {result?.skipped?.map((r) => {
              return (
                <>
                  {typeof r == "object" &&
                    Object.entries(r)?.map(([key, value]) => {
                      return (
                        <>
                          <Alert severity="error">
                            {key} - {value}
                          </Alert>
                        </>
                      );
                    })}
                </>
              );
            })}
          </Alert>
        )}
      </Stack>
    </Box>
  );
}
