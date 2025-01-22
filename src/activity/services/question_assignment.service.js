const assignmentModel = require("../model/question_assignment.model")


class AssignmentService {
    async create(data) {
        return await assignmentModel.create(data);
    }

    async update(id, data) {
        return await assignmentModel.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        return await assignmentModel.findByIdAndDelete(id);
    }

    async getById(id) {
        return await assignmentModel.findById(id);
    }

    async getAll() {
        return await assignmentModel.find();
    }

    async getCount() {
        return await assignmentModel.countDocuments();
    }
}

module.exports = new AssignmentService();