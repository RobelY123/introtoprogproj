import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Container,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const faqs = [
  {
    question: "How does the login work?",
    answer:
      "The login connects to StudentVue and fetches your grades securely.",
  },{
    question: "Can I add my own assignments to courses?",
    answer:
      "Yes, you can add your own assignments to courses. This feature allows you to keep track of all your coursework in one place.",
  },
  {
    question: "Do course grades take into account category weighting?",
    answer:
      "Course grades do consider category weighting. You can customize the weighting for each category with either a normal weight or an Ap weight.",
  },
  {
    question: "What's the difference between weighted and unweighted GPA?",
    answer:
      "Weighted GPA takes into account the difficulty level of your courses, giving higher value to honors and AP classes. Unweighted GPA considers all classes equally, regardless of difficulty.",
  },
  {
    question: "Can I see both unweighted and weighted GPA?",
    answer:
      "Yes, our system provides the option to view both unweighted and weighted GPA so you can track your academic performance comprehensively.",
  },
  {
    question: "How do I change the grade of past assignments?",
    answer:
      "To change the grade of past assignments, go to the assignment list, select the assignment you want to update, and edit the grade directly.",
  },
];

const HelpPage = () => {
  const handleContactSupport = () => {
    window.open(
      `mailto:robelyayeh123@gmail.com?subject=Help`
    );
  };
  return (
    <Container
      sx={{
        mt: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography sx={{ mb: 3 }} variant="h3" fontWeight={600}>
        Help & Support
      </Typography>
      <Card sx={{ minWidth: 275, maxWidth: 700, mb: 2 }}>
        <CardContent>
          <Typography sx={{ mb: 1 }} variant="h5" component="h2">
            Frequently Asked Questions (FAQ)
          </Typography>
          {faqs.map((faq, index) => (
            <Accordion key={index}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </CardContent>
      </Card>

      <Card sx={{ minWidth: 275, maxWidth: 670, mb: 2,p:2 }}>
        <CardContent style={{display:'flex',flexDirection:'column',gap:'10px'}}>
          <Typography variant="h5" component="h2">
            Contact Support
          </Typography>
          <Typography paragraph>
            If you have any questions that are not answered in the FAQ, feel
            free to contact our support team.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleContactSupport}
            style={{maxWidth:'200px'}}
          >
            Contact Support
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default HelpPage;
