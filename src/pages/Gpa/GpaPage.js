import React, { useRef, useState } from "react";
import YearInput from "./YearInput";
import { Button, Typography } from "@mui/material";
import { data } from "./gpa";

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

  const handleCourseChange = (yearIndex, semesterIndex, newCourses) => {
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
console.log(years)
    years.forEach((year) => {
      let yearUnweightedGPA = 0;
      let yearWeightedGPA = 0;
      let totalSemesters = 0;
      console.log(year)
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

    setGpaMessage(
      `Final Unweighted GPA: ${finalUnweightedGPA}, Final Weighted GPA: ${finalWeightedGPA}`
    );

    // Scroll to the bottom message
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div style={{ padding: "30px" }}>
      <div style={{ display: "flex", gap: 20, marginBottom: "20px" }}>
        <Button variant="contained" onClick={addYear}>
          Add Year
        </Button>
        <Button variant="contained" color="warning" onClick={calculateGPA}>
          Calculate GPA
        </Button>
      </div>
      {years.map((year, index) => (
        <YearInput
          key={index}
          yearIndex={year.yearIndex}
          semesters={year.semesters} // Pass the semesters data to the YearInput
          handleCourseChange={handleCourseChange}
          handleRemoveCourse={handleRemoveCourse}
          expandedYears={expandedYears}
          setExpandedYears={setExpandedYears}
          setYears={setYears}
          years={years}
          removeYear={removeYear}
        />
      ))}
      <div ref={bottomRef}>
        <Typography variant="h6">{gpaMessage}</Typography>
      </div>
    </div>
  );
};

export default GPACalculator;
