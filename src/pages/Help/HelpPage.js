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
  },
  {
    question: "What can the chatbot do?",
    answer:
      "The chatbot can assist you with navigation, provide information about your grades, and answer common questions.",
  },
  // Add more FAQs as needed
];

const HelpPage = () => {
  const handleContactSupport = () => {
    window.open(
      `mailto:robelyayeh123@gmail.com?subject=Support Request&body=Please describe your issue or question:`
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
