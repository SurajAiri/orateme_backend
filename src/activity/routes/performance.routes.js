const express = require("express");
const PerformanceController = require("../controllers/performance.controller");

const router = express.Router();

router.route("/")
    .get(PerformanceController.getAll)
    .post(PerformanceController.createWithEvaluator);

// router.route("/data")

router.route("/:id")
    .get(PerformanceController.getById)
    .patch(PerformanceController.updateById)
    .delete(PerformanceController.deleteById);

module.exports = router;