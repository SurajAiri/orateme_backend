const questionModel = require("../model/question.model")


class QuestionService {
    async create(data) {
        return await questionModel.create(data);
    }

    async createMany(dataArray) {
        return await questionModel.insertMany(dataArray);
    }

    async updateById(id, data) {
        return await questionModel.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteById(id) {
        return await questionModel.findByIdAndDelete(id);
    }

    async getById(id) {
        return await questionModel.findById(id);
    }

    async getAll() {
        return await questionModel.find();
    }

    async getCount() {
        return await questionModel.countDocuments();
    }
}

module.exports = new QuestionService();