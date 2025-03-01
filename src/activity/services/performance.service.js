import performanceModel from '../model/performance.model.js';

class PerformanceSchemaService {
    async create(data) {
        console.log(data);
        return await performanceModel.create(data);
    }

    async getById(id) {
        return await performanceModel.findById(id);
    }

    async getAll(query) {
        const { page, limit } = query;
        return await performanceModel
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();
    }

    async performanceSchemaCount() {
        return await performanceModel.countDocuments();
    }
    
    async updateById(id, data) {
        return await performanceModel.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteById(id) {
        return await performanceModel.findByIdAndDelete(id);
    }
}

export default new PerformanceSchemaService();