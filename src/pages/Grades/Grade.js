import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  Modal,
  Card,
  Divider,
} from "@mui/material";
import {
  getAssignmentPointsEarnedDisplay,
  getAssignmentPointsPossibleDisplay,
  calculateAssignmentGradeDisplay,
  calculateAssignmentWeightDisplay,
  calculatePointsNeededDisplay,
} from "./gradeCalc.js";

const Grade = ({ grades }) => {
  const { gradeId } = useParams();
  const [gradeDetails, setGradeDetails] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAssignmentIndex, setSelectedAssignmentIndex] = useState(null);

  useEffect(() => {
    if (grades && grades.length > 0) {
      const details = grades[parseInt(gradeId, 10)];
      setGradeDetails(details);
    }
  }, [gradeId, grades]);

  const handleAssignmentChange = (index, field, value) => {
    const updatedAssignments = gradeDetails.assignments.map((assignment, idx) =>
      idx === index ? { ...assignment, [field]: value } : assignment
    );
    setGradeDetails({ ...gradeDetails, assignments: updatedAssignments });
  };

  const addAssignment = () => {
    const newAssignment = {
      name: "",
      score: "",
      outOf: "",
      weight: "",
    };
    setGradeDetails({
      ...gradeDetails,
      assignments: [...gradeDetails.assignments, newAssignment],
    });
  };

  const openModal = (index) => {
    setSelectedAssignmentIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  if (!gradeDetails) return <div>Loading...</div>;

  const AssignmentModalContent = () => {
    const [inputGrade, setInputGrade] = useState(90);
    if (selectedAssignmentIndex == null) return null;
    const assignment = gradeDetails.assignments[selectedAssignmentIndex];
    const pointsEarned = getAssignmentPointsEarnedDisplay(assignment);
    const pointsPossible = getAssignmentPointsPossibleDisplay(assignment);
    const grade = calculateAssignmentGradeDisplay(assignment);
    const weight = calculateAssignmentWeightDisplay(
      gradeDetails,
      selectedAssignmentIndex
    );
    var pointsNeeded;
    if (Number.isNaN(parseFloat(inputGrade))) pointsNeeded = "";
    else
      pointsNeeded = calculatePointsNeededDisplay(
        gradeDetails,
        selectedAssignmentIndex,
        parseFloat(inputGrade) / 100
      );
    return (
      <Card sx={{ p: 2 }} style={{ width: "500px" }}>
        <Typography sx={{ p: 1 }} variant="h5">
          Details
        </Typography>
        <Divider sx={{ my: 1 }} />
        <div style={{ padding: "10px" }}>
          <Typography>Name: {assignment.name}</Typography>
          <Typography>Category: {assignment.weight}</Typography>
          <Typography>
            Points: {`${pointsEarned} / ${pointsPossible}`}
          </Typography>
          <Typography>Grade: {grade}</Typography>
          <Typography>Weight: {weight}</Typography>
        </div>
        <Divider sx={{ my: 1 }} />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              padding: "10px",
              paddingTop: "6px",
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
              <Typography>What score do I need to have a </Typography>
              <TextField
                value={inputGrade}
                onChange={(e) => setInputGrade(e.target.value)}
                size="small"
                style={{ width: "80px" }}
              />
            </div>
            <Typography style={{ flex: 0.5 }}> %</Typography>
          </div>
          <Typography>{pointsNeeded}</Typography>
        </div>
      </Card>
    );
  };

  return (
    <Box sx={{ p: 3, maxWidth: "100%", width: "auto", mx: "auto" }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{ textAlign: "center", mb: 4 }}
      >
        {gradeDetails.subject}
      </Typography>
      <Paper
        elevation={6}
        sx={{ maxWidth: 800, mx: "auto", p: 3, backgroundColor: "#f7f7f7" }}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          Overall Grade: {gradeDetails.grade}%
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={addAssignment}
          sx={{ mb: 3 }}
        >
          Add Assignment
        </Button>
        {gradeDetails.assignments.map((assignment, index) => (
          <div key={index}>
            <TextField
              value={assignment.name}
              onChange={(e) =>
                handleAssignmentChange(index, "name", e.target.value)
              }
            />
            <TextField
              value={assignment.score}
              onChange={(e) =>
                handleAssignmentChange(index, "score", e.target.value)
              }
            />
            <TextField
              value={assignment.outOf}
              onChange={(e) =>
                handleAssignmentChange(index, "outOf", e.target.value)
              }
            />
            <Select
              value={assignment.weight}
              onChange={(e) =>
                handleAssignmentChange(index, "weight", e.target.value)
              }
            >
              {Object.keys(gradeDetails.weights).map((weight) => (
                <MenuItem key={weight} value={weight}>
                  {weight}
                </MenuItem>
              ))}
            </Select>
            <Button onClick={() => openModal(index)}>Details</Button>
          </div>
        ))}
      </Paper>

      <Modal
        sx={{ display: "flex", justifyContent: "center" }}
        open={modalOpen}
        onClose={closeModal}
      >
        <AssignmentModalContent />
      </Modal>
    </Box>
  );
};

export default Grade;
