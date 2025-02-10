import mongoose from "mongoose";

const licenseModelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    featureTier: { type: String, required: true },
    // related to purchase
    loId:{type: mongoose.Schema.Types.ObjectId, ref: 'LicenseOutline', required: true},
    boughtBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    boughtOn: { type: Date, default: Date.now },
    transactionId:{type: String, required: true,unique:true},
    serverType:{type: String, enum: ['local', 'server'], required: true},
    weeklyLimit:{type: Number, required: true},
    isActive: { type: Boolean, default: true },
    expiryDate: { type: Date, required: true },
    weeklyLimit: { type: Number, required:true},
    isSuspended: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('License', licenseModelSchema);