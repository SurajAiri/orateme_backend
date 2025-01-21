const aoService = require('../services/activity_outline.service');
const aoValidator = require('../validators/activity_outline.validator');
const { DEFAULT_LIMIT,DEFAULT_PAGE } = require('../../config/constants');


class ActivityOutlineController {
    async create(req, res) {
        try{
            const {error, value} = aoValidator.createActivityOutline.validate(req.body);
            if (error) return res.sendResponse(400, {message: error.message});

            const ao = await aoService.createActivityOutline(value);
            return res.sendResponse(201, ao);
        }catch(err){
            console.error('ActivityOutlineControllerError: create', err);
            return res.sendResponse(500, {message: 'Internal Server Error',error: err.message});
        }
    }

    async getAll(req, res) {
        const {type, page = DEFAULT_PAGE, limit =DEFAULT_LIMIT } = req.query;
        try{
            const ao = await aoService.getAllActivityOutlines({type, page, limit });
            if (!ao || ao.length === 0) return res.sendResponse(404, {message: 'Activity Outline not found'});

            const totalCount = await aoService.activityOutlineCount(type);

            return res.sendResponse(200, ao, "success", { page: parseInt(page, 10), limit: parseInt(limit, 10), totalCount, totalPages: Math.ceil(totalCount / limit) });
        }catch(err){
            console.error('ActivityOutlineControllerError: getAll', err);
            return res.sendResponse(500, {message: 'Internal Server Error', error: err.message});
        }
    }

    async getById(req, res) {
        const {id} = req.params;
        try {
            const activityOutline = await aoService.getActivityOutlineById(id);
            if (!activityOutline) return res.sendResponse(404, {message: 'Activity Outline not found'});
            return res.sendResponse(200, activityOutline);
        } catch (err) {
            console.error('ActivityOutlineControllerError: getById', err);
            return res.sendResponse(500, {message: 'Internal Server Error', error: err.message});
        }
    }

    async updateById(req, res) {
        const {id} = req.params;
        try {
            const {error, value} = aoValidator.updateActivityOutline.validate(req.body);
            if (error) return res.sendResponse(400, {message: error.message});
            const ao = await aoService.updateActivityOutlineById(id, value);
            if (!ao) return res.sendResponse(404, {message: 'Activity Outline not found'});
            return res.sendResponse(200, ao);
        }catch(err){
            console.error('ActivityOutlineControllerError: updateById', err);
            return res.sendResponse(500, {message: 'Internal Server Error', error: err.message});
        }
    }

    async deleteById(req, res) {
        const {id} = req.params;
        try {
            const activityOutline = await aoService.deleteActivityOutlineById(id);
            if (!activityOutline) return res.sendResponse(404, {message: 'Activity Outline not found'});
            return res.sendResponse(200, {message: 'Activity Outline deleted'});
        } catch (err) {
            console.error('ActivityOutlineControllerError: deleteById', err);
            return res.sendResponse(500, {message: 'Internal Server Error', error: err.message});
        }
    }

    // async getByType(req, res) {
    //     const { type, page, limit } = req.query;
    //     try {
    //         const ao = await aoService.e(type, { page, limit });
    //         if (!ao || ao.length === 0) return res.sendResponse(404, {message: 'Activity Outline not found'});

    //         const totalCount = await aoService.activityOutlineCount(type);

    //         return res.sendResponse(200, ao, "success", { page, limit, totalCount, totalPages: Math.ceil(totalCount / limit) });
    //     } catch (err) {
    //         console.error('ActivityOutlineControllerError: getByType', err);
    //         return res.sendResponse(500, {message: 'Internal Server Error', error: err.message});
    //     }
    // }
    
}

module.exports = new ActivityOutlineController();