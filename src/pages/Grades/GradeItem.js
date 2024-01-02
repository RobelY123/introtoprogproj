import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { FaArrowCircleRight } from "react-icons/fa";
const GradeItem = ({ subject, grade, index }) => {
  return (
    <Card
      sx={{
        display: "flex",
        justifyContent: "space-between",
        mb: 2,
        boxShadow: 3,
        alignItems: "center",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          flex: 3,
        }}
      >
        <Typography variant="h6" component="h2">
          {subject}
        </Typography>
        <Typography variant="body1">{grade}</Typography>
      </CardContent>
      <div style={{ flex: 1 ,display:'flex',justifyContent:"flex-end"}}>
        <Button
          component={RouterLink}
          to={`/grades/${index}`}
          variant="contained"
          color="primary"
          endIcon={<FaArrowCircleRight />}
          sx={{ m: 1, height: "50%", marginRight: "20px" }}
        >
          Details
        </Button>
      </div>
    </Card>
  );
};

export default GradeItem;
