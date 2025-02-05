import Joi from 'joi';
class QuestionValidator {
    constructor() {
        this.createQuestion = Joi.object({
            questionBankId: Joi.string().required(),
            content: Joi.string().min(5).max(1024).required(),
            difficulty: Joi.number().integer().min(1).max(5).required(),
        });
        
        this.createManyQuestions = Joi.array().items(this.createQuestion).min(1).required();

        this.updateQuestion = Joi.object({
            questionBankId: Joi.string().optional(),
            content: Joi.string().min(5).max(1024).optional(),
            difficulty: Joi.number().integer().min(1).max(5).optional(),
        }).min(1);
    }
}

export default new QuestionValidator();