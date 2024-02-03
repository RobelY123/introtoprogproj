import React, { useState } from "react";
import {
  TextField,
  Button,
  Paper,
  Box,
  Typography,
  Container,
  Link,
} from "@mui/material";

export default function Login({ setGrades, setLoggedIn }) {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
  
    // Reset errors
    setUsernameError("");
    setPasswordError("");
    setLoginError("");
  
    // Basic validation
    if (!username) {
      setUsernameError("Username is required");
      setLoading(false);
      return;
    }
    if (!password) {
      setPasswordError("Password is required");
      setLoading(false);
      return;
    }
  
    // Fetch API call
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      if (!response.ok) {
        throw new Error("Login failed. Please check your credentials.");
      }
  
      const data = await response.json();
      console.log(data)
      // Handle the response
      if (data?.token) {
        localStorage.setItem("token", data.token);
        setLoggedIn(true);
        localStorage.setItem("grades", JSON.stringify(data.Gradebook.Gradebook));
      } else {
        throw new Error("No token received. Cannot authenticate.");
      }
    } catch (error) {
      setLoginError(error.message);
    } finally {
      setLoading(false);
    }
  };
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
        <Box
          component="form"
          onSubmit={onSubmit}
          display="flex"
          flexDirection="column"
          alignItems="center"
          sx={{ mt: 1, width: "100%" }}
        >
          <div style={{ width: "100%" }}>
            <Typography sx={{ mb: 1, fontWeight: 500 }} variant="subtitle1">
              Username
            </Typography>
            <TextField
              fullWidth
              autoFocus
              error={!!usernameError}
              helperText={usernameError}
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
              error={!!passwordError}
              helperText={passwordError}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Typography color="error" sx={{ mt: 2 }}>
              {loginError}
            </Typography>
          </div>
          <Link href="/help" style={{ fontSize: "1.2em" }}>
            Need Help?
          </Link>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
