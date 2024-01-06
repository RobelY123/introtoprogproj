import React from "react";
import { Grid, Typography } from "@mui/material";
import GradeItem from "./GradeItem"; // Adjust the import path as necessary
import { calculateGradeDisplay } from "./gradeCalc";

const GradePage = ({ grades }) => {
  // Assume grades is an array of grade objects
  return (
    <div style={{ padding: "40px"}}>
      <div style={{width:'100%',display:'flex',justifyContent:'center'}}>
      <Typography pb={2} variant="h2">Grades</Typography></div>
      {grades.Courses[0].Course.map((grade, index) => (
        <GradeItem
          key={index}
          subject={grade.$.Title}
          grade={calculateGradeDisplay(grade)}
          index={index}
        />
      ))}
    </div>
  );
};

export default GradePage;
