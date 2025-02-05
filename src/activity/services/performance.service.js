import performanceCount from '../model/performance.model.js';

class PerformanceSchemaService {
    async create(data) {
        return await performanceCount.create(data);
    }

    async getById(id) {
        return await performanceCount.findById(id);
    }

    async getAll(query) {
        const { page, limit } = query;
        return await performanceCount
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();
    }

    async performanceSchemaCount() {
        return await performanceCount.countDocuments();
    }
    
    async updateById(id, data) {
        return await performanceCount.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteById(id) {
        return await performanceCount.findByIdAndDelete(id);
    }
}

export default new PerformanceSchemaService();