const transcriptService = require('../services/transcript.service');
const transcriptValidator = require('../validators/transcript.validator');
const { DEFAULT_LIMIT, DEFAULT_PAGE } = require('../../config/constants');
const{ transcribeAudioWithUrl} = require('../transcriber/deepgram.transcriber');
const { parseTranscriptDeepgram } = require('../utils/parse_transcript');
const recordService = require('../../activity/services/record.service');

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
    // onnext: Yet to restrict user to see only their transcript
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

    async _createTranscriptWithData(res, userId,recordId, body) {
        // 1. check if user is authorized and recordId is provided
        if (!userId) return res.sendResponse(401, { message: 'Unauthorized user' });
        if (!recordId) return res.sendResponse(400, { message: 'recordId is required' });

        try {
            //onnext: 2. validate record and user

            // 3. validate transcript data
            const { error, value } = transcriptValidator.createTranscript.validate(body);
            if (error) return res.sendResponse(400, { message: error.message });
            value.userId = userId;

            // 4. create transcript
            const transcript = await transcriptService.createTranscript(value);

            // 5. update transcript id in record
            const record = await recordService.updateRecordById(recordId, { transcriptId: transcript._id });
            if (!record) return res.sendResponse(404, { message: 'Record not found' });
            // onnext: rollback transcript creation if record update fails

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
        const { userId, recordId, ...body } = req.body;
        return this._createTranscriptWithData(res, userId,recordId, body);
    }

    userCreateWithData = async (req, res) => {
        const { id: userId } = req.user;
        const { recordId, ...body } = req.body;

        return this._createTranscriptWithData(res, userId,recordId, body);
    }

    // onnext: refactor transcript creation with data and url
    async _createTranscriptWithUrl(res, userId, recordId, audioUrl) {
        // 1. check if user is authorized and audioUrl is provided and recordId is provided
        if (!userId) return res.sendResponse(401, { message: 'Unauthorized user' });
        if(!audioUrl || !recordId) return res.sendResponse(400, { message: 'audioUrl and recordId are required parameters' });

        try {
            // onnext: 2. validate record and user

            // 3. transcribe audio
            const transcript = await transcribeAudioWithUrl(audioUrl);
            const response = parseTranscriptDeepgram(transcript);

            // 4. validate transcript data
            const { error, value } = transcriptValidator.createTranscript.validate(response);
            if (error) return res.sendResponse(400, { message: error.message });
            value.userId = userId;

            // 5. create transcript
            const tns = await transcriptService.createTranscript(value);
            if(!tns) return res.sendResponse(400, { message: 'Transcript not created' });

            // 6. update transcript id in record
            const record = await recordService.updateRecordById(recordId, { transcriptId: tns._id });
            if (!record) return res.sendResponse(404, { message: 'Record not found' });

            // onnext: rollback transcript creation if record update fails
            return res.sendResponse(201, tns);

        } catch (err) {
            console.error('TranscriptControllerError: create', err);
            return res.sendResponse(500, { message: 'Internal Server Error', error: err.message });
        }

    }
    
    adminCreateWithUrl = async (req, res)=> {
        const { userId, recordId, audioUrl } = req.body;
        return this._createTranscriptWithUrl(res, userId,recordId, audioUrl);
    }
    
     userCreateWithUrl = async(req, res)=>{
        const { id: userId } = req.user;
        const { recordId, audioUrl } = req.body;
        return this._createTranscriptWithUrl(res, userId,recordId, audioUrl);
    }


}

module.exports = new TranscriptController();