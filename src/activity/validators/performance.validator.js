import Joi from 'joi';

class PerformanceValidator {
    constructor() {
        // For individual performance metrics (score and evaluation)
        this.performanceValidator = Joi.object({
            score: Joi.number().min(0).max(100).required(),
            evaluation: Joi.string().required()
        });

        // For candidate_performance as a Map
        // This validates an object with string keys and performance objects as values
        this.candidatePerformanceValidator = Joi.object().pattern(
            Joi.string(), // Key as a dynamic string (fluency, pronunciation, etc.)
            this.performanceValidator.required()
        ).required().min(1); // Ensure at least one performance metric

        // For overall performance
        this.overallPerformanceValidator = Joi.object({
            score: Joi.number().min(0).max(100).required(),
            evaluation: Joi.string().allow('') // Allow empty string for evaluation
        });

        // For AI feedback as a Map
        // This validates an object with string keys and flexible value types
        this.aiFeedbackValidator = Joi.object().pattern(
            Joi.string(), // Dynamic keys for AI feedback
            Joi.alternatives().try(
                Joi.string(), 
                Joi.number(),
                Joi.boolean(),
                Joi.array().items(Joi.any()), 
                Joi.object()
            )
        ).min(1); // Ensure at least one feedback item

        // For creating a new performance document
        this.createPerformance = Joi.object({
            candidate_performance: this.candidatePerformanceValidator.required(),
            overall_performance: this.overallPerformanceValidator.required(),
            evaluation_summary: this.aiFeedbackValidator.required(),
            enhanced_response: this.aiFeedbackValidator.required()
        });

        // For updating an existing performance document
        this.updatePerformance = Joi.object({
            candidate_performance: this.candidatePerformanceValidator,
            overall_performance: this.overallPerformanceValidator,
            evaluation_summary: this.aiFeedbackValidator,
            enhanced_response: this.aiFeedbackValidator
        }).min(1); // Ensure at least one field is being updated
    }
}

export default new PerformanceValidator();