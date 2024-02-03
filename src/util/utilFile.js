export const convertToLetterGrade = (grade) => {
    if (grade >= 92.5) return "A";
    if (grade >= 89.5) return "A-";
    if (grade >= 86.5) return "B+";
    if (grade >= 82.5) return "B";
    if (grade >= 79.5) return "B-";
    if (grade >= 76.5) return "C+";
    if (grade >= 72.5) return "C";
    if (grade >= 69.5) return "C-";
    if (grade >= 66.5) return "D+";
    if (grade >= 59.5) return "D";
    return "F";
  };