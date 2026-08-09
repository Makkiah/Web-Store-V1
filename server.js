// Setup
const pool = require("./db")
const express = require("express")
const bcrypt = require("bcrypt")
const session = require("express-session")
const requireAuth = require("./middleware/auth")
const app = express()

app.use(
  session({
    secret: "your-secret",
    resave: false,
    saveUninitialized: false,
  })
)

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

app.post("/login", async (req, res) => {
  const {email, password} = req.body;
  
  if (!email || !password){
    return res.status(400).send("All fields required!")
  }
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email])
  const user = result.rows[0]
  if (!user) {
    return res.send("Invalid email or password")
  }
  const isMatch = await bcrypt.compare(password, user.password)
  if(!isMatch){
    return res.send("Invalid")
  }
  req.session.userId = user.id
  res.redirect("/dashboard")
})

app.post("/signup", async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.send("All fields required")
  }

  try {
    const hashPass = await bcrypt.hash(password, 10)
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
      [email, hashPass]
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
app.get("/dashboard", requireAuth, (req, res) => {
  res.sendFile(__dirname + "/views/dashboard.html")
})
app.get("/users", requireAuth, async (req, res) => {
  const result = await pool.query("SELECT * FROM users")
  const list = result.rows.map(user => `<li>${user.email}</li>`).join("")
  res.send(`<h1>Users</h1><ul>${list}</ul>`)
})
app.get("/user/:email", requireAuth, async (req, res) => {
  const email = req.params.email;
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email])
  res.json(result.rows)
})
app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/login"))
})

// Listen
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000")
})