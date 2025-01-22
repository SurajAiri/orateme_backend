const questionBankModel = require("../model/question_bank.model")

class QuestionBankService {
    async create(data) {
        return await questionBankModel.create(data);
    }

    async updateById(id, data) {
        return await questionBankModel.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteById(id) {
        return await questionBankModel.findByIdAndDelete(id);
    }

    async getById(id) {
        return await questionBankModel.findById(id);
    }

    async getAll() {
        return await questionBankModel.find();
    }

    async getCount() {
        return await questionBankModel.countDocuments();
    }
}

module.exports = new QuestionBankService();