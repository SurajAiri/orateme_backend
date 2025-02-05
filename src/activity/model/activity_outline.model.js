import mongoose from 'mongoose';

const activityOutlineSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type:{type:String, enum:['topic','question','realtime'],default: 'topic',required:true},
    description: { type: String, required: true },
    prepareTime: { type: Number, required: true }, // in seconds
    questionCount: { type: Number, default:1, required: true }, // number of questions in this activity
    maxDurationTime: { type: Number, required: true }, // in seconds
    minDurationTime: { type: Number, required: true }, // in seconds
    questionBankId: {type:mongoose.Schema.ObjectId, required: true}
    // fee: { type: Number, required: true }, // required credit to buy this activity
  },
  { timestamps: true }
);

export default mongoose.model("ActivityOutline", activityOutlineSchema);
