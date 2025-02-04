const express = require('express');
const s3Controller = require('../controllers/s3.controller');

const router = express.Router();

router.post('/upload', s3Controller.handleS3FileUploadUrl);
router.post('/access', s3Controller.handleGetS3FileUrl);
router.post('/complete', s3Controller.handleUploadCompleteTrigger);

module.exports = router;
