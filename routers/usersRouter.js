const express = require("express");
const { updateUser, getUser } = require("../controllers/usersController");
const router = express.Router();

router.get("/", getUser);
router.patch("/", updateUser);

module.exports = router;
