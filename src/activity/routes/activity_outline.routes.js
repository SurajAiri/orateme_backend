import express from "express";
import  aoController from "../controllers/activity_outline.controller.js";

const router = express.Router();
router.get("/",aoController.getAll);
router.get("/:id",aoController.getById);

//   router.route("/")

export default router;
