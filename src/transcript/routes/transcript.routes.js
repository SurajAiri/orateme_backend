import express from "express";
import TranscriptController from "../controllers/transcript.controller.js";


const router = express.Router();

router.post("/data",TranscriptController.userCreateWithData);
router.post("/url",TranscriptController.userCreateWithUrl);

router.get("/:id",TranscriptController.getById);

export default router;