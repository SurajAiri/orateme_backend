import Joi from 'joi';

class ActivityValidator {
    constructor() {
        this.createActivity = Joi.object({
            actOutId: Joi.string()
                .pattern(/^[a-f\d]{24}$/i) // Pattern for MongoDB ObjectId
                .required()
                .messages({
                    'string.pattern.base': 'actOutId must be a valid ObjectId.',
                    'any.required': 'actOutId is required.',
                }),
        });
    }
}

export default new ActivityValidator();