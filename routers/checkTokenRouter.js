const express = require("express");
const router = express.Router();
const { checkToken } = require("../controllers/checkTokenController");

router.get("/", checkToken);

module.exports = router;
