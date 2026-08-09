const { Pool } = require("pg")

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "creator_store",
  password: "Trunklife23@",
  port: 5432,
})

module.exports = pool