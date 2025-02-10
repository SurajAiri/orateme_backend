import express from "express";
import licenseController from "../controllers/license.controller";

router = express.Router();
router.post("/",licenseController.createByAdmin);
// router.get("/",licenseController.);

router.use("/:id")
    .get(licenseController.getById);

router.patch("/suspend/:id",licenseController.suspendById); 

export default router;