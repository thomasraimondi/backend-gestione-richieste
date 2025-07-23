const express = require("express");
const router = express.Router();
const { loginUser } = require("../controllers/loginController");
const { checkLogin } = require("../middleware/checkLogin");

router.post("/", checkLogin, loginUser);

module.exports = router;
