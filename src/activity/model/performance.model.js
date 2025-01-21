const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PerformanceSchema = new Schema({
    strengths: {
        type: String,
        required: true
    },
    weakness: {
        type: String,
        required: true
    },
    fluency: {
        type: Number,
        required: true
    },
    pronunciation: {
        type: Number,
        required: true
    },
    vocab: {
        type: Number,
        required: true
    },
    creativity: {
        type: Number,
        required: true
    },
    content: {
        type: Number,
        required: true
    },
    coherence: {
        type: Number,
        required: true
    },
    overall:{
        type:Number,
        required:true,
    },
    suggestion: {
        type: String,
        required: true
    }
});

module.exports = {
    Performance: mongoose.model('Performance', PerformanceSchema),
    OverallPerformance: mongoose.model('OverallPerformance', PerformanceSchema)
};