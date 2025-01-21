const express = require("express");
const router = express.Router();
const activityAdminController = require("../controllers/activity.admin.controller");

router.get('/', activityAdminController.getAll);

router.get('/:id', activityAdminController.getById);

module.exports = router;