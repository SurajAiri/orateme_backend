import Joi from 'joi';

class PerformanceValidator {
    constructor() {
        // For individual performance metrics (score and evaluation)
        this.performanceValidator = Joi.object({
            score: Joi.number().min(0).max(100).required(),
            evaluation: Joi.string().required()
        });

        // For candidate_performance as a Map
        this.candidatePerformanceValidator = Joi.object().pattern(
            Joi.string(),
            this.performanceValidator.required()
        ).required().min(1);

        // For overall performance
        this.overallPerformanceValidator = Joi.object({
            score: Joi.number().min(0).max(100).required(),
            evaluation: Joi.string().allow('') // Allow empty string for evaluation
        });

        // For AI feedback as a Map
        this.aiFeedbackValidator = Joi.object().pattern(
            Joi.string(),
            Joi.alternatives().try(
                Joi.number(),
                Joi.boolean(),
                Joi.array().items(Joi.any()), 
                Joi.object(),
                Joi.string().allow('').default('NA'), // Allow empty string and set default to "NA"
            )
        ).min(1);

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
        }).min(1);
    }
}

export default new PerformanceValidator();
