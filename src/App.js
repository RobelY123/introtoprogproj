import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Header from "./util/Header";
import Footer from "./util/Footer";
import HomePage from "./pages/Home/HomePage";
import GradePage from "./pages/Grades/GradePage";
import LoginPage from "./pages/Login/LoginPage";
import NotFoundPage from "./pages/NotFound";
import GradeItem from "./pages/Grades/GradeItem";
import Grade from "./pages/Grades/Grade";
import { gradesData } from "./grades";
import GPACalculator from "./pages/Gpa/GpaPage";
import { Box, Modal } from "@mui/material";
import Chatbot from "./Chatbot"; // Your chatbot component
import { Fab } from "@mui/material";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import HelpPage from "./pages/Help/HelpPage";
const App = () => {
  const grades = JSON.parse(localStorage.getItem('grades'));
  const [chatOpen, setChatOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  React.useEffect(() => {
    console.log(grades);
  }, [grades]);
  React.useEffect(() => {
    // Check for token in local storage or cookies
    const token = localStorage.getItem("token"); // or your preferred storage method

    // If there's a token, assume the user is logged in
    if (token) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, []);
  const logout = () => {
    // Remove the token from local storage
    localStorage.removeItem("token");

    // Update loggedIn state
    setLoggedIn(false);

    // Redirect to the login page or another appropriate page
    window.location.href = "/login";
  };
  return (
    <Router>
      <Header logout={logout} loggedIn={loggedIn} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh", // Set the minimum height to the full viewport height
        }}
      >
        <Box
          component="main"
          sx={{
            flexGrow: 1, // This will push the footer to the bottom
            // Add any additional styles for your main content area
          }}
        >
          <main style={{ paddingBottom: "100px" }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/grades/:gradeId"
                element={
                  loggedIn ? (
                    <Grade grades={gradesData} />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/grades"
                element={
                  loggedIn ? (
                    <GradePage grades={grades } />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/login"
                element={
                  loggedIn ? (
                    <Navigate to="/grades" />
                  ) : (
                    <LoginPage
                      setLoggedIn={setLoggedIn}
                    />
                  )
                }
              />
              <Route
                path="/gpa"
                element={
                  loggedIn ? <GPACalculator /> : <Navigate to="/login" />
                }
              />
              <Route path="/help" element={<HelpPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </Box>
      </Box>
      <Footer />
      <Fab
        color="primary"
        aria-label="chat"
        style={{ position: "fixed", bottom: 20, right: 20 }}
        onClick={() => setChatOpen(true)}
      >
        <ChatBubbleIcon />
      </Fab>
      <Modal open={chatOpen} onClose={() => setChatOpen(false)}>
        <Chatbot />
      </Modal>
    </Router>
  );
};

export default App;
