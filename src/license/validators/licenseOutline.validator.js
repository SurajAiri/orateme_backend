import Joi from 'joi';

class LicenseOutlineValidator {
    constructor() {
        this.createLicenseOutline = Joi.object({
            name: Joi.string().required(),
            description: Joi.string().required(),
            featureTier: Joi.string().required(),
            isActive: Joi.boolean().default(true),
            validity: Joi.number().required().positive(),
            weeklyLimit: Joi.number().required().positive(),
            localCost: Joi.number().required().min(0),
            serverCost: Joi.number().required().min(0),
            featured: Joi.boolean().default(false),
            isRecommended: Joi.boolean().default(false)
        });

        this.updateLicenseOutline = Joi.object({
            name: Joi.string(),
            description: Joi.string(),
            featureTier: Joi.string(),
            isActive: Joi.boolean(),
            validity: Joi.number().positive(),
            weeklyLimit: Joi.number().positive(),
            localCost: Joi.number().min(0),
            serverCost: Joi.number().min(0),
            featured: Joi.boolean(),
            isRecommended: Joi.boolean()
        }).min(1);
    }
}

export default new LicenseOutlineValidator();