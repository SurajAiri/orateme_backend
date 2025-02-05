import express from "express";
import QuestionController from "../controllers/question.controller.js";

const router = express.Router();
router.route("/")
    .get(QuestionController.getAll)
    .post(QuestionController.create);

router.route("/:id")
    .get(QuestionController.getById)
    .patch(QuestionController.updateById)
    .delete(QuestionController.deleteById);

router.get("/random/:quesBankId", QuestionController.getRandomQuestionByQuesBank);
router.post("/many", QuestionController.createMany);
export default router;