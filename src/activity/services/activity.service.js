import ActivitySchema from '../model/activity.model.js';

class ActivitySchemaService {
    async createActivity(data) {
        const r = await ActivitySchema.create(data);
        return (await r.populate('actOutId')).populate({
            path: 'recordId',
            populate: {
                path: 'quesId'
            }
            });
    }
    // async getUncompletedActivity(userId, actOutId) {
    //     return await ActivitySchema.findOne({ userId, actOutId, completed: false });
    // }

    // async createActivityTransaction( userId, actOutId, questionCount, ques) {
    //     const session = await ActivitySchema.startSession();
    //     session.startTransaction();
    //     console.log(ques);
    
    //     try {
    //         // Create records with transaction
    //         const rec_ids = await Promise.all(
    //             ques.map(async (q) => {
    //                 const record = await recordSchema.createRecordSchema(
    //                     { question: q }, 
    //                     { session }
    //                 );
                    
    //                 if (!record) {
    //                     throw new Error('Record creation failed');
    //                 }
                    
    //                 return record._id;
    //             })
    //         );
    
    //         // Create activity
    //         const activity = await ActivityService.createActivity({
    //             userId,
    //             actOutId,
    //             recordId: rec_ids,
    //             recordCount: questionCount
    //         }, { session });
    
    //         await session.commitTransaction();
    //         return activity;
    
    //     } catch (error) {
    //         await session.abortTransaction();
    //         throw error;
    //     } finally {
    //         session.endSession();
    //     }
    // }
    async getById(id) {
        return await ActivitySchema.findById(id)
            .populate('actOutId')
            .populate({
            path: 'recordId',
            populate: {
                path: 'quesId'
            }
            })
            .populate('overallPerformanceId');

    }

    async getAll(query) {
        const { type, userId, page, limit,onlyCompleted=false } = query;
        const filter = {};
        if (type) filter.type = type;
        if (userId) filter.userId = userId;
        if(onlyCompleted)
            filter.overallPerformanceId = { $exists: true, $ne: null };
        return await ActivitySchema.find(filter)
            .populate('actOutId')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();
    }

    async getAllCompleted(query) {
        const { type, userId, page, limit } = query;
        const filter = {};
        if (type) filter.type = type;
        if (userId) filter.userId = userId;
        filter.overallPerformanceId = { $exists: true, $ne: null };
        return await ActivitySchema.find(filter)
            .populate('actOutId')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();
    }

    async activityCount(type, userId,onlyCompleted=false) {
        const filter = {};
        if (type) filter.type = type;
        if (userId) filter.userId = userId;
        if(onlyCompleted)
            filter.overallPerformanceId = { $exists: true, $ne: null };
        return await ActivitySchema.countDocuments(filter);
    }
    async completedActivityCount(type, userId) {
        const filter = {};
        if (type) filter.type = type;
        if (userId) filter.userId = userId;
        filter.overallPerformanceId = { $exists: true, $ne: null };
        return await ActivitySchema.countDocuments(filter);
    }
    
    async updateById(id, data) {
        return await ActivitySchema.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteById(id) {
        return await ActivitySchema.findByIdAndDelete(id);
    }
}

export default new ActivitySchemaService();