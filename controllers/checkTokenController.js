const jwt = require("jsonwebtoken");

const checkToken = (req, res) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      res.cookie("accessToken", "", {
        httpOnly: true,
        expires: new Date(0),
        path: "/",
      });
      return res.status(401).json({ message: "Token is invalid", error: err });
    }
    const user = {
      id: decoded.id,
      name: decoded.name,
      lastname: decoded.lastname,
      email: decoded.email,
      username: decoded.username,
      role: decoded.role,
    };

    const expDate = new Date(decoded.exp * 1000);
    console.log("Token expires at:", expDate.toLocaleString("it-IT", { timeZone: "Europe/Rome" }));

    return res.status(200).json({ message: "Token is valid", user: user });
  });
};

module.exports = { checkToken };
