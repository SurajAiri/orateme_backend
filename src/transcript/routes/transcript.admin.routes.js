import express from "express";
import TranscriptController from "../controllers/transcript.controller.js";

const router = express.Router();

router.route("/")
.get(TranscriptController.getAll);

router.post("/data/",TranscriptController.adminCreateWithData);
router.post("/url/",TranscriptController.adminCreateWithUrl);

router.route("/:id")
    .get(TranscriptController.getById)
    .patch(TranscriptController.updateById)
    .delete(TranscriptController.deleteById);

export default router;