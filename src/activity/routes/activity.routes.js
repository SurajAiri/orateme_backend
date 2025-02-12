import express from "express";
import activityController from "../controllers/activity.controller.js";

const router = express.Router();
router.route('/')
    .get(activityController.getAll)
    .post(activityController.create);

router.get("/rec/:id", activityController.getRecordById);

router.route('/:id')
    .get(activityController.getById);
    // .patch(activityController.update)



export default router;