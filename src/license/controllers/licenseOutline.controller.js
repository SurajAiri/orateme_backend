import license_outlineService from "../services/licenseOutline.service.js";
import license_outlineValidator from "../validators/licenseOutline.validator.js";

class LicenseOutlineController {
    async getActivePackages(req, res){
        try{
            const plans = await license_outlineService.getAllLicenseOutlines({featured:true});

            if(!plans || plans.length === 0)return res.sendResponse(404,{
                message:"No active plans found"
            });

            return res.sendResponse(200,plans,'success');
        }catch(err){
            console.error("LicenseOutlineController: getActivePackages: ",err);
            return res.sendResponse(500, {message: 'Internal Server Error', error: err.message});

        }
    }

    async create(req,res){
        const body = req.body;
        try{
            const {error, value} = license_outlineValidator.createLicenseOutline.validate(body);
            if(error) return res.sendResponse(400,{message:error.message});
            const plan = await license_outlineService.createLicenseOutline(value);
            if(!plan) return res.sendResponse(400,{message:"Failed to create plan"});

            return res.sendResponse(201,plan,'success');
        }catch(err){
            console.error("LicenseOutlineController: create: ",err);
            return res.sendResponse(500, {message: 'Internal Server Error', error: err.message});
        }
    }

    async updateById(req,res){
        const body = req.body;
        const id = req.params.id;
        try{
            const {error, value} = license_outlineValidator.updateLicenseOutline.validate(body);
            if(error) return res.sendResponse(400,{message:error.message});
            const plan = await license_outlineService.updateLicenseOutlineById(id,value);
            if(!plan) return res.sendResponse(400,{message:"Failed to update plan"});

            return res.sendResponse(200,plan,'success');
        }catch(err){
            console.error("LicenseOutlineController: update: ",err);
            return res.sendResponse(500, {message: 'Internal Server Error', error: err.message});
        }
    }

    async deleteById(req,res){
        const id = req.params.id;
        try{
            const plan = await license_outlineService.deleteLicenseOutlineById(id);
            if(!plan) return res.sendResponse(400,{message:"Failed to delete plan"});

            return res.sendResponse(200,{message:"License Outline deleted successfully"},'success');
        }catch(err){
            console.error("LicenseOutlineController: delete: ",err);
            return res.sendResponse(500, {message: 'Internal Server Error', error: err.message});
        }
    }

    async getById(req,res){
        const id = req.params.id;
        try{
            const plan = await license_outlineService.getById(id);
            if(!plan) return res.sendResponse(404,{message:"Plan not found"});

            return res.sendResponse(200,plan,'success');
        }catch(err){
            console.error("LicenseOutlineController: get: ",err);
            return res.sendResponse(500, {message: 'Internal Server Error', error: err.message});
        }
    }

    async getAll(req,res){
        const query = req.query;
        try{
            const plans = await license_outlineService.getAllLicenseOutlines(query);
            if(!plans || plans.length === 0) return res.sendResponse(404,{message:"No plans found"});

            return res.sendResponse(200,plans,'success');
        }catch(err){
            console.error("LicenseOutlineController: getAll: ",err);
            return res.sendResponse(500, {message: 'Internal Server Error', error: err.message});
        }
    }
}

export default new LicenseOutlineController();