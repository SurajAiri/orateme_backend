const express = require("express");
const TranscriptController = require("../controllers/transcript.controller");

const router = express.Router();

router.route("/")
.get(TranscriptController.getAll);

router.post("/data/:userId",TranscriptController.adminCreateWithData);
router.post("/url/:userId",TranscriptController.adminCreateWithUrl);

router.route("/:id")
    .get(TranscriptController.getById)
    .patch(TranscriptController.updateById)
    .delete(TranscriptController.deleteById);

module.exports = router;