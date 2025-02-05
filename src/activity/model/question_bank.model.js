// QuestionBank
// - id
// - name (e.g., "Basic Math", "Advanced Physics")
// - description
// - category/subject

import mongoose from 'mongoose';


const questionBankSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
    },
    category: {
        type: String,
        required: true,
    },
}, {timestamps: true});

export default mongoose.model('QuestionBank', questionBankSchema);