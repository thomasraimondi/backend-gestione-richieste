const connection = require("../db/db");
const bcrypt = require("bcrypt");

const checkLogin = async (req, res, next) => {
  const { username, password } = req.body;
  const error = {};

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const querySelectUser = "SELECT * FROM users WHERE username = ?";
  connection.query(querySelectUser, [username], async (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error logging in", error: err });
    }
    if (result.length === 0) {
      error.username = { message: "Invalid username" };
    }

    if (result.length > 0) {
      const user = {
        id: result[0].id,
        name: result[0].name,
        lastname: result[0].lastname,
        email: result[0].email,
        username: result[0].username,
        role: result[0].role,
      };

      req.user = user;
      const isPasswordValid = await bcrypt.compare(password, result[0].password);
      if (!isPasswordValid) {
        error.password = { message: "Invalid password" };
      }
    }

    if (error.username || error.password) {
      return res.status(401).json({ error: error });
    } else {
      next();
    }
  });
};

module.exports = { checkLogin };
