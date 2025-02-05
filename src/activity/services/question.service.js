import mongoose from 'mongoose';
import questionModel from "../model/question.model.js";


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

    async getRandomQuestionByQuesBank(questionBankId, count=1) {
        return await questionModel.aggregate([
            { $match: { questionBankId:new mongoose.Types.ObjectId(questionBankId) } },
            { $sample: { size: count } },
            { $project: { _id: 1, content: 1, difficulty: 1 } }  // Select only needed fields
        ]);
    }

    async getAll() {
        return await questionModel.find();
    }

    async getCount() {
        return await questionModel.countDocuments();
    }
}

export default new QuestionService();