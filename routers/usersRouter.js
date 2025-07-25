const express = require("express");
const router = express.Router();
const { updateUser, getUser, updatePassword } = require("../controllers/usersController");
const { checkPasswordEquals } = require("../middleware/Validation/checkPasswordEquals");

router.get("/", getUser);
router.patch("/", updateUser);
router.patch("/password", checkPasswordEquals, updatePassword);

module.exports = router;
