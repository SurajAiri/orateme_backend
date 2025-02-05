import express from "express";
import QuestionController from "../controllers/question.controller.js"

const router = express.Router();
// router.get("/",QuestionController.getAll);
router.get("/:id",QuestionController.getById);

export default router;