const { default: mongoose } = require("mongoose");

const activitySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    actOutId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ActivityOutline',
        required: true
    },
    status: {
        type: String,
        enum: ['created','taken','queue','processing','completed'],
        default: 'created',
    },
    recordId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Record',
    },],
    recordCount: {
        type: Number,
        default: 0,
    },
    overallPerformanceId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Performance',
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('Activity', activitySchema);