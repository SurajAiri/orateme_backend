import express from 'express';
import * as s3Controller from '../controllers/s3.controller.js';

const router = express.Router();

router.post('/upload', s3Controller.handleS3FileUploadUrl);
router.post('/access', s3Controller.handleGetS3FileUrl);
router.post('/complete', s3Controller.handleUploadCompleteTrigger);

export default router;
