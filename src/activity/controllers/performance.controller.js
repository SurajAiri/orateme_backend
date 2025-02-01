const PerformanceService = require("../services/performance.service");
const { DEFAULT_LIMIT, DEFAULT_PAGE } = require('../../config/constants');
const PerformanceValidator = require("../validators/performance.validator");
const openaiEvaluation = require("../../evaluation/services/openai.evaluation");

class PerformanceController {
    async create(req, res) {
        try {
            const { error, value } = PerformanceValidator.createPerformance.validate(req.body);

            if(error) return res.sendResponse(400, {message: error.message});

            const performance = await PerformanceService.create(value);
            return res.sendResponse(201, performance);
        } catch (err) {
            console.error('PerformanceControllerError: create', err);
            return res.sendResponse(500, { message: 'Internal Server Error', error: err.message });
        }
    }

    async createWithEvaluator(req, res) {
        const { transcriptId } = req.params;
        try{
            const evalu = await openaiEvaluation.evaluateSpeech(transcriptId);

            if(!evalu) return res.sendResponse(400, { message: 'Failed to evaluate performance' });
            const { error, value } = PerformanceValidator.createPerformance.validate(evalu);

            if(error) return res.sendResponse(400, {message: error.message});

            const performance = await PerformanceService.create(value);


        }catch(err){
            console.error('PerformanceControllerError: createWithEvaluator', err);
            return res.sendResponse(500, { message: 'Internal Server Error', error: err.message });
        }
    }

    async getAll(req, res) {
        const { page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = req.query;

        try {
            const totalCount = await PerformanceService.getCount();

            const query = { page, limit };
            
            const performances = await PerformanceService.getAll(query);
            if (!performances || performances.length === 0) return res.sendResponse(404, { message: 'Performances not found' });

            return res.sendResponse(200, performances, "success", { page, limit, totalCount, totalPages: Math.ceil(totalCount / limit) });
        } catch (err) {
            console.error('PerformanceControllerError: getAll', err);
            return res.sendResponse(500, { message: 'Internal Server Error', error: err.message });
        }
    }

    async getById(req, res) {
        const { id } = req.params;
        try {
            const performance = await PerformanceService.getById(id);
            if (!performance) return res.sendResponse(404, { message: 'Performance not found' });
            return res.sendResponse(200, performance);
        } catch (err) {
            console.error('PerformanceControllerError: getById', err);
            return res.sendResponse(500, { message: 'Internal Server Error', error: err.message });
        }
    }

    async updateById(req, res) {
        const { id } = req.params;
        try {
            const { error, value } = PerformanceValidator.updatePerformance.validate(req.body);
            if (error) return res.sendResponse(400, { message: error.message });

            const performance = await PerformanceService.updateById(id, value);
            if (!performance) return res.sendResponse(404, { message: 'Performance not found' });
            return res.sendResponse(200, performance);
        } catch (err) {
            console.error('PerformanceControllerError: updateById', err);
            return res.sendResponse(500, { message: 'Internal Server Error', error: err.message });
        }
    }

    async deleteById(req, res) {
        const { id } = req.params;
        try {
            const performance = await PerformanceService.deleteById(id);
            if (!performance) return res.sendResponse(404, { message: 'Performance not found' });
            return res.sendResponse(200, { message: 'Performance deleted' });
        } catch (err) {
            console.error('PerformanceControllerError: deleteById', err);
            return res.sendResponse(500, { message: 'Internal Server Error', error: err.message });
        }
    }
}

module.exports = new PerformanceController();