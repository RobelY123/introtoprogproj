import React from "react";
import { Box, Typography } from "@mui/material";

const HomePage = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to the Home Page
      </Typography>
      <Typography variant="body1">
        This is the main page of our application.
      </Typography>
    </Box>
  );
};

export default HomePage;
