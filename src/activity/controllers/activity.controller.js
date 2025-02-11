import { DEFAULT_PAGE, DEFAULT_LIMIT } from '../../config/constants.js';
import licenseController from '../../license/controllers/license.controller.js';
import ActivityService from '../services/activity.service.js';
import ActivityOutlineService from '../services/activity_outline.service.js';
import recordService from '../services/record.service.js';
import RecordService from '../services/record.service.js';
import getRandomQuestionByQuesBankUtil from '../utils/question.utils.js';
import ActivityValidator from '../validators/activity.validator.js';
import questionController from './question.controller.js';

class ActivityController {
    async create(req, res) {
        try {
            const { actOutId } = req.body;
            const { id: userId,licenseId } = req.user;

            // todo: return any uncompleted activity with the same actOutId
            // const incompleteAct = await ActivityService.getUncompletedActivity(userId, actOutId);
            // if (incompleteAct) return res.sendResponse(200, incompleteAct);

            // todo: validate license
            if(!licenseId) return res.sendResponse(400,{message:"No package purchased"});
            const licenseLimit = await licenseController.getLicenseActivityLimits(licenseId,userId);
            if(!licenseLimit)return res.sendResponse(400,{message: 'Unable to find license'});

            if(!licenseLimit.isValid)return res.sendResponse(400,{message:licenseLimit.message || "Unknown reason"});

            // Validate input
            const { error, value } = ActivityValidator.createActivity.validate(req.body);
            if (error) return res.sendResponse(400, { message: error.message });

            
            // Fetch activity outline
            const ao = await ActivityOutlineService.getActivityOutlineById(actOutId);
            if (!ao) return res.sendResponse(400, { message: 'Invalid activity outline id' });
            
            // check if activity limit is available
            if((licenseLimit.remaining ?? 0) < (ao.costMultiplier ?? 1))return res.sendResponse(400,{message:"Not enough credit to create activity."});

            // Generate random questions
            const ques = await getRandomQuestionByQuesBankUtil(ao.questionBankId, ao.questionCount);
            if (ques.error) return res.sendResponse(ques.error.status, { message: ques.error.message });
    
            // Create records for the questions in parallel using Promise.all
            const records = await Promise.all(
                ques.map(async (que) => {
                    const rec = await RecordService.createRecordSchema({ quesId: que });
                    return rec ? rec._id : null; // Return `_id` or null
                })
            );
    
            // Ensure `rec_ids` is always a list
            const rec_ids = records.filter((id) => id !== null); // Remove null values
    
            // Prepare the activity object
            const act = {
                userId,
                actOutId,
                recordCount: ao.questionCount,
                recordId: rec_ids, // Always a list
            };
    
            // Create activity
            const activity = await ActivityService.createActivity(act);
            if (!activity) return res.sendResponse(400, { message: 'Failed to create activity' });
    
            // Return success response
            return res.sendResponse(201, activity);
        } catch (err) {
            console.error(`ActivityController: createActivityTransaction ${err.message}`);
            return res.sendResponse(500, { message: 'Internal server error', error: err.message });
        }
    }
    

    async uploadRecord(req, res) {
        // 1. verify activity
        const { id: userId } = req.user;
        // const { recordId,mediaUrl } = req.body;
        // 2. verify record
        // 3. upload media to aws
        // 4. update record with media url
    }

    async getRecordById(req, res) {
        const { id } = req.params;
        try {
            const record = await recordService.getRecordSchemaById(id);
            if (!record) return res.sendResponse(404, { message: 'Record not found' });
            return res.sendResponse(200, record);
        } catch (err) {
            console.error('RecordControllerError: getRecordById', err);
            return res.sendResponse(500, { message: 'Internal Server Error', error: err.message });
        }
    }

    async confirmUploadUser(req, res){
        // 1. verify record
        // 2. update media url
        // 3. add record to audio transcription queue
        // 4. return response

        const {id:userId} = req.user;
        const {recordId} = req.body;

        try{
            const rec = RecordService.updateRecordById(recordId, {status:'uploaded'});
            if(!rec)return res.sendResponse(400, {message: 'Invalid record id'});
        }catch(err){
            console.error('ActivityControllerError: confirmUploadUser', err);
            return res.sendResponse(500, {message: 'Internal Server Error', error: err.message});
        }
    }

    async confirmUploadAwsAuto(req,res){
        // 1. verify record
        // 2. update media url
        // 3. add record to audio transcription queue
        // 4. return response

        const {key} = req.body;
        try{
            const recordId = key.split('/')[1];
            const rec = RecordService.updateRecordById(recordId, {status:'uploaded', mediaUrl:key});
            if(!rec)return res.sendResponse(400, {message: 'Invalid record key'});
        }
        catch(err){
            console.error('ActivityControllerError: confirmUploadAwsAuto', err);
            return res.sendResponse(500, {message: 'Internal Server Error', error: err.message});
        }
    }

    async getById(req,res){
        const {id} = req.params;
        try{
            // 1. fetch activity
            const activity = await ActivityService.getById(id);
            if(!activity)return res.sendResponse(400, {message: 'Invalid activity id'});

            // 3. return response
            return res.sendResponse(200, activity);
        }catch(err){
            console.error('ActivityControllerError: getActivityResults', err);
            return res.sendResponse(500, {message: 'Internal Server Error', error: err.message});
        }
    }

    async getAll(req, res) {
        const {id:userId} = req.user;
        const {type, page = DEFAULT_PAGE, limit = DEFAULT_LIMIT} = req.query;
        try {
            // 1. fetch all activities with user id and type
            const query = {userId};
            if (type) query.type = type;
            query.page = page;
            query.limit = limit;

            const activities = await ActivityService.getAll(query);
            if (!activities || activities.length === 0) return res.sendResponse(404, {message: 'Activity not found'});

            const totalCount = await ActivityService.activityCount(type, userId);
            // 2. return response
            return res.sendResponse(200, activities, 'success', {
                page: parseInt(page),
                limit: parseInt(limit),
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
            });
        } catch (err) {
            console.error('ActivityControllerError: getAllActivities', err);
            return res.sendResponse(500, {message: 'Internal Server Error', error: err.message});
        }
    }
}

export default new ActivityController();