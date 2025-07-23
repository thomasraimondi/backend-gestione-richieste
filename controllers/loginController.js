const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES });
};

const loginUser = async (req, res) => {
  const { user } = req;

  const accessToken = generateAccessToken(user);

  res.cookie("accessToken", accessToken, { httpOnly: true });
  res.status(200).json({ message: "Login successful", user: user });
};

module.exports = { loginUser };
