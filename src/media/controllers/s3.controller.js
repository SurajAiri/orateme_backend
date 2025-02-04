// const s3Service = require('../services/cloudinary.service');
const transcriptController = require('../../transcript/controllers/transcript.controller');
const s3Service = require('../services/b2.blaze.service');

async function handleS3FileUploadUrl(req, res) {
  const {intent, uniqueId} = req.body;
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
  const {intent,uniqueId} = req.body;
  const {id: userId} = req.user;

  if(!uniqueId)
    return res.sendResponse(400, {message: 'Missing required fields: uniqueId'});

  try{
    // onnext: validate right user (recordId belongs to user)
    // onnext: validate record exists
    // onnext: validate record is in uploaded state
    // onnext: update record state to processing

    // get audio url from record // onnext: upload file intent manage later
    const fileRes = await s3Service.getB2FileUrl('video', uniqueId);
    if(!fileRes)return res.sendResponse(404, {message: 'File not uploaded'});

    // onnext: check if record is already in transcription queue

    // parse audioUrl
    console.log('fileRes', fileRes);
    const audioUrl = fileRes;
    console.log('audioUrl', audioUrl);

    // add record to transcription queue
    return transcriptController._createTranscriptWithUrl(res, userId, recordId=uniqueId, audioUrl);
    // return res.sendResponse(200, {message: 'Transcription initiated'});
  }catch(err){
    console.error("S3ControllerError: handleUploadCompleteTrigger", err);
    return res.sendResponse(500, {message: 'Internal Server Error', error: err.message});
  }
}

module.exports = {
  handleS3FileUploadUrl,
  handleGetS3FileUrl,
  handleUploadCompleteTrigger,
};
