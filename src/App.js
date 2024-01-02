import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./util/Header";
import Footer from "./util/Footer";
import HomePage from "./pages/Home/HomePage";
import GradePage from "./pages/Grades/GradePage";
import LoginPage from "./pages/Login/LoginPage";
import NotFoundPage from "./pages/NotFound";
import GradeItem from "./pages/Grades/GradeItem";
import Grade from "./pages/Grades/Grade";
import { gradesData } from "./grades";

const App = () => {
  return (
    <Router>
      <Header />
      <main style={{ paddingBottom: "100px"}}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/grades/:gradeId" element={<Grade grades={gradesData} />} />
          <Route path="/grades" element={<GradePage grades={gradesData} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
