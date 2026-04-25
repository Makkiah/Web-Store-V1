// Setup
const pool = require("./db")
const express = require("express")

const app = express()

app.use(express.urlencoded({ extended: true })) // This is middleware that parses incoming request bodies

// POST Methods

// app.post("/signup", (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password){
//     return res.send("All fields required!");
//   }
//   console.log("New Signup:")
//   console.log("Email: " + email)
//   console.log("Password: " + password)
//   res.redirect("/dashboard")
// })

app.post("/login", (req, res) => {
  const {email, password} = req.body;
  if (!email || !password){
    return res.status(400).send("All fields required!");
  }
  console.log("Email: " + email)
  console.log("Password: " + password)
  res.redirect("/dashboard")
})

app.post("/signup", async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.send("All fields required")
  }

  try {
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
      [email, password]
    )

    console.log(`New User Created => Email: ${email}, Password: ${password}`)

    res.redirect("/dashboard")
  } catch (err) {
    console.error(err)

    if (err.code === "23505") {
      return res.send("User already exists")
    }

    res.send("Error creating user")
  }
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
app.get("/users", async (req, res) => {
  const result = await pool.query("SELECT * FROM users")
  res.json(result.rows)
})
aapp.get("/makkiah", async (req, res) => {
  const result = await pool.query("SELECT * FROM users WHERE email = 'makkiahf@gmail.com")
  res.json(result)
})

// Listen
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000")
})