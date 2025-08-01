const connection = require("../db/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const getUser = (req, res) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token is invalid" });
    }
    const userid = decoded.id;
    const query = `SELECT * FROM users WHERE id = ?`;
    const values = [userid];
    connection.query(query, values, (err, result) => {
      if (err) throw err;
      const user = result[0];
      res.status(200).json(user);
    });
  });
};

const updateUser = (req, res) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token is invalid" });
    }
    const userid = decoded.id;
    const { name, lastname, email } = req.body;
    const query = `UPDATE users SET name = ?, lastname = ?, email = ? WHERE id = ?`;
    const values = [name, lastname, email, userid];
    connection.query(query, values, (err, result) => {
      if (err) throw err;
      res.status(200).json({ message: "User updated successfully" });
    });
  });
};

const updatePassword = (req, res) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token is invalid" });
    }
    const userid = decoded.id;
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const query = `UPDATE users SET password = ? WHERE id = ?`;
    const values = [hashedPassword, userid];
    connection.query(query, values, (err, result) => {
      if (err) throw err;
      res.status(200).json({ message: "Password updated successfully" });
    });
  });
};

module.exports = { updateUser, getUser, updatePassword };
