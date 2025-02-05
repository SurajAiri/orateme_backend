import express from "express";
import activityAdminController from "../controllers/activity.admin.controller.js";

const router = express.Router();
router.get('/', activityAdminController.getAll);

router.get('/:id', activityAdminController.getById);

export default router;