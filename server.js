const express = require("express");
const path = require("path");
const app = express();
const PORT = 5000;
let registrations = [];
let tournaments = [];
let adminLoggedIn = false;

const ADMIN_USER = "admin";
const ADMIN_PASS = "ryft26";

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

  let html = "";

  tournaments.forEach(t => {
    // Count how many players have registered for this tournament
    let playerCount = registrations.filter(r => r.tournament === t.name).length;

    // If admin set Room ID / Password, show them
    let roomInfo = "";
    if (t.roomId && t.roomPass) {
      roomInfo = `
        <p><strong>Room ID:</strong> ${t.roomId}</p>
        <p><strong>Room Password:</strong> ${t.roomPass}</p>
      `;
    }

    // Build HTML for each tournament card
    html += `
      <div class="tournament-card bg-bgmi">
        <div class="tournament-card-content">
          <h2>${t.name}</h2>
          <p><strong>Game:</strong> ${t.game}</p>
          <p><strong>Mode:</strong> ${t.mode}</p>
          <p><strong>Date:</strong> ${t.date}</p>
          <p><strong>Prize Pool:</strong> ₹${t.prize}</p>
          <p><strong>Players:</strong> ${playerCount} / ${t.maxPlayers}</p>
          ${roomInfo}
        </div>

        <button class="register-button"
          onclick="openRegister('${t.name}', ${t.minAge})">
          Register Now
        </button>
      </div>
    `;
  });

  // Send the full HTML page
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Tournaments | RYFT Esports</title>
        <link rel="stylesheet" href="/css/style.css">
      </head>
      <body class="inner-page">

        <div class="tournament-container">
          <h2>Available Tournaments</h2>
          ${html}
        </div>

        <!-- Registration Modal -->
        <div id="registerModal" class="modal">
          <div class="modal-content">
            <h3 id="tournamentTitle"></h3>
            <form action="/register-tournament" method="POST">
              <input type="hidden" name="tournament" id="tournamentInput">
              <div class="input-group">
                <input type="number" name="age" id="playerAge" required>
                <label>Your Age</label>
              </div>
              <button type="submit" class="auth-btn">Confirm Registration</button>
            </form>
            <p id="ageError" style="color:red; display:none;">
              You do not meet the age requirement.
            </p>
          </div>
        </div>

        <div class="video-background">
          <video autoplay muted loop playsinline>
            <source src="/images/esports-video.mp4" type="video/mp4">
            Your browser does not support the video tag.
          </video>
          <div class="video-overlay"></div>
        </div>

        <script>
          function openRegister(name, minAge) {
            document.getElementById("registerModal").style.display = "flex";
            document.getElementById("tournamentTitle").innerText = name;
            document.getElementById("tournamentInput").value = name;

            const ageInput = document.getElementById("playerAge");
            const form = document.querySelector("#registerModal form");
            const error = document.getElementById("ageError");

            form.onsubmit = function(e) {
              if (parseInt(ageInput.value) < minAge) {
                e.preventDefault();
                error.style.display = "block";
              }
            }
          }

          window.onclick = function(e) {
            const modal = document.getElementById("registerModal");
            if (e.target === modal) {
              modal.style.display = "none";
            }
          }
        </script>

      </body>
    </html>
  `);

});

app.post("/login", (req, res) => {
  res.redirect("/home.html");
});


app.post("/admin-login", (req, res) => {

const { username, password } = req.body;

if(username === ADMIN_USER && password === ADMIN_PASS){
    adminLoggedIn = true;
    res.redirect("/admin-dashboard");
}
else{
    res.send("Invalid admin login");
}

});

app.post("/create-tournament", (req, res) => {
const { name, game, mode, date, prize, minAge } = req.body;
const tournament = {
    name,
    game,
    mode,
    date,
    prize,
    minAge,
    maxPlayers: 100,
    roomId: null,
    roomPass: null

};

tournaments.push(tournament);
res.redirect("/tournaments");
});


app.listen(PORT, () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
  //console.log(`Server running at http://localhost:${PORT}`);
});

