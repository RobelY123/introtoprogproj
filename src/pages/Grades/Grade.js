import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  TextField,
  Button,
  Divider,
  ListItemText,
  Select,
  MenuItem,
} from "@mui/material";

const Grade = ({ grades }) => {
  const { gradeId } = useParams();
  const [gradeDetails, setGradeDetails] = useState(null);

  useEffect(() => {
    if (grades && grades.length > 0) {
      const details = grades[parseInt(gradeId, 10)];
      setGradeDetails({
        ...details,
        assignments: details.assignments.map((a) => ({ ...a })),
      });
    }
  }, [gradeId, grades]);

  const recalculateOverallGrade = (assignments, weights) => {
    const weightSums = Object.keys(weights).reduce(
      (acc, key) => ({ ...acc, [key]: 0 }),
      {}
    );
    let weightedScoreSum = 0;
    let totalWeights = 0;

    assignments.forEach((assignment) => {
      if (
        assignment.score !== "" &&
        assignment.outOf > 0 &&
        weights[assignment.weight]
      ) {
        const scoreFraction =
          (assignment.score / assignment.outOf) * weights[assignment.weight];
        weightedScoreSum += scoreFraction;
        weightSums[assignment.weight] += weights[assignment.weight];
      }
    });

    Object.values(weightSums).forEach((sum) => {
      totalWeights += sum;
    });
    return totalWeights > 0
      ? (weightedScoreSum / totalWeights).toFixed(2)
      : gradeDetails.grade;
  };

  const handleAssignmentChange = (index, field, value) => {
    const updatedAssignments = gradeDetails.assignments.map(
      (assignment, idx) => {
        if (idx === index) {
          return {
            ...assignment,
            [field]:
              field === "score" || field === "outOf"
                ? parseFloat(value)
                : value,
          };
        }
        return assignment;
      }
    );

    const updatedGrade = recalculateOverallGrade(
      updatedAssignments,
      gradeDetails.weights
    );
    setGradeDetails({
      ...gradeDetails,
      assignments: updatedAssignments,
      grade: updatedGrade,
    });
  };

  const addAssignment = () => {
    const newAssignment = { name: "", score: "", outOf: "", weight: "" };
    setGradeDetails({
      ...gradeDetails,
      assignments: [...gradeDetails.assignments, newAssignment],
    });
  };

  if (!gradeDetails || !gradeDetails.weights) return <div>Loading...</div>;

  const weightTypes = Object.keys(gradeDetails.weights);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Grade Details - {gradeDetails.subject}
      </Typography>
      <Paper elevation={3} sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
        <List component="nav" aria-label="Grade details">
          <ListItem>
            <ListItemText
              primary="Overall Grade"
              secondary={`${gradeDetails.grade}%`}
            />
          </ListItem>
          <Divider />
          {gradeDetails.assignments.map((assignment, index) => (
            <ListItem key={index}>
              <TextField
                label="Assignment Name"
                variant="outlined"
                value={assignment.name}
                onChange={(e) =>
                  handleAssignmentChange(index, "name", e.target.value)
                }
                sx={{ mr: 2 }}
              />
              <TextField
                label="Score"
                type="number"
                variant="outlined"
                value={assignment.score}
                onChange={(e) =>
                  handleAssignmentChange(index, "score", e.target.value)
                }
                sx={{ mr: 2 }}
              />
              <TextField
                label="Out Of"
                type="number"
                variant="outlined"
                value={assignment.outOf}
                onChange={(e) =>
                  handleAssignmentChange(index, "outOf", e.target.value)
                }
                sx={{ mr: 2 }}
              />
              <Select
                label="Weight Type"
                value={assignment.weight}
                onChange={(e) =>
                  handleAssignmentChange(index, "weight", e.target.value)
                }
                sx={{ mr: 2, minWidth: 120 }}
              >
                {weightTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </ListItem>
          ))}
          <ListItem>
            <Button variant="contained" color="primary" onClick={addAssignment}>
              Add Assignment
            </Button>
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default Grade;
