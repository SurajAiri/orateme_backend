// const s3Service = require('../services/cloudinary.service');
const s3Service = require('../services/b2.blaze.service');

async function handleS3FileUploadUrl(req, res) {
  const {intent, uniqueId} = req.body;
  console.log('handleS3FileUploadUrl', intent, uniqueId);
  if(!intent || !uniqueId)
    res.sendResponse(400, {message: 'Missing required fields: intent and uniqueId'});
   // onnext: validate uniqueId (audio/video => recordId exists, profile => userId exists)
   // onnext: validate right user (audio/video => recordId belongs to user, profile => userId matches)

  try{
    const result = await s3Service.generateB2FileUploadUrl(intent,uniqueId);
    if(!result) res.sendResponse(400, {message: 'Invalid intent'});

    res.sendResponse(200, result);
  }catch(err){
    console.error("S3ControllerError: handleS3FileUploadUrl", err);
    res.sendResponse(500, {message: 'Internal Server Error', error: err.message});
  }
}

async function handleGetS3FileUrl(req, res) {
    const {intent, uniqueId} = req.body;

    if(!intent || !uniqueId)
     return res.sendResponse(400, {message: 'Missing required fields: intent and uniqueId'});

    try{
        const result = await s3Service.getB2FileUrl(intent,uniqueId);
        if(!result) res.sendResponse(400, {message: 'Invalid intent'});

        res.sendResponse(200,{url: result});
    }catch(err){
        console.error("S3ControllerError: handleGetS3FileUrl", err);
        res.sendResponse(500, {message: 'Internal Server Error', error: err.message});
    }
}

async function handleUploadCompleteTrigger(req, res) {
  // onnext: initiate audio transcription by adding record to queue
  console.log('Upload complete trigger received');
  res.send('Upload complete trigger received');
}

module.exports = {
  handleS3FileUploadUrl,
  handleGetS3FileUrl,
  handleUploadCompleteTrigger,
};
