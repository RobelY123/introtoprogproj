require("dotenv").config();
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const jwt = require("jsonwebtoken");
const synergy = require("./synergy.js");
const cors = require("cors");
app.use(cors());
const PORT = process.env.PORT || 8000;
app.use(
  session({
    secret: "secret",//process.env.SESSION_SECRET, // Use an environment variable for the secret
    cookie: {},
    resave: true,
    saveUninitialized: true,
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Example login route
app.post("/login", (req, res) => {
  // Your login logic here
});

app.post("/api/login", async (req, res) => {
  try {
    // Step 1: Verify user credentials
    // For example, check if username and password are correct
    // This is a simplified example; in a real application, you should check against your database
    const userIsValid = req.body.username != "" && req.body.password != "";

    if (!userIsValid) {
      return res.status(401).send("Invalid credentials");
    }

    // Step 2: Generate Token
    const token = jwt.sign(
      { username: req.body.username },
        "secret",
      { expiresIn: "1h" }
    );

    // Step 3: Fetch gradebook data
    const gradebook = await synergy.getGradebook(
      req.body.username,
      req.body.password,
      req.body.urlSubdomain
    );

    // Step 4: Send token and gradebook data in response
    res.json({ token, Gradebook: gradebook });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error processing request");
  }
});
// Example logout route
app.post("/logout", (req, res) => {
  // Your logout logic here
});

// Serve static files from the React app
// app.use(express.static(path.join(__dirname, "..", "build")));
// // The "catchall" handler for any requests that don't match one above
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "..", "build", "index.html"));
// });
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
