const express = require("express");
const TranscriptController = require("../controllers/transcript.controller");

const router = express.Router();

router.route("/")
        .post(TranscriptController.userCreate);
    // .get(TranscriptController.getAll)

router.route("/:id")
    .get(TranscriptController.getById);
    // .patch(TranscriptController.updateById)
    // .delete(TranscriptController.deleteById);

module.exports = router;