import License from '../models/license.model.js';
import { Types } from 'mongoose';

class LicenseService {
    // Create a new license

    async createLicense(licenseData) {
        try {
            const license = new License(licenseData);
            return await license.save();
        } catch (error) {
            throw new Error(`Error creating license: ${error.message}`);
        }
    }

    // Get license by ID
    async getLicenseById(licenseId) {
        try {
            return await License.findById(licenseId)
                .populate('loId');
                // .populate('boughtBy');
        } catch (error) {
            throw new Error(`Error fetching license: ${error.message}`);
        }
    }

    // Get licenses by user ID
    async getLicensesByUser(userId) {
        try {
            return await License.find({ boughtBy: userId })
                .populate('loId')
                .sort({ createdAt: -1 });
        } catch (error) {
            throw new Error(`Error fetching user licenses: ${error.message}`);
        }
    }

    // Update license
    async updateLicense(licenseId, updateData) {
        try {
            return await License.findByIdAndUpdate(
                licenseId,
                updateData,
                { new: true }
            );
        } catch (error) {
            throw new Error(`Error updating license: ${error.message}`);
        }
    }

    // Deactivate license
    async deactivateLicense(licenseId) {
        try {
            return await License.findByIdAndUpdate(
                licenseId,
                { isActive: false },
                { new: true }
            );
        } catch (error) {
            throw new Error(`Error deactivating license: ${error.message}`);
        }
    }

    // Check if license is valid
    async isLicenseValid(licenseId) {
        try {
            const license = await License.findById(licenseId);
            if (!license) return false;
            
            const now = new Date();
            return license.isActive && 
                   now <= license.expiryDate;
        } catch (error) {
            throw new Error(`Error checking license validity: ${error.message}`);
        }
    }

    // Get active licenses count for a user
    async getActiveLicensesCount(userId) {
        try {
            return await License.countDocuments({
                boughtBy: userId,
                isActive: true,
                expiryDate: { $gte: new Date() }
            });
        } catch (error) {
            throw new Error(`Error counting active licenses: ${error.message}`);
        }
    }
}

export default new LicenseService();