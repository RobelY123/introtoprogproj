export var mockGrades = {
  Courses: [
    {
      Course: [
        {
          $: {
            Title: "Mathematics",
            Period: "1",
          },
          Marks: [
            {
              Mark: [
                {
                  Assignments: [
                    {
                      Assignment: [
                        {
                          $: {
                            Measure: "Homework 1",
                            Score: "18 out of 20",
                            Points: "18 / 20",
                            Type: "Homework",
                          },
                        },
                        {
                          $: {
                            Measure: "Quiz 1",
                            Score: "22 out of 25",
                            Points: "22 / 25",
                            Type: "Quiz",
                          },
                        },
                        {
                          $: {
                            Measure: "Midterm Exam",
                            Score: "45 out of 50",
                            Points: "45 / 50",
                            Type: "Exam",
                          },
                        },
                      ],
                    },
                  ],
                  GradeCalculationSummary: [
                    {
                      AssignmentGradeCalc: [
                        {
                          $: {
                            Type: "Homework",
                            Weight: "25%",
                          },
                        },
                        {
                          $: {
                            Type: "Quiz",
                            Weight: "35%",
                          },
                        },
                        {
                          $: {
                            Type: "Exam",
                            Weight: "40%",
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        // Additional courses would follow the same structure...
      ],
    },
  ],
};
