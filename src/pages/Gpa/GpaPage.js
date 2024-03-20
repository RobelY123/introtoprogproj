import React, { useEffect, useRef, useState } from "react";
import YearInput from "./YearInput";
import { Box, Button, Card, IconButton, Typography, useMediaQuery } from "@mui/material";
import { data } from "./gpa";
import GPACircle from "./GPACircle";
import { ExpandMore } from "@mui/icons-material";

const GPACalculator = () => {
  const [years, setYears] = useState(data.years);
  const [expandedYears, setExpandedYears] = useState([]);
  const [gpaMessage, setGpaMessage] = useState("");
  const bottomRef = useRef(null);
  const addYear = () => {
    const newYearIndex = years.length; // If no years, index will be 0; otherwise, it will be the next sequential number.

    const newYear = {
      yearIndex: newYearIndex,
      semesters: [
        {
          courses: [{ name: "Sample Class", grade: "4.0", weight: "Normal" }],
        },
        {
          courses: [{ name: "Sample Class", grade: "4.0", weight: "Normal" }],
        },
      ],
    };

    setYears([...years, newYear]);
  };
  const removeYear = (yearIndex) => {
    // Remove the year at the given yearIndex
    const newYears = years.filter((_, index) => index !== yearIndex);

    // Update yearIndex for all subsequent years
    const updatedYears = newYears.map((year, index) => ({
      ...year,
      yearIndex: index, // Update the yearIndex to match the new position
    }));

    setYears(updatedYears);
  };
  const [finalWeightedGPA, setFinalWeightedGpa] = useState("N/A");
  const [finalUnweightedGPA, setFinalUnweightedGpa] = useState("N/A");
  const handleCourseChange = (yearIndex, semesterIndex, newCourses,gradeFormat) => {
    const updatedYears = years.map((year, yIndex) => {
      if (yIndex === yearIndex) {
        return {
          ...year,
          semesters: year.semesters.map((semester, sIndex) => {
            if (sIndex === semesterIndex) {
              return { ...semester, courses: newCourses };
            }
            return semester;
          }),
        };
      }
      return year;
    });
    setYears(updatedYears);
  };
  useEffect(() => {
    calculateGPA();
  }, [years]);
  const handleRemoveCourse = (yearIndex, semesterIndex, courseIndex) => {
    const updatedYears = [...years];
    updatedYears[yearIndex].semesters[semesterIndex].courses.splice(
      courseIndex,
      1
    );
    setYears(updatedYears);
  };
  const calculateGPA = () => {
    let totalUnweightedGPA = 0;
    let totalWeightedGPA = 0;
    let totalYears = 0;
    console.log(years);
    years.filter((val)=>val).forEach((year) => {
      let yearUnweightedGPA = 0;
      let yearWeightedGPA = 0;
      let totalSemesters = 0;
      console.log(year);
      year.semesters.forEach((semester) => {
        let semesterPointsUnweighted = 0;
        let semesterPointsWeighted = 0;
        let semesterCourses = 0;

        semester.courses.forEach((course) => {
          const grade = parseFloat(course.grade);
          if (!isNaN(grade)) {
            semesterCourses += 1;
            semesterPointsUnweighted += Math.min(grade, 4); // Unweighted GPA capped at 4.0

            // Weighted GPA calculations for AP courses
            if (course.weight === "AP") {
              semesterPointsWeighted += Math.min(grade * (5 / 4), 5); // Convert to a 5.0 scale
            } else {
              semesterPointsWeighted += Math.min(grade, 4);
            }
          }
        });

        if (semesterCourses > 0) {
          yearUnweightedGPA += semesterPointsUnweighted / semesterCourses;
          yearWeightedGPA += semesterPointsWeighted / semesterCourses;
          totalSemesters += 1;
        }
      });

      if (totalSemesters > 0) {
        totalUnweightedGPA += yearUnweightedGPA / totalSemesters;
        totalWeightedGPA += yearWeightedGPA / totalSemesters;
        totalYears += 1;
      }
    });
    const finalUnweightedGPA =
      totalYears > 0 ? (totalUnweightedGPA / totalYears).toFixed(2) : "N/A";
    const finalWeightedGPA =
      totalYears > 0 ? (totalWeightedGPA / totalYears).toFixed(2) : "N/A";
    setFinalUnweightedGpa(finalUnweightedGPA);
    setFinalWeightedGpa(finalWeightedGPA);
    setGpaMessage(
      `Final Unweighted GPA: ${finalUnweightedGPA}, Final Weighted GPA: ${finalWeightedGPA}`
    );

    // Scroll to the bottom message
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const [circleSize, setCircleSize] = useState(70);
  const [expanded, setExpanded] = useState(false); // State to manage the toggle

  const handleToggleExpand = () => {
    setExpanded(!expanded);
    setCircleSize(expanded ? 70 : 200); // Toggle size
  };
  const media=useMediaQuery("(max-width:550px)");
  const [scale, setScale] = useState(1);
  return (
    <div>
      {" "}
      {/* Adjust padding to prevent overlap with the fixed Box */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          right: 0,
          width: "100%",
          transition: "all 0.3s ease-in-out",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          maxHeight: "100vh", // Maximum height to enable scrolling
        }}
      >
        <Card
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            height: expanded ? "300px" : "100px", // Toggle height
            transition: "all 0.3s ease-in-out",
            padding:'0px 20px'
          }}
        >
          <IconButton
            onClick={handleToggleExpand}
            sx={{
              transform: expanded ? "none" : "rotate(180deg)",
              transition: "transform 0.3s",
              marginRight: "12px",
            }}
          >
            <ExpandMore />
          </IconButton>
          <GPACircle
            value={parseFloat(finalUnweightedGPA)}
            text={finalUnweightedGPA}
            label="Unweighted GPA"
            expanded={expanded&&!media}
            size={media&&expanded?100:circleSize}
          />
          <GPACircle
            value={parseFloat(finalWeightedGPA)}
            text={finalWeightedGPA}
            label="Weighted GPA"
            expanded={expanded&&!media}
            size={media&&expanded?100:circleSize}
          />
        </Card>
      </Box>
      <Box
        sx={{
          position: "fixed",
          top: 72,
          zIndex: 0,
          left: 0,
          padding: "20px",
          width: "100%",
          transition: "all 0.3s ease-in-out",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          maxHeight: "100vh", // Maximum height to enable scrolling]
          background: "white",
          gap: "20px",
          display: "flex",
        }}
      >
        <Button variant="contained" onClick={addYear} style={{backgroundColor: "#4e6766"}}>
          Add Year
        </Button>
      </Box>
      <div
        style={{
          padding: "20px",
          marginTop: "60px",
        }}
      >
        {" "}
        {/* Scrollable content */}
        {years.filter((val)=>val).map((year, index) => (
          <YearInput
            key={index}
            yearIndex={year.yearIndex}
            semesters={year.semesters}
            handleCourseChange={handleCourseChange}
            handleRemoveCourse={handleRemoveCourse}
            expandedYears={expandedYears}
            setExpandedYears={setExpandedYears}
            setYears={setYears}
            years={years}
            removeYear={()=>removeYear(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default GPACalculator;
