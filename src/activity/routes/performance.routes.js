import express from "express";
import PerformanceController from "../controllers/performance.controller.js";

const router = express.Router();

router.route("/")
    .get(PerformanceController.getAll)
    .post(PerformanceController.createWithEvaluator);

// router.route("/data")

router.route("/:id")
    .get(PerformanceController.getById)
    .patch(PerformanceController.updateById)
    .delete(PerformanceController.deleteById);

export default router;