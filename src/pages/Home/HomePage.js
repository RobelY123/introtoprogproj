import React from "react";
import { Box, Typography, Paper, Link, Divider, Card, Button } from "@mui/material";
import { FaArrowCircleRight } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";
import text from "../../images/text.svg";

import textWhite from "../../images/textWhite.svg";
const HomePage = () => {
  return (
    <Box sx={{ bgcolor: "background.default", color: "text.primary" }}>
      {/* Logo and Introduction Section */}
      <Box
        sx={{
          fontWeight: "bold",
          // Gradient background from light green to dark green
          background: "linear-gradient(180deg, #4E6766 50%, #85b1af 90%)",
          color: "white", // All text in this section is white
          padding: "20px", // Added padding
          height: "65vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            margin: "100px 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            style={{
              justifyContent: "center",
              paddingBottom: "30px",
              maxWidth: "100%", // Ensure the image is responsive
            }}
            src={textWhite}
            alt="Simeo Logo" // Always include alt text for accessibility
          />
          <Typography
            variant="h4"
            gutterBottom
            textAlign="center" // Increased the size from h6 to h4
            sx={{
              color: "white", // Changed text color to white
            }}
          >
            Your comprehensive tool for modern managing of academic progress.
          </Typography>
          <div>
            <Button component={RouterLink} to="/gpa" variant="contained" endIcon={<FaArrowCircleRight />} style={{margin: "4px", background: "#4E6766",}}>GPA</Button>
            <Button component={RouterLink} to="/grades" variant="contained" endIcon={<FaArrowCircleRight />} style={{margin: "4px", background: "#4E6766",}}>Grades</Button>
          </div>
          
        </div>
      </Box>

      <Divider variant="middle" />

      {/* Grades and GPA Section */}
      
      {/* Help Center Section */}
      <Box sx={{ p: 3 }}>
        <Paper
          elevation={3}
          sx={{
            p: 2,
            backgroundColor: "#e0f7fa",
            // Added a light green color for the heading as suggested in the image
            "& .MuiTypography-h5": { color: "darkgreen", fontWeight: "bold" },
            // Removed the card's own background color to let the gradient show
            background: "none",
            margin:'0px 30px'
          }}
        >
          <Typography variant="h5" gutterBottom style={{color: "#4E6766"}}>
            Help Center
          </Typography>
          <Typography variant="body1" gutterBottom sx={{ color: "black" }}>
            {" "}
            {/* Changed color */}
            Got questions? Visit our Help Center for FAQs and resources. Can't
            find what you're looking for? Reach out directly to our support
            team.
          </Typography>
          <Button href="/help" variant="contained" endIcon={<FaArrowCircleRight />} style={{backgroundColor: "#4E6766"}}>Help</Button>
        </Paper>
      </Box>
    </Box>
  );
};

export default HomePage;
