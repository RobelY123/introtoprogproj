/**
 * functions for grade display. Ideally, no grades logic should appear anywhere else
 */

import _ from "lodash";

const NOT_GRADED_POINTS_EARNED_STR = "Not graded";
const NOT_GRADED_POINTS_POSSIBLE_STR = "Not graded";
const CATEGORY_NOT_GRADED_STR = "Not graded";
const PERIOD_GRADE_IF_NO_GRADED_ASSIGNMENTS = "N/A";

function getAssignmentPointsEarnedDisplay(assignment) {
  if (assignment && assignment.Points.split(" ")[0] !== undefined) {
    if (assignment.Points.split(" ")[0] === NOT_GRADED_POINTS_EARNED_STR)
      return "Not graded";
    else return assignment.Points.split(" ")[0].toString();
  }
  return "N/A"; // or a suitable default/fallback value
}

function getAssignmentPointsPossibleDisplay(assignment) {
  if (assignment && assignment.Points.split(" ")[2] !== undefined) {
    if (assignment.Points.split(" ")[2] === NOT_GRADED_POINTS_POSSIBLE_STR)
      return "Not graded";
    else return assignment.Points.split(" ")[2].toString();
  }
  return "N/A"; // or a suitable default/fallback value
}

//calculate grade as percentage (without percent sign), round to 2 decimal points
function calculateGradeDisplay(period) {
  let grade = calculateGrade(period);
  if (grade !== undefined && grade !== PERIOD_GRADE_IF_NO_GRADED_ASSIGNMENTS) {
    return (100 * grade).toFixed(2).toString();
  }
  return "N/A";
}

/**
 * calculate grade
 * any category out of 0 points are not counted
 *     if a category is all extra credit and is 5/0, it will also be not counted
 * return as decimal (0.912 instead of 91.2)
 */
function calculateGrade(period) {
  let categoriesWithDetails = calculateCategoryDetails(period);

  let totalWeight = 0;
  let weightedGradeSum = 0;

  // Calculate the sum of the weighted grades and the total weight
  for (let category of categoriesWithDetails) {
    if (category.grade !== CATEGORY_NOT_GRADED_STR) {
      let weight =
        category.Type === "All" ? 1 : parseFloat(category.Weight) / 100;
      totalWeight += weight;
      weightedGradeSum += weight * category.grade;
    }
  }

  if (totalWeight === 0) {
    return PERIOD_GRADE_IF_NO_GRADED_ASSIGNMENTS;
  }

  // Calculate final grade based on the weighted sum of grades
  return weightedGradeSum / totalWeight;
}

function calculateCategoryDetails(period) {
  var categories = _.cloneDeep(
    period.Marks[0].Mark[0].GradeCalculationSummary[0]?.AssignmentGradeCalc?.map(
      (e) => e.$
    )
  )?.filter((e) => e?.Type !== "TOTAL");

  if (!categories || categories.length === 0) {
    categories = [
      { name: "All", pointsEarned: 0, pointsPossible: 0, Weight: "100%" },
    ];
  } else {
    for (let category of categories) {
      category.pointsEarned = 0;
      category.pointsPossible = 0;
    }
  }

  period.Marks[0].Mark[0].Assignments[0].Assignment.forEach((assignment) => {
    let [pointsEarnedStr, pointsPossibleStr] = assignment.$.Points.split(" / ");
    let pointsEarned = parseFloat(pointsEarnedStr);
    let pointsPossible = parseFloat(pointsPossibleStr);

    // Validate parsed numbers
    if (isNaN(pointsEarned) || isNaN(pointsPossible)) {
      return; // Skip this assignment due to invalid numbers
    }
    if (categories.length === 1 && categories[0].Type === "All") {
      categories[0].pointsEarned += pointsEarned;
      categories[0].pointsPossible += pointsPossible;
    } else {
      let category = categories.find((c) => c.Type === assignment.$.Type);
      if (category) {
        category.pointsEarned += pointsEarned;
        category.pointsPossible += pointsPossible;
      }
    }
  });
  categories.forEach((category) => { if (
      parseFloat(category.PointsPossible) === 0 ||
      isNaN(category.pointsPossible)
    ) {
      category.grade = CATEGORY_NOT_GRADED_STR;
    } else {
      category.grade =
        parseFloat(category.pointsEarned) / parseFloat(category.pointsPossible);

    }
    // Parse Weight to a decimal
    category.Weight = category.Weight?.endsWith("%")
      ? parseFloat(category.Weight) / 100
      : parseFloat(category.Weight);
  });
  return categories;
}
function calculateCategoryDetailsDisplay(period) {
  let categoriesWithDetails = calculateCategoryDetails(period);
  for (let category of categoriesWithDetails) {
    if (category.grade == CATEGORY_NOT_GRADED_STR)
      category.displayGrade = "N/A";
    else category.displayGrade = (100 * category.grade).toFixed(2) + "%";

    category.displayWeight = 100 * category.weight + "%";
  }
  return categoriesWithDetails;
}

