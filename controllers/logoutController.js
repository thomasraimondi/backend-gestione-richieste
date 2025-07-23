const logout = (req, res) => {
  res.clearCookie("accessToken", { httpOnly: true, secure: true, sameSite: "none" });
  res.json({ message: "Logout" });
};

module.exports = { logout };
