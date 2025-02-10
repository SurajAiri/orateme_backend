import LicenseOutlineModel from '../models/licenseOutline.model.js';

class LicenseOutlineService {
    async createLicenseOutline(data) {
        return await LicenseOutlineModel.create(data);
    }

    async getById(id) {
        return await LicenseOutlineModel.findById(id);
    }

    async getAllLicenseOutlines(query) {
        const {  isActive, featured, isRecommended, page = 1, limit = 10 } = query;
        const filter = {};
        
        // if (featureTier) filter.featureTier = featureTier;
        if (isActive !== undefined) filter.isActive = isActive;
        if (featured !== undefined) filter.featured = featured;
        if (isRecommended !== undefined) filter.isRecommended = isRecommended;

        return await LicenseOutlineModel.find(filter)
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();
    }

    async licenseOutlineCount(query) {
        const { featureTier, isActive, featured, isRecommended } = query;
        const filter = {};
        
        if (featureTier) filter.featureTier = featureTier;
        if (isActive !== undefined) filter.isActive = isActive;
        if (featured !== undefined) filter.featured = featured;
        if (isRecommended !== undefined) filter.isRecommended = isRecommended;

        return await LicenseOutlineModel.countDocuments(filter);
    }

    async updateLicenseOutlineById(id, data) {
        return await LicenseOutlineModel.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteLicenseOutlineById(id) {
        return await LicenseOutlineModel.findByIdAndDelete(id);
    }
}

export default new LicenseOutlineService();