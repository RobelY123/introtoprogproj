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
  IconButton,
} from "@mui/material";
import {
  getAssignmentPointsEarnedDisplay,
  getAssignmentPointsPossibleDisplay,
  calculateAssignmentGradeDisplay,
  calculateAssignmentWeightDisplay,
  calculatePointsNeededDisplay,
  calculateGradeDisplay,
} from "./gradeCalc.js";
import { Info } from "@mui/icons-material";

const Grade = ({ grades }) => {
  const { gradeId } = useParams();
  const [gradeDetails, setGradeDetails] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAssignmentIndex, setSelectedAssignmentIndex] = useState(null);
  const [grade, setGrade] = useState(
    calculateGradeDisplay(grades.Courses[0].Course[gradeId])
  );
  useEffect(() => {
    var data = grades.Courses[0].Course[
      parseInt(gradeId, 10)
    ].Marks[0].Mark[0].Assignments[0].Assignment.map((e) => e.$);
    if (data && data.length > 0) {
      setGradeDetails(data);
    }
  }, [gradeId, grades]);

  const handleAssignmentChange = (index, field, value) => {
    let updatedAssignments = [...gradeDetails];
    let updatedGrades = JSON.parse(JSON.stringify(grades)); // Deep copy grades

    // Update the assignment's Points or Score field
    updatedAssignments[index] = {
      ...updatedAssignments[index],
      [field]: value,
    };
    console.log(updatedAssignments[index]);
    console.log(updatedAssignments);
    // Update the assignments array in the grades data structure
    updatedGrades.Courses[0].Course[
      parseInt(gradeId, 10)
    ].Marks[0].Mark[0].Assignments[0].Assignment = updatedAssignments.map(
      (assignment) => ({ $: assignment })
    );

    // Find the weight category
    let assignmentType = updatedAssignments[index].Type;
    let weightCategories =
      updatedGrades.Courses[0].Course[parseInt(gradeId, 10)].Marks[0].Mark[0]
        .GradeCalculationSummary[0].AssignmentGradeCalc;

    // Recalculate the total points and points possible for each weight category
    weightCategories.forEach((category) => {
      let totalPoints = 0;
      let totalPointsPossible = 0;

      updatedAssignments
        .filter((e) => {
          let [assignmentEarned, assignmentPossible] =
            e.Points.split(" / ").map(Number);
          return assignmentEarned && assignmentPossible;
        })
        .forEach((assignment) => {
          if (assignment.Type === category.$.Type) {
            let [assignmentEarned, assignmentPossible] =
              assignment.Points.split(" / ").map(Number);
            totalPoints += assignmentEarned;
            totalPointsPossible += assignmentPossible;
            console.log(
              `Assignment: ${assignment.Measure}, Earned: ${assignmentEarned}, Possible: ${assignmentPossible}`
            );
          }
        });

      console.log(
        `Category Before: ${category.$.Type}, Points: ${category.$.Points}, PointsPossible: ${category.$.PointsPossible}`
      );
      category.$.Points = totalPoints.toFixed(2);
      category.$.PointsPossible = totalPointsPossible.toFixed(2);
      console.log(
        `Category After: ${category.$.Type}, Points: ${category.$.Points}, PointsPossible: ${category.$.PointsPossible}`
      );
    });
    console.log(weightCategories);
    // Update state with recalculated grade details
    setGradeDetails(updatedAssignments);

    // Update state with recalculated grades
    setGrade(
      calculateGradeDisplay(
        updatedGrades.Courses[0].Course[parseInt(gradeId, 10)]
      )
    );
  };
  const addAssignment = () => {
    const newAssignment = {
      Measure: "",
      score: "",
      outOf: "",
      weight: "",
    };
    setGradeDetails([newAssignment, ...gradeDetails]);
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
    const assignment = gradeDetails[selectedAssignmentIndex];
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
          Overall Grade: {grade}%
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={addAssignment}
          sx={{ mb: 3 }}
        >
          Add Assignment
        </Button>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {gradeDetails.map((assignment, index) => (
            <div key={index} style={{ display: "flex", gap: "20px" }}>
              <TextField
                value={assignment.Measure}
                size="small"
                onChange={(e) =>
                  handleAssignmentChange(index, "name", e.target.value)
                }
                sx={{ flex: 2 }}
              />
              <TextField
                size="small"
                value={
                  assignment.Points?.includes("Possible") || !assignment.Points
                    ? ""
                    : parseInt(
                        assignment.Points?.replace(/,/g, "").split(" ")[0]
                      )
                }
                sx={{ flex: 1 }}
                onChange={(e) => {
                  handleAssignmentChange(
                    index,
                    "Points",
                    `${e.target.value} / ${
                      assignment.Points?.replace(/,/g, "").split(" ")[2]
                    }`
                  );
                }}
              />

              <TextField
                value={
                  assignment.Points?.includes("Possible") || !assignment.Points
                    ? ""
                    : parseInt(
                        assignment.Points?.replace(/,/g, "").split(" ")[2]
                      )
                }
                sx={{ flex: 1 }}
                onChange={(e) => {
                  handleAssignmentChange(
                    index,
                    "Points",
                    `${assignment.Points?.replace(/,/g, "").split(" ")[0]} / ${
                      e.target.value
                    }`
                  );
                }}
                size="small"
              />
              <Select
                value={assignment.Type}
                size="small"
                sx={{ flex: 1 }}
                onChange={(e) =>
                  handleAssignmentChange(index, "Type", e.target.value)
                }
              >
                {grades.Courses[0].Course[
                  parseInt(gradeId, 10)
                ].Marks[0].Mark[0].GradeCalculationSummary[0].AssignmentGradeCalc.map(
                  (val) => val.$
                )
                  .filter((e) => e.Type != "TOTAL")
                  .map((val) => val.Type)
                  .map((weight) => (
                    <MenuItem key={weight} value={weight}>
                      {weight}
                    </MenuItem>
                  ))}
              </Select>
              <IconButton
                sx={{ flex: 0.1, width: "45px" }}
                onClick={() => openModal(index)}
              >
                <Info />
              </IconButton>
            </div>
          ))}
        </div>
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
