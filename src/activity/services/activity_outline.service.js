const ActivityOutline = require('../model/activity_outline.model');

class ActivityOutlineService {
    async  createActivityOutline(data) {
        return await ActivityOutline.create(data);
    }

    async getActivityOutlineById(id) {
        return await ActivityOutline.findById(id);
    }

    async getAllActivityOutlines(query) {
        const { type, page, limit } = query;
        const filter = type ? { type } : {};
        return await ActivityOutline.find(filter)
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();
    }

    async activityOutlineCount(type) {
        const filter = type ? { type } : {};
        return await ActivityOutline.countDocuments(filter);
    }
    
    async updateActivityOutlineById(id, data) {
        return await ActivityOutline.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteActivityOutlineById(id) {
        return await ActivityOutline.findByIdAndDelete(id);
    }
}

module.exports = new ActivityOutlineService();
