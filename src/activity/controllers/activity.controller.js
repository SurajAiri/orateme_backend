const { DEFAULT_PAGE, DEFAULT_LIMIT } = require('../../config/constants');
const ActivityService = require('../services/activity.service');
const ActivityOutlineService = require('../services/activity_outline.service');
const RecordSchema = require('../services/record.service');
const ActivityValidator = require('../validators/activity.validator');

class ActivityController {
    async create(req, res) {
        // TODO: 1.  verify license
        // ToDo: 2. check daily limit

        const {actOutId} = req.body;
        const {id:userId} = req.user;
        
        {
            // 2.b. validate input
            const {error, value} = ActivityValidator.createActivity.validate(req.body);
            if(error)return res.sendResponse(400, {message: error.message});
            
            // 3. fetch activity outline
            const ao = ActivityOutlineService.getActivityOutlineById(actOutId);
            if(!ao)return res.sendResponse(400, {message: 'Invalid activity outline id'});

            // todo: 4. generate topics
            const ques = 'What is the capital of Nigeria?';

            // 5. create record instance with question
            const rec = {
                question:ques,
            }
            const record = RecordSchema.createRecordSchema(rec);
            if(!record)return res.sendResponse(400, {message: 'Failed to create record'});

            // 6. create activity instance
            const act = {
                userId,
                actOutId,
                recordId:record._id,
                recordCount:ao.questionCount,
            }

            // 7. return response 
            const activity = ActivityService.createActivity(act);
            if(!activity)return res.sendResponse(400, {message: 'Failed to create activity'});
            return res.sendResponse(201, activity);
        }
    }

    async uploadRecord(req, res) {
        // 1. verify activity
        // 2. verify record
        // 3. upload media to aws
        // 4. update record with media url
    }

    async confirmUploadUser(req, res){
        // 1. verify record
        // 2. update media url
        // 3. add record to audio transcription queue
        // 4. return response
    }

    async confirmUploadAwsAuto(req,res){
        // 1. verify record
        // 2. update media url
        // 3. add record to audio transcription queue
        // 4. return response
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

module.exports = new ActivityController();