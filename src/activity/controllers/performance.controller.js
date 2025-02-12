import performanceService from "../services/performance.service.js";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../../config/constants.js';
import performanceValidator from "../validators/performance.validator.js";
import openaiEvaluation from "../../evaluation/services/openai.evaluation.js";
import { parseTranscriptDb } from "../../utils/transcript_parser.js";
import activityService from "../services/activity.service.js";
import transcriptService from "../../transcript/services/transcript.service.js";
import { llmJsonParser } from "../../utils/llm_parser.js";
import licenseController from "../../license/controllers/license.controller.js";

class PerformanceController {
    async create(req, res) {
        try {
            // 1. Validate request body
            const { error, value } = performanceValidator.createPerformance.validate(req.body);
            if(error) return res.sendResponse(400, {message: error.message});

            // 2. Create performance
            const performance = await performanceService.create(value);

            // 3. update activity with performance id
            const activity = await activityService.updateById(value.activityId, { performanceId: performance._id });


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

        const {id:userId,name} = req.user;

        const { transcriptId, activityId } = req.body;
        if (!transcriptId || !activityId) return res.sendResponse(400, { message: 'transcriptId and activityId are required fields' });

        try{
            //2. fetch activity
            const activity = await activityService.getById(activityId);
            if(!activity) return res.sendResponse(404, { message: 'Activity not found' });

            //3. fetch transcript
            const transcript = await transcriptService.getById(transcriptId);
            if(!transcript) return res.sendResponse(404, { message: 'Transcript not found' });

            //4. format activity, question, transcript
            const question = activity.recordId[0].quesId.content;
            const actTitle = activity.actOutId.title;
            const transcriptText = parseTranscriptDb(transcript);


            // 5. Evaluate performance
            const gptEval = await openaiEvaluation.evaluateSpeech(actTitle, question, transcriptText,name);
            if(!gptEval) return res.sendResponse(400, { message: 'Failed to evaluate performance' });

            const evaluation = llmJsonParser(gptEval);

            // 6. Validate evaluation data format
            const { error, value } = performanceValidator.createPerformance.validate(evaluation['report']);
            if(error) return res.sendResponse(400, {message: error.message});

            // 7. Create performance
            const performance = await performanceService.create(value);
            if(!performance) return res.sendResponse(400, { message: 'Failed to create performance' });

            // 8. update activity with performance id
            const act = await activityService.updateById(activity._id, { overallPerformanceId: performance._id });
            // console.log('act', act);
            if(!act) return res.sendResponse(400, { message: 'Failed to update activity' });

            // keep record of activity usage:
            // todo: shift this to where activity is created but after uncompleted activity logic is done
            const au = await licenseController.registerActivityUsage(userId,activityId,1);// as of now every activity is of cost 1

            return res.sendResponse(201, performance);

        }catch(err){
            console.error('PerformanceControllerError: createWithEvaluator', err);
            return res.sendResponse(500, { message: 'Internal Server Error', error: err.message });
        }
    }

    async getAll(req, res) {
        const { page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = req.query;

        try {
            const totalCount = await performanceService.getCount();

            const query = { page, limit };
            
            const performances = await performanceService.getAll(query);
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
            const performance = await performanceService.getById(id);
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
            const { error, value } = performanceValidator.updatePerformance.validate(req.body);
            if (error) return res.sendResponse(400, { message: error.message });

            const performance = await performanceService.updateById(id, value);
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
            const performance = await performanceService.deleteById(id);
            if (!performance) return res.sendResponse(404, { message: 'Performance not found' });
            return res.sendResponse(200, { message: 'Performance deleted' });
        } catch (err) {
            console.error('PerformanceControllerError: deleteById', err);
            return res.sendResponse(500, { message: 'Internal Server Error', error: err.message });
        }
    }
}

export default new PerformanceController();