import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const recordSchema = new Schema({
    mediaUrl: {
        type: String,
    },
    // text: {
    //     type: String,
    //     required: true
    // },
    transcriptId:{
        type: Schema.Types.ObjectId,
        ref: 'Transcript',
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

export default mongoose.model('Record', recordSchema);