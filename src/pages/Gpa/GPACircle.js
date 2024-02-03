import React from "react";
import { CircularProgress, Typography, Box } from "@mui/material";

// A component that displays the GPA inside a circular progress bar
const GPACircle = ({ value, text, label, expanded,size }) => {
  // Define the max GPA value for weighted GPAs, could be more than 4.0
  const maxGPAValue = label.includes("n") ? 4.0 : 5.0; // Assuming 5.0 is the maximum for weighted GPAs
  // Calculate the circular progress according to the GPA value
  const progress = text=="N/A"?0:Math.min((value / maxGPAValue) * 100, 100);

  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress
        style={{ transition: "all 0.3s ease-in-out" }}
        variant="determinate"
        value={progress}
        size={size}
        thickness={5}
        style = {{color: "#4e6766"}}
      />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        style={{ transition: "all 0.3s ease-in-out" }}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Typography
          component="div"
          color="text.secondary"
          style={{ transition: "all 0.3s ease-in-out", fontSize: expanded?"2.5rem":"1.5rem" }}
        >
          {text} {/* Increased text size */}
        </Typography>
        {expanded&&<Typography
          style={{ transition: "all 0.3s ease-in-out", fontSize: "1rem"}}
          variant="subtitle1"
          component="div"
          color="text.secondary"
        >
          {label}
        </Typography>}
      </Box>
    </Box>
  );
};

export default GPACircle;
