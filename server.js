// Setup
const express = require("express")

const app = express()

app.use(express.urlencoded({ extended: true })) // This is middleware that parses incoming request bodies

// POST Methods

app.post("/signup", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password){
    return res.send("All fields required!");
  }
  console.log("New Signup:")
  console.log("Email: " + email)
  console.log("Password: " + password)
  res.redirect("/dashboard")
})

app.post("/login", (req, res) => {
  const {email, password} = req.body;
  if (!email || !password){
    return res.status(400).send("All fields required!");
  }
  console.log("Email: " + email)
  console.log("Password: " + password)
  res.redirect("/dashboard")
})

// GET Methods

app.get("/", (req, res) => {
  res.send("Server running")
})

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/views/login.html")
})
app.get("/signup", (req, res) => {
  res.sendFile(__dirname + "/views/signup.html")
})
app.get("/dashboard", (req, res) => {
  res.sendFile(__dirname + "/views/dashboard.html")
})


// Listen
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000")
})