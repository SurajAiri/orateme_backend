import express from "express";
import licenseController from "../controllers/license.controller.js";

const router = express.Router();
router.post("/",licenseController.adminCreate);
// router.get("/",licenseController.);

router.route("/:id")
    .get(licenseController.getById);

router.patch("/suspend/:id",licenseController.suspendById); 
router.post("/limit",licenseController.adminLicenseActivityLimitInfo);

export default router;