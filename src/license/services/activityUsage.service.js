import ActivityUsageModel from '../models/activityUsage.model.js';
import mongoose from 'mongoose';

class ActivityUsageService {
    async createActivityUsage(data) {
        return await ActivityUsageModel.create(data);
    }

    async getById(id) {
        return await ActivityUsageModel.findById(id);
    }

    async getAllActivityUsages(query) {
        const { userId, activityId, page = 1, limit = 10 } = query;
        const filter = {};
        
        if (userId) filter.userId = userId;
        if (activityId) filter.activityId = activityId;

        return await ActivityUsageModel.find(filter)
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('userId')
            .populate('activityId')
            .exec();
    }

async getWeeklyActivityUsageByUserId(userId, periodHours) {
        return await ActivityUsageModel.aggregate([
            { 
                $match: { userId: new mongoose.Types.ObjectId(userId) } 
            },
            {
                $group: {
                    _id: {
                        $dateTrunc: {
                            date: "$timestamp",
                            unit: "hour",
                            binSize: periodHours
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            { 
                $sort: { "_id": 1 } 
            }
        ]);
    }

    async getWeeklyCostMultiplierByUserId(userId) {
        return await ActivityUsageModel.aggregate([
            { $match: { userId } },
            {
                $group: {
                    _id: { $week: '$timestamp' },
                    costMultiplier: { $sum: '$costMultiplier' }
                }
            }
        ]);
    }

    async activityUsageCount(query) {
        const { userId, activityId } = query;
        const filter = {};
        
        if (userId) filter.userId = userId;
        if (activityId) filter.activityId = activityId;

        return await ActivityUsageModel.countDocuments(filter);
    }

    async updateActivityUsageById(id, data) {
        return await ActivityUsageModel.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteActivityUsageById(id) {
        return await ActivityUsageModel.findByIdAndDelete(id);
    }
}

export default new ActivityUsageService();