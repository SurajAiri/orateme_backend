const PerformanceSchema = require('../model/performance.model');

class PerformanceSchemaService {
    async createPerformanceSchema(data) {
        return await PerformanceSchema.create(data);
    }

    async getPerformanceSchemaById(id) {
        return await PerformanceSchema.findById(id);
    }

    async getAllPerformanceSchemas(query) {
        const { page, limit } = query;
        return await PerformanceSchema
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();
    }

    async performanceSchemaCount() {
        return await PerformanceSchema.countDocuments();
    }
    
    async updatePerformanceSchemaById(id, data) {
        return await PerformanceSchema.findByIdAndUpdate(id, data, { new: true });
    }

    async deletePerformanceSchemaById(id) {
        return await PerformanceSchema.findByIdAndDelete(id);
    }
}

module.exports = new PerformanceSchemaService();