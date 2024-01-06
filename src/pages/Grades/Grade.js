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
  Container,
} from "@mui/material";
import {
  getAssignmentPointsEarnedDisplay,
  getAssignmentPointsPossibleDisplay,
  calculateAssignmentGradeDisplay,
  calculateGradeDisplay,
  calculateCategoryDetails,
} from "./gradeCalc.js";
import { calculatePointsNeededDisplay } from "./fakeGradeCalc.js";
import { Info } from "@mui/icons-material";

const Grade = ({ grades }) => {
  const { gradeId } = useParams();
  const [gradeDetails, setGradeDetails] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAssignmentIndex, setSelectedAssignmentIndex] = useState(null);
  const [grade, setGrade] = useState(
    calculateGradeDisplay(grades.Courses[0].Course[gradeId])
  );
  const [period, setPeriod] = useState(grades.Courses[0].Course[gradeId]);
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
    console.log(updatedAssignments);
    if (field != "Measure") {
      if (field.toLowerCase() == "score") {
        updatedAssignments[index] = {
          ...updatedAssignments[index],
          Points: value.split(" ")[0] + " / " + value.split(" ")[2],
        };
      } else if (field.toLowerCase() == "points") {
        updatedAssignments[index] = {
          ...updatedAssignments[index],
          Score: value.split(" ")[0] + " out of " + value.split(" ")[2],
        };
      }
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
          .GradeCalculationSummary[0].AssignmentGradeCalc ||
        calculateCategoryDetails(
          updatedGrades.Courses[0].Course[parseInt(gradeId, 10)]
        );
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
            if (assignment.Type === category?.$?.Type || !category?.$?.Type) {
              let [assignmentEarned, assignmentPossible] =
                assignment.Points.split(" / ").map(Number);
              totalPoints += assignmentEarned;
              totalPointsPossible += assignmentPossible;
            }
          });
        if (category.$?.Points) {
          category.$.Points = totalPoints.toFixed(2);
        } else {
          category.Points = totalPoints.toFixed(2);
        }
        if (category.$?.Points) {
          category.$.PointsPossible = totalPointsPossible.toFixed(2);
        } else {
          category.PointsPossible = totalPointsPossible.toFixed(2);
        }
      });
      // Update state with recalculated grade details
      // Update state with recalculated grades
      setGrade(
        calculateGradeDisplay(
          updatedGrades.Courses[0].Course[parseInt(gradeId, 10)]
        )
      );
      setPeriod(updatedGrades.Courses[0].Course[parseInt(gradeId, 10)]);
    }
    setGradeDetails(updatedAssignments);
  };
  const addAssignment = () => {
    const newAssignment = {
      Measure: "",
      score: "",
      Points: "0 / 20.0",
      weight: "",
    };
    setGradeDetails([newAssignment, ...gradeDetails]);
    // handleAssignmentChange(0,'Points',"0 / 20.0")
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
    // const weight = calculateAssignmentWeightDisplay(
    //   gradeDetails,
    //   selectedAssignmentIndex
    // );
    var pointsNeeded;
    console.log(assignment);
    if (Number.isNaN(parseFloat(inputGrade))) pointsNeeded = "";
    else
      pointsNeeded = calculatePointsNeededDisplay(
        gradeDetails,
        selectedAssignmentIndex,
        parseFloat(inputGrade) / 100,
        period
      );
    return (
      <Container
        sx={{
          display: "flex",
          width: "100%",
          height: "100%",
          mt: 10,
          justifyContent: "center",
        }}
      >
        <Card sx={{ p: 2 }} style={{ width: "500px", height: "250px" }}>
          <Typography sx={{ p: 1 }} variant="h5">
            Details
          </Typography>
          <Divider sx={{ my: 1 }} />
          <div style={{ padding: "10px" }}>
            <Typography>Name: {assignment.Measure}</Typography>
            <Typography>Category: {assignment.Type || "None"}</Typography>
            <Typography>
              Points: {`${pointsEarned} / ${pointsPossible}`}
            </Typography>
            <Typography>Grade: {grade}</Typography>
            {/* <Typography>Weight: {weight}</Typography> */}
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
              <div
                style={{ display: "flex", gap: "20px", alignItems: "center" }}
              >
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
      </Container>
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
        {grades.Courses[0].Course[parseInt(gradeId)].$.Title}
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
                  handleAssignmentChange(index, "Measure", e.target.value)
                }
                sx={{ flex: 2 }}
              />
              <TextField
                size="small"
                value={
                  assignment.Points?.includes("Possible") || !assignment.Points
                    ? ""
                    : parseFloat(
                        assignment.Points?.replace(/,/g, "").split(" ")[0]
                      )
                }
                sx={{ flex: 1 }}
                onChange={(e) => {
                  const newValue = parseFloat(e.target.value);
                  if (!isNaN(newValue)) {
                    handleAssignmentChange(
                      index,
                      "Points",
                      `${newValue.toFixed(2)} / ${
                        assignment.Points?.replace(/,/g, "").split(" ")[2]
                      }`
                    );
                  }
                }}
              />

              <TextField
                value={
                  assignment.Points?.includes("Possible") || !assignment.Points
                    ? ""
                    : parseFloat(
                        assignment.Points?.replace(/,/g, "").split(" ")[2]
                      )
                }
                sx={{ flex: 1 }}
                onChange={(e) => {
                  const newValue = parseFloat(e.target.value);
                  if (!isNaN(newValue)) {
                    handleAssignmentChange(
                      index,
                      "Points",
                      `${
                        assignment.Points?.replace(/,/g, "").split(" ")[0]
                      } / ${newValue}`
                    );
                  }
                }}
                size="small"
              />
              <Select
                value={grades.Courses[0].Course[parseInt(gradeId, 10)]
                  .Marks[0].Mark[0].GradeCalculationSummary[0]?assignment?.Type ||  grades.Courses[0].Course[
                    parseInt(gradeId, 10)
                  ].Marks[0].Mark[0].GradeCalculationSummary[0].AssignmentGradeCalc[0].$.Type:"e"}
                size="small"
                sx={{
                  flex: 1,
                  display: grades.Courses[0].Course[parseInt(gradeId, 10)]
                    .Marks[0].Mark[0].GradeCalculationSummary[0]
                    ? "inherit"
                    : "none",
                }}
                onChange={(e) =>
                  handleAssignmentChange(index, "Type", e.target.value)
                }
              >
                {grades.Courses[0].Course[parseInt(gradeId, 10)].Marks[0]
                  .Mark[0].GradeCalculationSummary[0] ? (
                  grades.Courses[0].Course[
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
                    ))
                ) : (
                  <MenuItem value={3}></MenuItem>
                )}
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
