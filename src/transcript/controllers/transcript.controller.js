const transcriptService = require('../services/transcript.service');
const transcriptValidator = require('../validators/transcript.validator');
const { DEFAULT_LIMIT, DEFAULT_PAGE } = require('../../config/constants');

class TranscriptController {
    // common operations [private access]
    async _createTranscript(userId, body, res) {
        if (!userId) return res.sendResponse(401, { message: 'Unauthorized user' });
        try {
            const { error, value } = transcriptValidator.createTranscript.validate(body);
            if (error) return res.sendResponse(400, { message: error.message });
            value.userId = userId;

            const transcript = await transcriptService.createTranscript(value);
            return res.sendResponse(201, transcript);
        } catch (err) {
            console.error('TranscriptControllerError: create', err);
            return res.sendResponse(500, { message: 'Internal Server Error', error: err.message });
        }
    }
    
    // todo: Yet to restrict user to see only their transcript
    adminCreate = async (req, res) => {
        const { userId } = req.params;
        return this._createTranscript(userId, req.body, res);
    }

    userCreate = async (req, res) => {
        const { id: userId } = req.user;

        return this._createTranscript(userId, req.body, res);
    }

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
}

module.exports = new TranscriptController();