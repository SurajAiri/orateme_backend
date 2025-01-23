const express = require("express");
const router = express.Router();
const QuestionController = require("../controllers/question.controller")

router.route("/")
    .get(QuestionController.getAll)
    .post(QuestionController.create);

router.route("/:id")
    .get(QuestionController.getById)
    .patch(QuestionController.updateById)
    .delete(QuestionController.deleteById);

router.get("/random/:quesBankId", QuestionController.getRandomQuestionByQuesBank);
router.post("/many", QuestionController.createMany);
module.exports = router;