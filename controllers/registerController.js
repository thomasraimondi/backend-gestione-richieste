const connection = require("../db/db");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const registerUser = async (req, res) => {
  const { username, password, email, name, lastname } = req.body;
  console.log(req.body);

  const querySelectUser = "SELECT * FROM users WHERE username = ? OR email = ?";
  connection.query(querySelectUser, [username, email], async (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error registering user", error: err });
    }
    if (result.length > 0) {
      if (result[0].username === username) {
        return res.status(400).json({ message: "Username already exists" });
      }
      if (result[0].email === email) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }
    if (result.length === 0) {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const query = "INSERT INTO users (username, password, email, name, lastname, role) VALUES (?, ?, ?, ?, ?, ?)";
      connection.query(query, [username, hashedPassword, email, name, lastname, "crew"], (err, result) => {
        if (err) {
          return res.status(500).json({ message: "Error registering user", error: err });
        }
        res.status(200).json({ message: "User registered successfully", user: result });
      });
    }
  });
};

module.exports = { registerUser };
