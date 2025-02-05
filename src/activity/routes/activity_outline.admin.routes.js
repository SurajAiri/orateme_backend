import express from "express";
import aoController from "../controllers/activity_outline.controller.js";

const router = express.Router();
router
  .route("/")
  .get(aoController.getAll)
  .post(aoController.create);

router.route("/:id")
  .get(aoController.getById)
  .patch(aoController.updateById)
  .delete(aoController.deleteById);

//   router.route("/")

export default router;
