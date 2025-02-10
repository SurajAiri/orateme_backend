import mongoose from "mongoose";

const activityUsageSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    activityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity', required: true },
    costMultiplier: { type: Number, default: 1 },
    timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('ActivityUsage', activityUsageSchema);