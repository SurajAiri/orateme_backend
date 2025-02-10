import mongoose from "mongoose";

const LicenseOutlineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    featureTier: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    validity:{type: Number, required: true},// days
    weeklyLimit: { type: Number, required:true},
    localCost: { type: Number, required: true },
    serverCost: { type: Number, required: true },
    featured: { type: Boolean, default: false },
    isRecommended: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('LicenseOutline', LicenseOutlineSchema);