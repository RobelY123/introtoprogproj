require("dotenv").config();
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const synergy = require("./synergy.js");
const cors = require("cors");
app.use(cors());
const PORT = process.env.PORT || 5000;
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Use an environment variable for the secret
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
    const gradebook = await synergy.getGradebook(
      req.body.username,
      req.body.password,
      req.body.urlSubdomain
    );
    console.log(typeof gradebook);
    var invalid = {
      RT_ERROR: {
        $: { ERROR_MESSAGE: "Invalid user id or password (ID: F09A6)" },
      },
    };
    if (gradebook["RT_ERROR"]) {
      return res.status(401).send("Invalid credentials");
    }
    res.json(gradebook);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching gradebook");
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
