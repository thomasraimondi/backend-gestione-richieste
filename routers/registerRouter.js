const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/registerController");
const { checkPasswordEquals } = require("../middleware/Validation/checkPasswordEquals");
const { checkRegister } = require("../middleware/Validation/checkRegister");

router.post("/", checkRegister, checkPasswordEquals, registerUser);

module.exports = router;
