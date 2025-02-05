import Joi from 'joi';

class PerformanceValidator {
    constructor() {
        this.performanceValidator = Joi.object({
            score: Joi.number().min(0).max(10).required(),
            evaluation: Joi.string().required()
        });

        this.candidatePerformanceValidator = Joi.object({
            fluency: this.performanceValidator.required(),
            pronunciation: this.performanceValidator.required(),
            vocabulary: this.performanceValidator.required(),
            grammar: this.performanceValidator.required(),
            coherence: this.performanceValidator.required()
        });

        this.overallPerformanceValidator = Joi.object({
            score: Joi.number().min(0).max(10).required(),
            evaluation: Joi.string().required()
        });

        this.createPerformance = Joi.object({
            candidate_performance: this.candidatePerformanceValidator.required(),
            overall_performance: this.overallPerformanceValidator.required(),
            strengths: Joi.string().required(),
            weaknesses: Joi.string().required(),
            suggestions: Joi.string().required()
        });

        this.updatePerformance = Joi.object({
            candidate_performance: this.candidatePerformanceValidator,
            overall_performance: this.overallPerformanceValidator,
            strengths: Joi.string(),
            weaknesses: Joi.string(),
            suggestions: Joi.string()
        }).min(1);
    }
}

export default new PerformanceValidator();