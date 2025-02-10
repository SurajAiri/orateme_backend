import express from "express";
import licenseOutlineController from "../controllers/licenseOutline.controller";

router = express.Router();
router.get("/",licenseOutlineController.getActivePackages);

export default router;