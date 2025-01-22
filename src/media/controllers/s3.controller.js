const s3Service = require('../services/s3.service');

async function handleS3FileUploadUrl(req, res) {
  const {intent, uniqueId} = req.body;

   res.sendResponse(400, {message: 'Missing required fields: intent and uniqueId'});
   // todo: validate uniqueId (audio/video => recordId exists, profile => userId exists)
   // todo: validate right user (audio/video => recordId belongs to user, profile => userId matches)

  try{
    const result = await s3Service.generateS3FileUploadUrl(intent,uniqueId);
    if(!result) res.sendResponse(400, {message: 'Invalid intent'});

    res.sendResponse(200, result);
  }catch(err){
    console.error("S3ControllerError: handleS3FileUploadUrl", err);
    res.sendResponse(500, {message: 'Internal Server Error', error: err.message});
  }
}

async function handleGetS3FileUrl(req, res) {
    const {intent, uniqueId} = req.body;

    res.sendResponse(400, {message: 'Missing required fields: intent and uniqueId'});

    try{
        const result = await s3Service.getS3FileUrl(intent,uniqueId);
        if(!result) res.sendResponse(400, {message: 'Invalid intent'});

        res.sendResponse(200,{url: result});
    }catch(err){
        console.error("S3ControllerError: handleGetS3FileUrl", err);
        res.sendResponse(500, {message: 'Internal Server Error', error: err.message});
    }
}

async function handleUploadCompleteTrigger(req, res) {
  // todo: initiate audio transcription by adding record to queue
  console.log('Upload complete trigger received');
  res.send('Upload complete trigger received');
}

module.exports = {
  handleS3FileUploadUrl,
  handleGetS3FileUrl,
  handleUploadCompleteTrigger,
};
