const { DEFAULT_PAGE, DEFAULT_LIMIT } = require('../../config/constants');
const ActivityService = require('../services/activity.service');
const ActivityOutlineService = require('../services/activity_outline.service');
const RecordSchema = require('../services/record.service');

class AdminActivityController {
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
            const {type,userId, page = DEFAULT_PAGE, limit = DEFAULT_LIMIT} = req.query;
            try {
                // 1. fetch all activities with user id and type
            const query = {};
            if (type) query.type = type;
            if (userId) query.userId = userId;
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

module.exports = new AdminActivityController();