const TranscriptModel = require('../models/transcript.model');

class TranscriptService {
    async createTranscript(data) {
        return await TranscriptModel.create(data);
    }

    async getTranscriptById(id) {
        return await TranscriptModel.findById(id);
    }

    async getAllTranscripts(query) {
        const { userId, page, limit } = query;
        const filter = userId ? { userId } : {};
        return await TranscriptModel.find(filter)
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();
    }

    async transcriptCount(userId) {
        const filter = userId ? { userId } : {};
        return await TranscriptModel.countDocuments(filter);
    }
    
    async updateTranscriptById(id, data) {
        return await TranscriptModel.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteTranscriptById(id) {
        return await TranscriptModel.findByIdAndDelete(id);
    }
}

module.exports = new TranscriptService();