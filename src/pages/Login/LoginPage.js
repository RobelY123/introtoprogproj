"use client";
import React, { useState } from "react";
import {
  TextField,
  Button,
  Paper,
  Box,
  Typography,
  Container,
  styled,
  FormControl,
  InputLabel,
  OutlinedInput,
} from "@mui/material";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const CustomButton = styled(Button)({
    // Increase specificity
    "&&": {
      backgroundColor: "#4db6ac", // Example background color
      color: "white", // Text color
      "&:hover": {
        backgroundColor: "#3a9896", // Example hover state color
      },
      // Add more styles as needed
    },
  });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  // ... other states

  React.useEffect(() => {
    if (loginSuccess) {
      // Navigate to the grades page
      window.location.href = "/grades";
    }
  }, [loginSuccess]);
  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);



    setLoading(false);
  }
  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={6}
        sx={{
          marginTop: 8,
          padding: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          sx={{ mb: 2, mt: 2, color: "black", fontWeight: 700 }}
        >
          Login
        </Typography>
        <Box component="form"  sx={{ mt: 1, width: "100%" }}>
          <Typography sx={{ mb: 1, fontWeight: 500 }} variant="subtitle1">
            Username
          </Typography>
          <TextField
            fullWidth
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Typography
            variant="subtitle1"
            sx={{ mb: 1, mt: 1, fontWeight: 500 }}
          >
            Password
          </Typography>
          <TextField
            fullWidth
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
         <CustomButton
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
            {loading ? "Loading..." : "Login"}
          </CustomButton>
        </Box>
      </Paper>
    </Container>
  );
}
