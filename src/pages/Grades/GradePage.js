import React from "react";
import { Grid, Alert, Box, Typography } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import GradeItem from "./GradeItem"; // Adjust the import path as necessary
import { calculateGradeDisplay } from "./gradeCalc";
import { mockGrades } from "./mockGrades";

const GradePage = ({ grades }) => {
  grades = typeof grades == "string" ? mockGrades : grades;
  // Assume grades is an array of grade objects
  console.log(typeof grades);
  return (
    <Box style={{ padding: "40px" }}>
      {typeof grades === "string" ? (
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          style={{ minHeight: "70vh" }}
        >
          <Alert
            severity="warning"
            icon={<WarningIcon fontSize="large" />}
            style={{ fontSize: "24px", textAlign: "center" }}
          >
            STUDENTVUE is down. Please check back later.
          </Alert>
        </Grid>
      ) : (
        <>
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <Typography pb={2} variant="h2" style={{ fontSize: "30px" }}>
              Grades
            </Typography>
          </div>
          {grades.Courses[0].Course.map((grade, index) => (
            <GradeItem
              key={index}
              subject={grade.$.Title}
              grade={calculateGradeDisplay(grade)}
              index={index}
            />
          ))}
        </>
      )}
    </Box>
  );
};

export default GradePage;