app.get("/admin", (req, res) => {

res.send(`
<html>
<head>
<link rel="stylesheet" href="/css/style.css">
</head>

<body class="auth-page">

<div class="auth-container">

<div class="auth-box">

<h2>RYFT ADMIN LOGIN</h2>

<form action="/admin-login" method="POST">

<div class="input-group">
<input type="text" name="username" required>
<label>Username</label>
</div>

<div class="input-group">
<input type="password" name="password" required>
<label>Password</label>
</div>

<button class="auth-btn">Login</button>

</form>

</div>

</div>

</body>
</html>
`);

});


app.get("/admin-dashboard", (req, res) => {

  if(!adminLoggedIn){
      return res.redirect("/admin");
  }

  res.send(`
    <html>

    <head>
    <link rel="stylesheet" href="/css/style.css">
    <style>

    .dashboard{
    max-width:1000px;
    margin:auto;
    padding:40px;
    }

    .dashboard h1{
    text-align:center;
    margin-bottom:40px;
    color:#ff0033;
    }

    .admin-grid{
    display:grid;
    grid-template-columns:repeat(3,1fr);
    gap:20px;
    }

    .admin-card{
    background:#111;
    padding:30px;
    border-radius:12px;
    text-align:center;
    border:1px solid #ff0033;
    cursor:pointer;
    transition:0.3s;
    }

    .admin-card:hover{
    transform:translateY(-5px);
    box-shadow:0 0 20px #ff0033;
    }

    .admin-card h2{
    color:#ff0033;
    }

    </style>

    </head>
      <body class="inner-page">
        <div class="dashboard">
          <h1>RYFT ADMIN PANEL</h1>
          <div class="admin-grid">
          
            <a href="/create-page">
              <div class="admin-card">
                <h2>Create Tournament</h2>
                <p>Add new esports tournaments</p>
              </div>
            </a>

            <a href="/tournaments">
              <div class="admin-card">
                <h2>View Tournaments</h2>
                <p>See all active tournaments</p>
              </div>
            </a>

            <a href="/players">
              <div class="admin-card">
                <h2>Player Registrations</h2>
                <p>View registered players</p>
              </div>
            </a>
          </div>

          <h2 style="color:#ff0033; text-align:center; margin-top:50px;">Set Room ID / Password</h2>
          <form action="/set-room" method="POST" style="max-width:400px; margin:auto; background:#111; padding:20px; border-radius:12px; border:1px solid #ff0033;">
              <div class="input-group">
                  <select name="tournament" required style="width:100%; padding:10px; margin-bottom:15px; background:#222; color:white; border:1px solid #ff0033; border-radius:6px;">
                      <option value="">Select Tournament</option>
                      ${tournaments.map(t => `<option value="${t.name}">${t.name}</option>`).join("")}
                  </select>
              </div>

              <div class="input-group">
                  <input type="text" name="roomId" placeholder="Room ID" required style="width:100%; padding:10px; margin-bottom:15px; background:#222; color:white; border:1px solid #ff0033; border-radius:6px;">
              </div>

              <div class="input-group">
                  <input type="text" name="roomPass" placeholder="Room Password" required style="width:100%; padding:10px; margin-bottom:15px; background:#222; color:white; border:1px solid #ff0033; border-radius:6px;">
              </div>
              <button type="submit" style="width:100%; padding:12px; background:#ff0033; color:white; border:none; border-radius:6px; font-weight:bold; cursor:pointer;">Set Room</button>
          </form>
        </div>
      </body>
    </html>
  `);
});

app.get("/create-page", (req,res)=>{

if(!adminLoggedIn){
return res.redirect("/admin");
}

res.sendFile(__dirname + "/public/admin.html");

});

app.post("/register-tournament", (req, res) => {
const { tournament, age } = req.body;
registrations.push({
    tournament,
    age,
    time: new Date().toLocaleString()
});
res.send("Registration successful!");
});

let playerCount = registrations.filter(r => r.tournament === t.name).length;

app.post("/set-room", (req, res) => {
  const { tournament, roomId, roomPass } = req.body;

  const t = tournaments.find(t => t.name === tournament);
  if (t) {
    t.roomId = roomId;
    t.roomPass = roomPass;
  }

  res.redirect("/admin-dashboard");
});
