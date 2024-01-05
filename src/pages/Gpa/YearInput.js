import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  IconButton,
  Typography,
  Select,
  MenuItem,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery,
  Divider,
  FormControlLabel,
  Switch,
  Checkbox,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { ExpandMore } from "@mui/icons-material";

const SemesterInput = ({
  semesterIndex,
  yearIndex,
  handleCourseChange,
  handleRemoveCourse,
  letterGrade,
}) => {
  const matches2 = useMediaQuery("(max-width:550px)");
  const matches = useMediaQuery("(max-width:700px)");
  // State to store courses for each semester
  const [courses, setCourses] = useState([
    { name: "Sample Class", grade: "4.0", weight: "Normal" },
  ]);
  const [gradeFormat, setGradeFormat] = useState("4.0"); // "4.0" or "100"

  const handleGradeChange = (index, value) => {
    let formattedValue;

    // Check if value is a letter grade and convert to GPA points
    if (letterGrades.hasOwnProperty(value.toUpperCase())) {
      formattedValue = letterGrades[value.toUpperCase()];
    } else {
      // If value is a number, parse it and ensure it's within the GPA range
      formattedValue = parseFloat(value);
      if (formattedValue < 1.0) formattedValue = 1.0;
      else if (formattedValue > 4.0 && gradeFormat == "4.0")
        formattedValue = 4.0;
      else if (formattedValue > 100.0 && gradeFormat == "100")
        formattedValue = 100.0;
    }

    updateCourse(index, "grade", formattedValue.toString());
  };
  useEffect(() => {
    const updatedCourses = courses.map((course) => {
      const closestLetterGrade = findClosestGrade(course.grade);
      return { ...course, grade: closestLetterGrade };
    });

    // Update the courses state
    setCourses(updatedCourses);

    // Also propagate this change to the parent component
    handleCourseChange(yearIndex, semesterIndex, updatedCourses);
  }, [gradeFormat]);
  const handleLetterGradeChange = (index) => {
    const numericalGrade = parseFloat(courses[index].grade);
    const closestLetterGrade = findClosestGrade(numericalGrade);
    updateCourse(index, "grade", closestLetterGrade);
  };
  const toggleGradeFormat = (event) => {
    const newFormat = event.target.checked ? "100" : "4.0";
    const conversionFactor = newFormat === "4.0" ? 25 : 4;

    const convertedCourses = courses.map((course) => {
      let convertedGrade = course.grade;
      if (convertedGrade !== "") {
        convertedGrade = parseFloat(convertedGrade) / conversionFactor;
        // Limit the grade based on the new format
        convertedGrade =
          newFormat === "4.0"
            ? Math.min(convertedGrade, 4)
            : Math.min(convertedGrade, 100);
      }
      return { ...course, grade: convertedGrade.toString() };
    });

    setCourses(convertedCourses);
    setGradeFormat(newFormat);
  };

  const addCourse = () => {
    setCourses([...courses, { name: "", grade: "", weight: "" }]);
  };
  const letterGrades = {
    A: 4.0,
    "A-": 3.7,
    "B+": 3.3,
    B: 3.0,
    "B-": 2.7,
    "C+": 2.3,
    C: 2.0,
    "C-": 1.7,
    "D+": 1.3,
    D: 1.0,
    F: 0.0,
  };
  const updateCourse = (index, field, value) => {
    const newCourses = [...courses];
    newCourses[index][field] = value;
    setCourses(newCourses);
    handleCourseChange(yearIndex, semesterIndex, newCourses);

    validateInput(newCourses[index], index, field);
  };
  const [courseErrors, setCourseErrors] = useState(
    courses.map(() => ({ name: false, grade: false, weight: false }))
  );
  useEffect(() => {
    setCourseErrors([
      ...courseErrors,
      { name: false, grade: false, weight: false },
    ]);
  }, [courses]);
  const validateInput = (course, index, field) => {
    const newCourseErrors = [...courseErrors];
    // Validate each field of the course
    newCourseErrors[index] = {
      name: field != "name" ? newCourseErrors[index].name : !course.name,
      grade:
        field != "grade"
          ? newCourseErrors[index].grade
          : !course.grade || isNaN(parseFloat(course.grade)),
      weight: !course.weight,
    };

    setCourseErrors(newCourseErrors);
  };
  const gradeMapping = [
    { letter: "A", min: 4.0 },
    { letter: "A-", min: 3.7 },
    { letter: "B+", min: 3.3 },
    { letter: "B", min: 3.0 },
    { letter: "B-", min: 2.7 },
    { letter: "C+", min: 2.3 },
    { letter: "C", min: 2.0 },
    { letter: "C-", min: 1.7 },
    { letter: "D+", min: 1.3 },
    { letter: "D", min: 1.0 },
    { letter: "F", min: 0.0 },
  ];
  const findClosestGrade = (numericalGrade) => {
    // Start with the lowest grade by default
    let closestGrade = gradeMapping[gradeMapping.length - 1].letter;

    // Iterate over the grade mapping to find the closest grade
    for (let i = 0; i < gradeMapping.length; i++) {
      if (numericalGrade >= gradeMapping[i].min) {
        closestGrade = gradeMapping[i].letter;
        break;
      }
    }
    return closestGrade;
  };
  return (
    <Card
      variant="outlined"
      sx={{
        flex: 1,
        mb: 2,
        p: 1,
      }}
    >
      <CardContent>
        <div
          style={{
            marginBottom: 10,
            gap: 5,
            display: "flex",
            flexDirection: matches2 ? "column" : "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h6" style={{ fontSize: "1.1em" }}>
              Semester {semesterIndex + 1} ({courses.length})
            </Typography>
            <IconButton onClick={addCourse}>
              <AddCircleOutlineIcon />
            </IconButton>
          </div>
          <FormControlLabel
            style={{ display: letterGrade ? "none" : "" }}
            control={
              <Switch
                checked={gradeFormat === "100"}
                onChange={toggleGradeFormat}
              />
            }
            label={
              <Typography sx={{ fontSize: "0.8em" }}>
                {gradeFormat === "100" ? "Percentage (/100)" : "GPA (/4.0)"}
              </Typography>
            }
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {courses.map((course, index) => (
            <>
              <div
                key={index}
                style={{
                  gap: matches ? 15 : 8,
                  display: "flex",
                  mb: 1,
                  flexDirection: matches ? "column" : "row",
                }}
              >
                <TextField
                  label="Course Name"
                  error={courseErrors[index]?.name} // Use optional chaining
                  helperText={
                    courseErrors[index]?.name ? "Course name is required" : ""
                  }
                  variant="outlined"
                  value={course.name}
                  onChange={(e) => updateCourse(index, "name", e.target.value)}
                  sx={{ mr: !matches ? 1 : 0, flex: 2 }}
                />
                {letterGrade ? (
                  <TextField
                    select
                    label="Grade"
                    helperText={
                      courseErrors[index]?.grade
                        ? "Valid grade is required"
                        : ""
                    }
                    sx={{ flex: 0.7 }}
                    value={course.grade || "4"} // Directly use the course.grade value
                    onChange={(e) =>
                      handleLetterGradeChange(index, e.target.value)
                    }
                    defaultValue={"4"}
                    // ... other props
                  >
                    {Object.entries(letterGrades).map(([label, value]) => (
                      <MenuItem
                        key={label}
                        value={parseFloat(value.toString()).toFixed(1)}
                      >
                        {label}
                      </MenuItem>
                    ))}
                  </TextField>
                ) : (
                  <TextField
                    variant="outlined"
                    label="Grade"
                    error={courseErrors[index]?.grade}
                    helperText={
                      courseErrors[index]?.grade
                        ? "Valid grade is required"
                        : ""
                    }
                    value={course.grade}
                    type="number"
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => handleGradeChange(index, e.target.value)}
                    InputProps={{
                      inputProps: {
                        max: gradeFormat === "4.0" ? 4.0 : 100.0,
                        min: 1.0,
                        maxLength: 4,
                      },
                      endAdornment: (
                        <Typography variant="body2">
                          {gradeFormat === "4.0" ? "/4.0" : "/100%"}
                        </Typography>
                      ),
                      sx: {
                        paddingRight: gradeFormat === "4.0" ? 1.5 : 1, // Adjust padding based on format
                      },
                    }}
                    sx={{
                      mr: !matches ? 1 : 0,
                      flex: gradeFormat === "4.0" ? 1 : 1.5,
                    }}
                  />
                )}

                <TextField
                  value={course.weight || "Normal"}
                  onChange={(e) =>
                    updateCourse(index, "weight", e.target.value)
                  }
                  select
                  label="Weight"
                  sx={{ flex: 1 }}
                >
                  <MenuItem value="Normal">Normal</MenuItem>
                  <MenuItem value="AP">AP</MenuItem>
                </TextField>
                <div
                  style={{
                    width: matches ? "100%" : "inherit",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <IconButton
                    style={{
                      height: "50%",
                      margin: "auto 0",
                      maxWidth: "40px",
                    }}
                    onClick={() =>
                      handleRemoveCourse(yearIndex, semesterIndex, index)
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              </div>
              {index != courses.length - 1 ? <Divider sx={{ m: 0.5 }} /> : ""}
            </>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const YearInput = ({
  yearIndex,
  handleCourseChange,
  handleRemoveCourse,
  expandedYears,
  setExpandedYears,
}) => {
  const matches = useMediaQuery("(max-width:1200px)");
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedYears((prev) => {
      if (isExpanded && !prev.includes(panel)) {
        return [...prev, panel];
      } else {
        return prev.filter((p) => p !== panel);
      }
    });
  };
  const [letter, setLetter] = useState(false);
  return (
    <Accordion
      expanded={expandedYears.includes(`panel${yearIndex}`)}
      onChange={handleAccordionChange(`panel${yearIndex}`)}
      sx={{ p: 2 }}
      style={{ margin: "20px 0" }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls={`panel${yearIndex}bh-content`}
        id={`panel${yearIndex}bh-header`}
      >
        <div style={{ gap: "10px", display: "flex", alignItems: "center" }}>
          <Typography variant="h5" sx={{ m: 0 }}>
            Year {yearIndex + 1}
          </Typography>
          <div
            style={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <Checkbox
              checked={letter}
              onChange={(e) => {
                e.stopPropagation(); // Prevent the accordion from toggling
                setLetter(!letter);
              }}
              onClick={(e) => {
                e.stopPropagation(); // Also prevent the accordion from toggling when clicking the checkbox
              }}
            />
            <Typography sx={{ fontSize: "0.8em" }}>Letter Grade</Typography>
          </div>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <Container style={{ maxWidth: "none" }} sx={{ p: 1 }}>
          <div
            style={{
              display: "flex",
              flexDirection: matches ? "column" : "row",
              gap: matches ? 20 : 40,
              width: "100%",
            }}
          >
            <SemesterInput
              semesterIndex={0}
              yearIndex={yearIndex}
              handleCourseChange={handleCourseChange}
              handleRemoveCourse={handleRemoveCourse}
              letterGrade={letter}
            />
            <SemesterInput
              semesterIndex={1}
              yearIndex={yearIndex}
              handleCourseChange={handleCourseChange}
              handleRemoveCourse={handleRemoveCourse}
              letterGrade={letter}
            />
          </div>
        </Container>
      </AccordionDetails>
    </Accordion>
  );
};

export default YearInput;
