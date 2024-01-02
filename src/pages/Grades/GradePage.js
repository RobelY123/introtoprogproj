import React from "react";
import { Grid } from "@mui/material";
import GradeItem from "./GradeItem"; // Adjust the import path as necessary

const GradePage = ({ grades }) => {
  // Assume grades is an array of grade objects
  return (
    <div style={{ padding: "40px" }}>
      {grades.map((grade, index) => (
        <GradeItem
          key={index}
          subject={grade.subject}
          grade={grade.grade}
          index={index}
        />
      ))}
    </div>
  );
};

export default GradePage;
