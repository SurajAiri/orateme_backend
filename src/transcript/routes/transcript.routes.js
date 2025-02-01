const express = require("express");
const TranscriptController = require("../controllers/transcript.controller");

const router = express.Router();

router.post("/data",TranscriptController.userCreateWithData);
router.post("/url",TranscriptController.userCreateWithUrl);

router.get("/:id",TranscriptController.getById);

module.exports = router;