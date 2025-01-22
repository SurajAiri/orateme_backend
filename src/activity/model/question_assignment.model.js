// UserQuestionAssignment
// - userId
// - questionId
// - activityOutlineId
// - assignedAt

const {default:mongoose} = require('mongoose');

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

module.exports = mongoose.model('UserQuestionAssignment', userQuestionAssignmentSchema);