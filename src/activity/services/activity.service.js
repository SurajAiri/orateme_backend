const ActivitySchema = require('../model/activity.model');
const recordSchema = require('../model/record.model')

class ActivitySchemaService {
    async createActivity(data) {
        return await ActivitySchema.create(data);
    }

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