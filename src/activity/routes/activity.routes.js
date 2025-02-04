const express = require("express");
const router = express.Router();
const activityController = require("../controllers/activity.controller");

router.route('/')
    .get( activityController.getAll)
    .post(activityController.create);

router.get("/rec/:id", activityController.getRecordById);

router.route('/:id')
    .get(activityController.getById);
    // .patch(activityController.update)



module.exports = router;