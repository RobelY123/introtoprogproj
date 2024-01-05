import React from "react";
import { Box, Typography, Paper, Link, Divider } from "@mui/material";
import text from "../../images/text.svg"
const HomePage = () => {
  return (
    <Box sx={{ p: 3 }}>
      <div style={{ display: "flex", fontWeight: "bold",flexDirection:'column',alignItems:'center',margin:'100px 0' }}>
        <img
          style={{ justifyContent: "center",paddingBottom:'30px' }}
        src={text}/>
        <Typography variant="h6" gutterBottom textAlign="center">
          Your comprehensive tool for modern managing of academic progress.
        </Typography>
      </div>
      <Divider/>
      {/* Grades and GPA Section */}
      <div style={{padding:'35px',margin:'30px 0',}}
      >
        <div style={{flex:2}}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: "medium" }}>
          Grades and GPA Calculator
        </Typography>
        <Typography variant="body1" gutterBottom>
          Keep track of your course grades and calculate your GPA with ease. Our
          intuitive interface allows you to input grades, and our system
          automatically converts them into your GPA, be it numerical or letter
          grades.
        </Typography></div>
        <div style={{flex:1}}>
            {/* <img src="" */}
        </div>
      </div>

      {/* Help Center Section */}
      <Paper elevation={3} sx={{ my: 2, p: 2, backgroundColor: "#e0f7fa" }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: "medium" }}>
          Help Center
        </Typography>
        <Typography variant="body1" gutterBottom>
          Got questions? Visit our Help Center for FAQs and resources. Can't
          find what you're looking for? Reach out directly to our support team.
        </Typography>
        <Link href="/faq" underline="hover">
          Frequently Asked Questions
        </Link>
        <br />
        <Link href="/contact" underline="hover">
          Contact Support
        </Link>
      </Paper>
    </Box>
  );
};
export default HomePage;
