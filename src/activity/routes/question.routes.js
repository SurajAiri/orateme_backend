const express = require("express");
const router = express.Router();
const QuestionController = require("../controllers/question.controller")

router.get("/",QuestionController.getAll);
router.get("/:id",QuestionController.getById);

module.exports = router;