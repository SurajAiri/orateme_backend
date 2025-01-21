const express = require("express");
const router = express.Router();
const aoController = require("../controllers/activity_outline.controller");

router.get("/",aoController.getAll);
router.get("/:id",aoController.getById);

//   router.route("/")

module.exports = router;
