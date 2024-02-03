import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { FaArrowCircleRight } from "react-icons/fa";
import { convertToLetterGrade } from "../../util/utilFile";


const GradeItem = ({ subject, grade, index }) => {
  const letterGrade = convertToLetterGrade(grade);

  return (
    <Card
      sx={{
        mb: 2,
        boxShadow: 3,
        display: "flex",
        alignItems:'center',
      }}
    >
      <CardContent sx={{ flex: 1 }}>
        <Typography variant="h6" component="h2">
          {subject}
        </Typography>
        <Typography variant="body1">
          Grade: {letterGrade} ({grade}%)
        </Typography>
      </CardContent>
      <Button
        component={RouterLink}
        to={`/grades/${index}`}
        variant="contained"
        color="primary"
        endIcon={<FaArrowCircleRight />}
        sx={{ mr:3 }}
      >
        Details
      </Button>
    </Card>
  );
};

export default GradeItem;