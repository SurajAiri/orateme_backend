const { default: mongoose } = require("mongoose");

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

module.exports = mongoose.model("ActivityOutline", activityOutlineSchema);
