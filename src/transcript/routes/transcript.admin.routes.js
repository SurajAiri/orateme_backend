const express = require("express");
const TranscriptController = require("../controllers/transcript.controller");

const router = express.Router();

router.route("/")
.get(TranscriptController.adminGetAll);

router.route("/:userId")
    .post(TranscriptController.adminCreate);

router.route("/:id")
    .get(TranscriptController.getById)
    .patch(TranscriptController.updateById)
    .delete(TranscriptController.deleteById);

module.exports = router;