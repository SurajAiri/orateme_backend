import assignmentModel from "../model/question_assignment.model.js";


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

export default new AssignmentService();