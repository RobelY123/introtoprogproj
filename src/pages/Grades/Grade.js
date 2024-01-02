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
    const validAssignments = assignments.filter(a => a.score !== '' && a.outOf > 0 && weights[a.weight]);
  
    let totalWeightedScore = 0;
    let totalWeight = 0;
  
    validAssignments.forEach(assignment => {
      const weight = weights[assignment.weight] || 1; // Default weight to 1 if not found
      const weightedScore = (assignment.score / assignment.outOf) * weight;
      totalWeightedScore += weightedScore;
      totalWeight += weight;
    });
  
    return totalWeight > 0 ? ((totalWeightedScore / totalWeight) * 100).toFixed(2) : 'N/A';
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
    <Box sx={{ p: 3, maxWidth: '100%', width: 'auto', mx: 'auto' }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Grade Details - {gradeDetails.subject}
      </Typography>
      <Paper elevation={6} sx={{ maxWidth: 800, mx: 'auto', p: 3, backgroundColor: '#f7f7f7' }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Overall Grade: {gradeDetails.grade}%
        </Typography>
        <Divider sx={{ my: 2 }} />
        {gradeDetails.assignments.map((assignment, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <TextField
              label="Assignment Name"
              variant="outlined"
              value={assignment.name}
              onChange={(e) => handleAssignmentChange(index, 'name', e.target.value)}
              sx={{ mr: 2, width: '30%' }}
            />
            <TextField
              label="Score"
              type="number"
              variant="outlined"
              value={assignment.score}
              onChange={(e) => handleAssignmentChange(index, 'score', e.target.value)}
              sx={{ mr: 2, width: '15%' }}
            />
            <TextField
              label="Out Of"
              type="number"
              variant="outlined"
              value={assignment.outOf}
              onChange={(e) => handleAssignmentChange(index, 'outOf', e.target.value)}
              sx={{ mr: 2, width: '15%' }}
            />
            <Select
              label="Weight Type"
              value={assignment.weight}
              onChange={(e) => handleAssignmentChange(index, 'weight', e.target.value)}
              sx={{ width: '20%' }}
            >
              {weightTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </Box>
        ))}
        <Button variant="contained" color="primary" onClick={addAssignment} sx={{ mt: 2 }}>
          Add Assignment
        </Button>
      </Paper>
    </Box>
  );
};

export default Grade;
