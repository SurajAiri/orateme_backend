import express from "express";
import licenseOutlineController from "../controllers/licenseOutline.controller.js";

const router = express.Router();
router.get("/",licenseOutlineController.getActivePackages);

export default router;