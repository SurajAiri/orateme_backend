import express from "express";
import QuestionController from "../controllers/question_bank.controller.js";

const router = express.Router();
router.route("/")
    .get(QuestionController.getAll)
    .post(QuestionController.create);

router.route("/:id")
    .get(QuestionController.getById)
    .patch(QuestionController.updateById)
    .delete(QuestionController.deleteById);

export default router;