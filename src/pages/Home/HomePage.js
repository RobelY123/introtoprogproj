import React from "react";
import { Box, Typography, Paper, Link, Divider, Card, Button } from "@mui/material";
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
          background: "linear-gradient(180deg, #90ee90 30%, #006400 90%)",
          color: "white", // All text in this section is white
          padding: "20px", // Added padding
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
        </div>
      </Box>

      <Divider variant="middle" />

      {/* Grades and GPA Section */}
      <Box sx={{ p: 3 }}>
        <Card
          sx={{
            padding: "35px",
            margin: "30px 0",
            background: "white", // Added gradient background
            borderRadius: "12px", // Added border radius
          }}
        >
          <Box sx={{ flex: 2,margin:"0 30px" }}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ fontWeight: "bold", color: "darkgreen" }}
            >
              {" "}
              {/* Increased size and changed color */}
              Grades and GPA Calculator
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: "#90ee90" }}>
              {" "}
              {/* Changed color */}
              Keep track of your course grades and calculate your GPA with ease.
              Our intuitive interface allows you to input grades, and our system
              automatically converts them into your GPA, be it numerical or
              letter grades.
            </Typography>
          </Box>
        </Card>
      </Box>
      
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
          <Typography variant="h5" gutterBottom>
            Help Center
          </Typography>
          <Typography variant="body1" gutterBottom sx={{ color: "lightgreen" }}>
            {" "}
            {/* Changed color */}
            Got questions? Visit our Help Center for FAQs and resources. Can't
            find what you're looking for? Reach out directly to our support
            team.
          </Typography>
          <Button href="/help" variant="contained" color="success">Go To help Page</Button>
        </Paper>
      </Box>
    </Box>
  );
};

export default HomePage;
