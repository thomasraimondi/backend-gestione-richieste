const express = require("express");
const router = express.Router();
const { getUserRequests, getCrewRequests, getManagerRequests, createRequest, updateRequest, getRequest } = require("../controllers/requestsController");
const { checkCreateRequest } = require("../middleware/Validation/checkCreateRequest");
const { checkUpdateRequest } = require("../middleware/Validation/checkUpdateRequest");

router.get("/user", getUserRequests);
router.get("/crew", getCrewRequests);
router.get("/manager", getManagerRequests);
router.get("/:id", getRequest);
router.post("/", checkCreateRequest, createRequest);
router.patch("/update", checkUpdateRequest, updateRequest);

module.exports = router;
