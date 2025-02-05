import RecordSchema from '../model/record.model.js';

class RecordSchemaService {
    async createRecordSchema(data) {
        return await RecordSchema.create(data);
    }

    async getRecordSchemaById(id) {
        return await RecordSchema.findById(id);
    }

    async getAllRecordSchemas(query) {
        const { type, page, limit } = query;
        const filter = {};
        if (type) filter.type = type;
        return await RecordSchema.find(filter)
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();
    }

    async recordSchemaCount(type) {
        const filter = {};
        if (type) filter.type = type;
        return await RecordSchema.countDocuments(filter);
    }
    
    async updateRecordById(id, data) {
        const updatedRecord = await RecordSchema.findByIdAndUpdate(id, data, { new: true }).exec();
        return updatedRecord;
    }

    async deleteRecordById(id) {
        return await RecordSchema.findByIdAndDelete(id);
    }
}

export default new RecordSchemaService();