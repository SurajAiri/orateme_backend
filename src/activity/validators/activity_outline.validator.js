const Joi = require('joi');

const createActivityOutline = Joi.object({
    title: Joi.string().required(),
    type: Joi.string().valid('topic', 'question', 'realtime').default('topic').required(),
    description: Joi.string().required(),
    prepareTime: Joi.number().required(), // in seconds
    questionCount: Joi.number().default(1).required(), // number of questions in this activity
    maxDurationTime: Joi.number().required(), // in seconds
    minDurationTime: Joi.number().required(), // in seconds
    // fee: Joi.number().required(), // required credit to buy this activity
});

const updateActivityOutline = Joi.object({
    title: Joi.string(),
    type: Joi.string().valid('topic', 'question', 'realtime').optional(),
    description: Joi.string(),
    prepareTime: Joi.number(), // in seconds
    questionCount: Joi.number().default(1), // number of questions in this activity
    maxDurationTime: Joi.number(), // in seconds
    minDurationTime: Joi.number(), // in seconds
    // fee: Joi.number(), // required credit to buy this activity
}).min(1); // At least one field must be updated

module.exports = {
    createActivityOutline,
    updateActivityOutline,
};