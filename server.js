const express = require("express");
const path = require("path");

const app = express();
const PORT = 8000;

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.redirect("/home.html");
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "signup.html"));
});

app.get("/tournaments", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "tournaments.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});

app.post("/login", (req, res) => {
  res.redirect("/home.html");
});

app.get('/tournaments', (req, res) => {
    res.sendFile(__dirname + '/public/tournaments.html');
});
