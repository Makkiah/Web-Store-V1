const express = require("express")

const app = express()

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

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000")
})