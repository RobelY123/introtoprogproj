/**
 * functions for grade display. Ideally, no grades logic should appear anywhere else
 */

import _ from "lodash";

const NOT_GRADED_POINTS_EARNED_STR = "Not graded";
const NOT_GRADED_POINTS_POSSIBLE_STR = "Not graded";
const CATEGORY_NOT_GRADED_STR = "Not graded";
const PERIOD_GRADE_IF_NO_GRADED_ASSIGNMENTS = "N/A";

function getAssignmentPointsEarnedDisplay(assignment) {
  if (assignment && assignment.score !== undefined) {
    if (assignment.score === NOT_GRADED_POINTS_EARNED_STR) return "Not graded";
    else return assignment.score.toString();
  }
  return "N/A"; // or a suitable default/fallback value
}

function getAssignmentPointsPossibleDisplay(assignment) {
  if (assignment && assignment.outOf !== undefined) {
    if (assignment.outOf === NOT_GRADED_POINTS_POSSIBLE_STR)
      return "Not graded";
    else return assignment.outOf.toString();
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
    console.log(category);
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

  for (let assignment of period.Marks[0].Mark[0].Assignments[0].Assignment.filter(
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
        let category = categories.find((i) => i.name == assignment.weight);
        if (!category) {
          // Handle the case where the assignment's category is not found
          category = categories[0]; // Default to the first/only category
        }
        category.pointsEarned += parseFloat(assignment.$.Score.split(" ")[0]);
        category.pointsPossible += parseFloat(assignment.$.Score.split(" ")[3]);
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
    console.log(category);
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
    }
    console.log(category);
  }
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
function calculateAssignmentWeight(period, assignmentInd) {
  if (
    period.assignments[assignmentInd].outOf == NOT_GRADED_POINTS_POSSIBLE_STR
  ) {
    console.error(
      "calculateAssignmentWeight received assignment with outOf = not graded"
    );
    return 1;
  }
  let periodClone = _.cloneDeep(period);
  periodClone.assignments[assignmentInd].score = 0;
  let gradeIf0 = calculateGrade(periodClone);

  periodClone.assignments[assignmentInd].score =
    periodClone.assignments[assignmentInd].outOf;
  let gradeIfFullScore = calculateGrade(periodClone);

  let weight = gradeIfFullScore - gradeIf0;

  return weight;
}
function calculateAssignmentWeightDisplay(period, assignmentInd) {
  if (period.assignments[assignmentInd].outOf == NOT_GRADED_POINTS_POSSIBLE_STR)
    return "N/A";
  else {
    let weight = calculateAssignmentWeight(period, assignmentInd);
    if (Number.isNaN(weight)) console.error("is NaN here");
    return (100 * weight).toFixed(2) + "%";
  }
}

function calculateAssignmentGradeDisplay(assignment) {
  if (
    assignment.score == NOT_GRADED_POINTS_EARNED_STR ||
    assignment.outOf == NOT_GRADED_POINTS_POSSIBLE_STR
  ) {
    return "N/A";
  } else {
    return ((100 * assignment.score) / assignment.outOf).toFixed(2) + "%";
  }
}

function calculatePointsNeededDisplay(period, assignmentInd, grade) {
  if (period.assignments[assignmentInd].outOf == NOT_GRADED_POINTS_POSSIBLE_STR)
    return "N/A";

  //calculate by finding weight, then finding grade if you got a 0, then using these to find the points needed
  let weight = calculateAssignmentWeight(period, assignmentInd);
  let periodClone = _.cloneDeep(period);
  periodClone.assignments[assignmentInd].score = 0;
  let gradeIf0 = calculateGrade(periodClone);

  let pointsNeeded =
    ((grade - gradeIf0) / weight) * period.assignments[assignmentInd].outOf;

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
};
