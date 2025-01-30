const QuestionService = require("../services/question.service");
const QuestionValidator = require("../validators/question.validator");
const { DEFAULT_LIMIT, DEFAULT_PAGE } = require('../../config/constants');

class QuestionController {
    async create(req, res) {
        try {
            const {error, value} = QuestionValidator.createQuestion.validate(req.body);

            if (error) return res.sendResponse(400, {message: error.message});

            const question = await QuestionService.create(value);
            return res.sendResponse(201, question);
        } catch (err) {
            console.error('QuestionControllerError: create', err);
            return res.sendResponse(500, { message: 'Internal Server Error', error: err.message });
        }
    }


    async createMany(req, res) {
        try {
            const { error, value } = QuestionValidator.createManyQuestions.validate(req.body['data']);
    
            if (error) return res.sendResponse(400, { message: error.message });
    
            // Using a transaction to ensure atomicity (if using a database like MongoDB with Mongoose)
            const questions = await QuestionService.createMany(value);
    
            return res.sendResponse(201, { message: 'Questions created successfully', questions });
        } catch (err) {
            console.error('QuestionControllerError: createMany', err);
            return res.sendResponse(500, { message: 'Internal Server Error', error: err.message });
        }
    }

    async createMultiple(req, res) {
        try {
            const { error, value } = QuestionValidator.createMultipleQuestions.validate(req.body);

            if (error) return res.sendResponse(400, { message: error.message });

            const questions = await QuestionService.createMany(value);
            return res.sendResponse(201, questions);
        } catch (err) {
            console.error('QuestionControllerError: createMultiple', err);
            return res.sendResponse(500, { message: 'Internal Server Error', error: err.message });
        }
    }



    async getAll(req, res) {
        const { questionBankId, difficulty, page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = req.query;

        try {
            const query = {};
            if (questionBankId) query.questionBankId = questionBankId;
            if (difficulty) query.difficulty = difficulty;
            const totalCount = await QuestionService.getCount(query);

            query.page = page;
            query.limit = limit;
            const questions = await QuestionService.getAll(query);

            if (!questions || questions.length === 0) return res.sendResponse(404, { message: 'Questions not found' });

            return res.sendResponse(200, questions, "success", { page, limit, totalCount, totalPages: Math.ceil(totalCount / limit) });
            
        } catch (err) {
            console.error('QuestionControllerError: getAll', err);
            return res.sendResponse(500, { message: 'Internal Server Error', error: err.message });
        }
    }

    async getRandomQuestionByQuesBank(req, res) {
        const { quesBankId } = req.params;
        let { count = 1 } = req.query;
        count = parseInt(count);
        try {
            // Validate the quesBankId
            if (!quesBankId) {
                return res.sendResponse(400, { message: "Question Bank ID is required." });
            }
    
            // Fetch a random question from the question bank
                const randomQuestion = await QuestionService.getRandomQuestionByQuesBank(quesBankId,count);
                console.log("randomQues: ",randomQuestion);
                // const randomQuestion = [];
                // console.log(randomQuestion);
            
            // Check if a question was found
            if (!randomQuestion || randomQuestion.length !== count) {
                return res.sendResponse(404, { message: `Specified no. '${count}' of Questions not found` });
            }
    
            // Return the random question
            return res.sendResponse(200, randomQuestion);
        } catch (error) {
            console.error('QuestionControllerError: getRandomQuestionByQuesBank', error);
            return res.sendResponse(500, { message: "Unable to fetch random question. Please try again later." , error: error.message});
        }
    }


    async getById(req, res) {
        const { id } = req.params;
        try {
            const question = await QuestionService.getById(id);
            if (!question) return res.sendResponse(404, { message: 'Question not found' });
            return res.sendResponse(200, question);
        } catch (err) {
            console.error('QuestionControllerError: getById', err);
            return res.sendResponse(500, { message: 'Internal Server Error', error: err.message });
        }
    }

    async updateById(req, res) {
        const { id } = req.params;

        try {
            const { error, value } = QuestionValidator.updateQuestion.validate(req.body);
            if (error) return res.sendResponse(400, { message: error.message });

            const question = await QuestionService.updateById(id, value);
            if (!question) return res.sendResponse(404, { message: 'Question not found' });
            return res.sendResponse(200, question);
        } catch (err) {
            console.error('QuestionControllerError: updateById', err);
            return res.sendResponse(500, { message: 'Internal Server Error', error: err.message });
        }
    }

    async deleteById(req, res) {
        const { id } = req.params;
        try {
            const question = await QuestionService.deleteById(id);
            if (!question) return res.sendResponse(404, { message: 'Question not found' });
            return res.sendResponse(200, { message: 'Question deleted' });
        } catch (err) {
            console.error('QuestionControllerError: deleteById', err);
            return res.sendResponse(500, { message: 'Internal Server Error', error: err.message });
        }
    }
}

module.exports = new QuestionController();