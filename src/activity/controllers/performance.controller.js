const PerformanceService = require("../services/performance.service");
const { DEFAULT_LIMIT, DEFAULT_PAGE } = require('../../config/constants');
const PerformanceValidator = require("../validators/performance.validator");
const openaiEvaluation = require("../../evaluation/services/openai.evaluation");

class PerformanceController {
    async create(req, res) {
        try {
            // 1. Validate request body
            const { error, value } = PerformanceValidator.createPerformance.validate(req.body);
            if(error) return res.sendResponse(400, {message: error.message});

            // 2. Create performance
            const performance = await PerformanceService.create(value);

            // 3. update activity with performance id
            // const activity = await ActivityService.updateById(value.activityId, { performanceId: performance._id });


            return res.sendResponse(201, performance);
        } catch (err) {
            console.error('PerformanceControllerError: create', err);
            return res.sendResponse(500, { message: 'Internal Server Error', error: err.message });
        }
    }

    // onnext: this is only valid till assumption all activities will have single question only
    async createWithEvaluator(req, res) {
        // 1. Validate request body
        // const { transcriptId } = req.params;
        // if(!transcriptId) return res.sendResponse(400, { message: 'TranscriptId is required' });

        const { transcriptId, activityId } = req.body;
        if (!transcriptId || !activityId) return res.sendResponse(400, { message: 'transcriptId and activityId are required fields' });

        try{
            //2. fetch activity
            const activity = await ActivityService.getById(activityId);
            if(!activity) return res.sendResponse(404, { message: 'Activity not found' });

            //3. fetch transcript
            const transcript = await TranscriptService.getById(transcriptId);
            if(!transcript) return res.sendResponse(404, { message: 'Transcript not found' });

            //4. format activity, question, transcript
            const question = activity.recordId[0].quesId.content;
            const actTitle = activity.actOutId.title;
            // const transcriptText = transcript.text; // fixme: parse transcript text in proper format


            // 5. Evaluate performance
            const evalu = await openaiEvaluation.evaluateSpeech(transcriptId);
            if(!evalu) return res.sendResponse(400, { message: 'Failed to evaluate performance' });

            // 6. Validate evaluation data format
            const { error, value } = PerformanceValidator.createPerformance.validate(evalu);
            if(error) return res.sendResponse(400, {message: error.message});

            // 7. Create performance
            const performance = await PerformanceService.create(value);

            // 8. update activity with performance id
            // const activity = await ActivityService.updateById(value.activityId, { performanceId: performance._id });

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