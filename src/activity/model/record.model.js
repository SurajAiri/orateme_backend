const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const recordSchema = new Schema({
    mediaUrl: {
        type: String,
    },
    // text: {
    //     type: String,
    //     required: true
    // },
    transcript:{
        type:String,
    },
    status:{
        type:String,
        enum:['created','uploaded','queue','processing','completed'],
        default:'created',
    },
    performanceId: {
        type: Schema.Types.ObjectId,
        ref: 'Performance',
    },
    quesId: {
        type: Schema.Types.ObjectId,
        ref: 'Question',
    },
    question: {
        type: String,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Record', recordSchema);