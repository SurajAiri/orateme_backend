const ActivitySchema = require('../model/activity.model');

class ActivitySchemaService {
    async createActivity(data) {
        return await ActivitySchema.create(data);
    }

    async getById(id) {
        return await ActivitySchema.findById(id)
            .populate('actOutId')
            .populate('overallPerformanceId');
    }

    async getAll(query) {
        // todo: properly populate actOutId
        const { type, userId, page, limit } = query;
        const filter = {};
        if (type) filter.type = type;
        if (userId) filter.userId = userId;
        return await ActivitySchema.find(filter)
            .populate('actOutId')
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();
    }

    async activityCount(type, userId) {
        const filter = {};
        if (type) filter.type = type;
        if (userId) filter.userId = userId;
        return await ActivitySchema.countDocuments(filter);
    }
    
    async updateById(id, data) {
        return await ActivitySchema.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteById(id) {
        return await ActivitySchema.findByIdAndDelete(id);
    }
}

module.exports = new ActivitySchemaService();