const transcriptService = require('../services/transcript.service');
const transcriptValidator = require('../validators/transcript.validator');
const { DEFAULT_LIMIT, DEFAULT_PAGE } = require('../../config/constants');
const{ transcribeAudioWithUrl} = require('../transcriber/deepgram.transcriber');
const { parseTranscriptDeepgram } = require('../utils/parse_transcript');

class TranscriptController {

    async getAll(req, res) {
        const { userId, page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = req.query;
        try {
            const transcripts = await transcriptService.getAllTranscripts({ userId, page, limit });
            if (!transcripts || transcripts.length === 0) return res.sendResponse(404, { message: 'Transcripts not found' });

            const totalCount = await transcriptService.transcriptCount(userId);

            return res.sendResponse(200, transcripts, "success", { 
                page: parseInt(page), 
                limit: parseInt(limit), 
                totalCount, 
                totalPages: Math.ceil(totalCount / limit) 
            });
        } catch (err) {
            console.error('TranscriptControllerError: getAll', err);
            
            if (err.name === 'CastError' && err.path === 'userId') {
                return res.sendResponse(404, { message: 'User not found' });
            }
            return res.sendResponse(500, { message: 'Internal Server Error', error: err.message });
        }
    }


    async updateById(req, res) {
        const { id } = req.params;
        try {
            const { error, value } = transcriptValidator.updateTranscript.validate(req.body);
            if (error) return res.sendResponse(400, { message: error.message });
            
            const transcript = await transcriptService.updateTranscriptById(id, value);
            if (!transcript) return res.sendResponse(404, { message: 'Transcript not found' });
            return res.sendResponse(200, transcript);
        } catch (err) {
            console.error('TranscriptControllerError: updateById', err);
            return res.sendResponse(500, { message: 'Internal Server Error', error: err.message });
        }
    }

    async deleteById(req, res) {
        const { id } = req.params;
        try {
            const transcript = await transcriptService.deleteTranscriptById(id);
            if (!transcript) return res.sendResponse(404, { message: 'Transcript not found' });
            return res.sendResponse(200, { message: 'Transcript deleted' });
        } catch (err) {
            console.error('TranscriptControllerError: deleteById', err);
            return res.sendResponse(500, { message: 'Internal Server Error', error: err.message });
        }
    }

    // common operations [private access]
    // todo: Yet to restrict user to see only their transcript
    async getById(req, res) {
        const { id } = req.params;
        try {
            const transcript = await transcriptService.getTranscriptById(id);
            if (!transcript) return res.sendResponse(404, { message: 'Transcript not found' });
            return res.sendResponse(200, transcript);
        } catch (err) {
            console.error('TranscriptControllerError: getById', err);
            return res.sendResponse(500, { message: 'Internal Server Error', error: err.message });
        }
    }

    async _createTranscriptWithData(userId, body, res) {
        if (!userId) return res.sendResponse(401, { message: 'Unauthorized user' });
        try {
            const { error, value } = transcriptValidator.createTranscript.validate(body);
            if (error) return res.sendResponse(400, { message: error.message });
            value.userId = userId;

            const transcript = await transcriptService.createTranscript(value);
            return res.sendResponse(201, transcript);
        } catch (err) {
            console.error('TranscriptControllerError: create', err);

            if (err.name === 'CastError' && err.path === 'userId') {
                return res.sendResponse(404, { message: 'User not found' });
            }

            return res.sendResponse(500, { message: 'Internal Server Error', error: err.message });
        }
    }

     adminCreateWithData = async(req, res) =>{
        const { userId } = req.params;
        return this._createTranscriptWithData(userId, req.body, res);
    }

    userCreateWithData = async (req, res) => {
        const { id: userId } = req.user;

        return this._createTranscriptWithData(userId, req.body, res);
    }

    async _createTranscriptWithUrl(userId,audioUrl, res) {
        if (!userId) return res.sendResponse(401, { message: 'Unauthorized user' });
        if(!audioUrl) return res.sendResponse(400, { message: 'audioUrl is required' });
        try {
            
            const transcript = await transcribeAudioWithUrl(audioUrl);
            const response = parseTranscriptDeepgram(transcript);
            const { error, value } = transcriptValidator.createTranscript.validate(response);
            if (error) return res.sendResponse(400, { message: error.message });
            value.userId = userId;
            const tns = await transcriptService.createTranscript(value);
            // transcript.userId = userId;
            // const tns = await transcriptService.createTranscript(transcript);

            if(!tns) return res.sendResponse(400, { message: 'Transcript not created' });
            return res.sendResponse(201, tns);

        } catch (err) {
            console.error('TranscriptControllerError: create', err);
            return res.sendResponse(500, { message: 'Internal Server Error', error: err.message });
        }
    }
    
    adminCreateWithUrl = async (req, res)=> {
        const { userId } = req.params;
        return this._createTranscriptWithUrl(userId,req.body.audioUrl, res);
    }
    
     userCreateWithUrl = async(req, res)=>{
        const { id: userId } = req.user;
        return this._createTranscriptWithUrl(userId,req.body.audioUrl, res);
    }


}

module.exports = new TranscriptController();