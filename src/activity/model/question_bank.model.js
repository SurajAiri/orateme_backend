// QuestionBank
// - id
// - name (e.g., "Basic Math", "Advanced Physics")
// - description
// - category/subject

const { default: mongoose } = require("mongoose");


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

module.exports = mongoose.model('QuestionBank', questionBankSchema);