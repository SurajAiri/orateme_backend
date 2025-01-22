const express = require("express");
const router = express.Router();
const QuestionController = require("../controllers/question_bank.controller")

router.route("/")
    .get(QuestionController.getAll)
    .post(QuestionController.create);

router.route("/:id")
    .get(QuestionController.getById)
    .patch(QuestionController.updateById)
    .delete(QuestionController.deleteById);

module.exports = router;