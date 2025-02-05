// UserQuestionAssignment
// - userId
// - questionId
// - activityOutlineId
// - assignedAt

import mongoose from 'mongoose';

const userQuestionAssignmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    activityOutlineId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    assignedAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('UserQuestionAssignment', userQuestionAssignmentSchema);