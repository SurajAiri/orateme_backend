// Question
// - id
// - questionBankId
// - content
// - difficulty

import mongoose from 'mongoose';

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

export default mongoose.model('Question', questionSchema);