/**
 * return assignment weight as decimal, errors out (and returns 1 to not break anything) if pointsPossible is not graded
 *
 * if pointsEarned is not graded, this will calculate weight as if it was graded
 */
function calculateAssignmentWeight(period, assignmentInd, period2) {
  const assignmentPoints = period[assignmentInd].Points.split(" ");
  const pointsPossible = assignmentPoints[2];

  // Check if the assignment is not graded
  if (pointsPossible === NOT_GRADED_POINTS_POSSIBLE_STR) {
    console.error(
      "calculateAssignmentWeight received assignment with outOf = not graded"
    );
    return 1; // Return 1 to prevent division by zero in subsequent calculations
  }

  // Clone period2 to simulate different scores for the assignment
  let period2Clone = _.cloneDeep(period2);
  // Simulate score of 0
  period2Clone.Marks[0].Mark[0].Assignments[0].Assignment[
    assignmentInd
  ].$.Points = `0 / ${pointsPossible}`;
  let gradeIf0 = calculateGrade(period2Clone);

  let period1Clone = _.cloneDeep(period2);
  // Simulate full score
  period1Clone.Marks[0].Mark[0].Assignments[0].Assignment[
    assignmentInd
  ].$.Points = `${pointsPossible} / ${pointsPossible}`;
  let gradeIfFullScore = calculateGrade(period1Clone);
  // Calculate the weight of the assignment based on the change in grade
  let weight = gradeIfFullScore - gradeIf0;

  // If there is no change in grade, there might be a problem with the grade calculation logic
  if (weight === 0) {
    console.error(
      "No change in grade detected. There may be an issue with the grade calculation logic."
    );
    return 0; // You may decide to return 0 or handle this case differently
  }

  return weight;
}
function calculateAssignmentWeightDisplay(period, assignmentInd, period2) {
  if (
    period[assignmentInd].Points.split(" ")[2] == NOT_GRADED_POINTS_POSSIBLE_STR
  )
    return "N/A";
  else {
    let weight = calculateAssignmentWeight(period, assignmentInd, period2);
    if (Number.isNaN(weight)) console.error("is NaN here");
    return (100 * weight).toFixed(2) + "%";
  }
}

function calculateAssignmentGradeDisplay(assignment) {
  if (
    assignment.Points.split(" ")[0] == NOT_GRADED_POINTS_EARNED_STR ||
    assignment.Points.split(" ")[2] == NOT_GRADED_POINTS_POSSIBLE_STR
  ) {
    return "N/A";
  } else {
    return (
      (
        (100 * assignment.Points.split(" ")[0]) /
        assignment.Points.split(" ")[2]
      ).toFixed(2) + "%"
    );
  }
}

function calculatePointsNeededDisplay(
  period,
  assignmentInd,
  desiredGrade,
  period2
) {
  const assignment = period[assignmentInd];
  const pointsData = assignment.Points.split(" ");
  const pointsPossible = parseFloat(pointsData[2]);

  // Check if the assignment is graded
  if (pointsData[2] === NOT_GRADED_POINTS_POSSIBLE_STR) {
    return "N/A";
  }

  // Calculate the weight of the assignment
  let weight = calculateAssignmentWeight(period, assignmentInd, period2);

  // Validate weight to prevent division by zero
  if (weight === 0 || isNaN(weight)) {
    console.error("Weight is zero or NaN, cannot calculate points needed.");
    return "Calculation error";
  }

  // Clone period2 and simulate a score of 0 for the assignment
  let period2Clone = _.cloneDeep(period2);
  period2Clone.Marks[0].Mark[0].Assignments[0].Assignment[
    assignmentInd
  ].$.Points = `0 / ${pointsPossible}`;

  // Calculate the grade if an assignment score was 0
  let gradeIf0 = calculateGrade(period2Clone);

  // Validate that desiredGrade is greater than gradeIf0
  if (desiredGrade < gradeIf0) {
    console.error(
      "Desired grade is less than grade if 0, cannot calculate points needed."
    );
    return "Desired grade is not achievable";
  }

  // Calculate points needed based on desired grade, current grade if 0, and weight
  let pointsNeeded = ((desiredGrade - gradeIf0) / weight) * pointsPossible;

  // Final validation to check if pointsNeeded calculation is valid
  if (!isFinite(pointsNeeded)) {
    console.error("Points needed calculation resulted in a non-finite number.");
    return "Calculation error";
  }

  return pointsNeeded.toFixed(3);
}

export {
  NOT_GRADED_POINTS_EARNED_STR,
  NOT_GRADED_POINTS_POSSIBLE_STR,
  CATEGORY_NOT_GRADED_STR,
  getAssignmentPointsEarnedDisplay,
  getAssignmentPointsPossibleDisplay,
  calculateGradeDisplay,
  calculateCategoryDetailsDisplay,
  calculateAssignmentWeightDisplay,
  calculateAssignmentGradeDisplay,
  calculatePointsNeededDisplay,
  calculateCategoryDetails,
};
