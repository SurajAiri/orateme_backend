// Question
// - id
// - questionBankId
// - content
// - difficulty

const { default: mongoose } = require("mongoose");

const questionSchema = new mongoose.Schema({
    questionBankId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    difficulty: {
        type: Number,
        required: true, // int 1-5
    },
}, {timestamps: true});

module.exports = mongoose.model('Question', questionSchema);