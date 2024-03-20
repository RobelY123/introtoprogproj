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
  let weightOfValidCategories = 0;
  for (let category of categoriesWithDetails) {
    if (category.grade != CATEGORY_NOT_GRADED_STR)
      weightOfValidCategories +=
        category.name == "All"
          ? 100
          : parseInt(category.Weight?.substring(0, category.Weight.length - 2));
  }

  if (weightOfValidCategories == 0)
    return PERIOD_GRADE_IF_NO_GRADED_ASSIGNMENTS;

  let weightScale = 1 / weightOfValidCategories;
  let grade = 0;
  for (let category of categoriesWithDetails) {
    if (category.grade != CATEGORY_NOT_GRADED_STR && category) {
      grade +=
        category.grade *
        (category.name == "All"
          ? 100
          : parseInt(
              category.Weight?.substring(0, category.Weight.length - 2)
            ));
    }
  }
  grade *= weightScale;
  return grade;
}

/**
 * get category details: name, pointsEarned, pointsPossible, weight (as decimal), grade (as decimal)
 * grade for categories with 0 points possible will be the not graded string
 *     make sure this matches with other code
 *     (it doesn't need to match with assignment not graded string)
 * this will not mutate period, it will clone anything neccessary
 */
function calculateCategoryDetails(period) {
  var categories = _.cloneDeep(
    period.Marks[0].Mark[0].GradeCalculationSummary[0]?.AssignmentGradeCalc?.map(
      (e) => e.$
    )
  )?.filter((e) => e?.Type != "TOTAL");
  // Check if categories is undefined or empty
  if (!categories || categories.length === 0) {
    categories = [{ name: "All", pointsEarned: 0, pointsPossible: 0 }];
  } else {
    // Initialize points for each category
    for (let category of categories) {
      category.pointsEarned = 0;
      category.pointsPossible = 0;
    }
  }
  if(period.Marks[0].Mark[0].Assignments[0].Assignment?.length){
    for (let assignment of period.Marks[0].Mark[0].Assignments[0].Assignment?.filter(
      (e) => e.$.Points.includes("/")
    )) {
      if (categories[0]?.name == "All") {
        categories[0].pointsEarned += parseFloat(
          assignment.$.Score.split(" ")[0]
        );
        categories[0].pointsPossible += parseFloat(
          assignment.$.Score.split(" ")[3]
        );
      } else {
        if (
          parseFloat(assignment.$.Score.split(" ")[0]) ==
            NOT_GRADED_POINTS_EARNED_STR ||
          parseFloat(assignment.$.Score.split(" ")[3]) ==
            NOT_GRADED_POINTS_POSSIBLE_STR
        )
          continue;
        else {
          let category = categories.find((i) => i.Type == assignment.$.Type);

          if (!category) {
            // Handle the case where the assignment's category is not found
            category = categories[0]; // Default to the first/only category
          }
          categories.find((i) => i.Type == assignment.$.Type).pointsEarned +=
            parseFloat(assignment.$.Score.split(" ")[0]);
          categories.find((i) => i.Type == assignment.$.Type).pointsPossible +=
            parseFloat(assignment.$.Score.split(" ")[3]);

        }
      }
    }
  }
  for (let category of categories) {
    if (!category.pointsEarned || !category.pointsPossible) {
      category.pointsEarned = parseFloat(category?.Points);
      category.pointsPossible = parseFloat(category?.PointsPossible);
    } else if (!category.Points || !category.PointsPossible) {
      category.Points = category?.pointsEarned + "";
      category.PointsPossible = category?.pointsPossible + "";
    }
    // Replace commas and convert to numbers
    let points = parseFloat(category.Points?.replace(/,/g, "")) || 0;
    let pointsPossible =
      parseFloat(category.PointsPossible?.replace(/,/g, "")) || 0;
    // Check for division by zero case
    if (pointsPossible === 0) {
      // Assign a default value or a specific indication for 0/0 case
      category.grade = CATEGORY_NOT_GRADED_STR; // Assuming CATEGORY_NOT_GRADED_STR is a constant indicating ungraded category
    } else {
      category.grade = points / pointsPossible;
    }}
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
  ].$.Score = `0 out of ${pointsPossible}`;
  let gradeIf0 = calculateGrade(period2Clone);

  // Simulate full score
  period2Clone.Marks[0].Mark[0].Assignments[0].Assignment[
    assignmentInd
  ].$.Score = `${pointsPossible} out of ${pointsPossible}`;
  let gradeIfFullScore = calculateGrade(period2Clone);

  // Calculate the weight of the assignment based on the change in grade
  let weight = gradeIfFullScore - gradeIf0;

  // Debugging output
  console.log(`Grade if score is 0: ${gradeIf0}`);
  console.log(`Grade if full score: ${gradeIfFullScore}`);
  console.log(`Calculated weight: ${weight}`);

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
  ].$.Score = `0 out of ${pointsPossible}`;

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

  return pointsNeeded.toFixed(2);
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
