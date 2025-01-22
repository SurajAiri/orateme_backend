const QuestionBankService = require("../services/question_bank.service");
const { DEFAULT_LIMIT, DEFAULT_PAGE } = require('../../config/constants');
const QuestionBankValidator = require("../validators/question_bank.validator");

class QuestionBankController {
    async create(req, res) {
        try {
            const { error, value } = QuestionBankValidator.createQuestionBank.validate(req.body);

            if(error) return res.sendResponse(400, {message: error.message});

            const questionBank = await QuestionBankService.create(value);
            return res.sendResponse(201, questionBank);
        } catch (err) {
            console.error('QuestionControllerError: create', err);
            return res.sendResponse(500, { message: 'Internal Server Error', error: err.message });
        }
    }

    async getAll(req, res) {
        const { page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = req.query;

        try {
            const totalCount = await QuestionBankService.getCount();

            const query = { page, limit };
            
            const questionBanks = await QuestionBankService.getAll(query);
            if (!questionBanks || questionBanks.length === 0) return res.sendResponse(404, { message: 'Question Banks not found' });
            

            return res.sendResponse(200, questionBanks, "success", { page, limit, totalCount, totalPages: Math.ceil(totalCount / limit) });
            
        } catch (err) {
            console.error('QuestionControllerError: getAll', err);
            return res.sendResponse(500, { message: 'Internal Server Error', error: err.message });
        }
    }

    async getById(req, res) {
        const { id } = req.params;
        try {
            const questionBank = await QuestionBankService.getById(id);
            if (!questionBank) return res.sendResponse(404, { message: 'Question Bank not found' });
            return res.sendResponse(200, questionBank);
        } catch (err) {
            console.error('QuestionControllerError: getById', err);
            return res.sendResponse(500, { message: 'Internal Server Error', error: err.message });
        }
    }

    async updateById(req, res) {
        const { id } = req.params;
        try {
            const { error, value } = QuestionBankValidator.updateQuestionBank.validate(req.body);
            if (error) return res.sendResponse(400, { message: error.message });

            const questionBank = await QuestionBankService.updateById(id, value);
            if (!questionBank) return res.sendResponse(404, { message: 'Question Bank not found' });
            return res.sendResponse(200, questionBank);
        } catch (err) {
            console.error('QuestionControllerError: updateById', err);
            return res.sendResponse(500, { message: 'Internal Server Error', error: err.message });
        }
    }

    async deleteById(req, res) {
        const { id } = req.params;
        try {
            const questionBank = await QuestionBankService.deleteById(id);
            if (!questionBank) return res.sendResponse(404, { message: 'Question Bank not found' });
            return res.sendResponse(200, { message: 'Question Bank deleted' });
        } catch (err) {
            console.error('QuestionControllerError: deleteById', err);
            return res.sendResponse(500, { message: 'Internal Server Error', error: err.message });
        }
    }
}

module.exports = new QuestionBankController();
