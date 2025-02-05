import Joi from 'joi';

class QuestionBankValidator {
    constructor() {
        this.createQuestionBank = Joi.object({
            name: Joi.string().required(),
            description: Joi.string().optional(),
            category: Joi.string().required(),
        });

        this.updateQuestionBank = Joi.object({
            name: Joi.string().optional(),
            description: Joi.string().optional(),
            category: Joi.string().optional(),
        }).min(1);
    }
}

export default new QuestionBankValidator();