import { updateUserById } from "../../user/controllers/user.controller.js";
import { findUserByUsername, updateUser } from "../../user/services/user.service.js";
import activityUsageService from "../services/activityUsage.service.js";
import LicenseService from "../services/license.service.js";
import licenseOutlineService from "../services/licenseOutline.service.js";

class licenseController {
  async _create(res, userId, loId, transactionId, serverType) {
    if (!userId) return res.sendResponse(401, { message: 'Unauthorized user' });
    if (!loId || !transactionId || !serverType)
      return res.sendResponse(400, {
        message: "loId, transactionId and serviceType are required",
      });

    try {
      // 1. get license outline
      const plan = await licenseOutlineService.getById(loId);
      if (!plan)
        return res.sendResponse(400, { message: "Invalid license outline id" });

      // 2. create license
      const rawLicense = {
        name: plan.name,
        featureTier: plan.featureTier,
        loId,
        boughtBy: userId,
        boughtOn: new Date(),
        transactionId,
        serverType,
        weeklyLimit: plan.weeklyLimit,
        expiryDate: new Date(Date.now() + plan.validity * 24 * 60 * 60 * 1000)
      };
      const license = await LicenseService.createLicense(rawLicense);
      if (!license)
        return res.sendResponse(400, { message: "Failed to create license" });

      // 3. update user 
      const user = await updateUser(userId,{licenseId:license._id});
      if(!user){
        console.error(`Failed to update licenseId: ${license._id} in user: ${userId}`);
      }
      
      return res.sendResponse(201, license, "success");
    } catch (err) {
      console.error("LicenseControllerError: createLicense", err);
      return res.sendResponse(500, {
        message: "Internal Server Error",
        error: err.message,
      });
    }
  }

  userCreate = async(req, res)=> {
    const { loId, transactionId, serverType } = req.body;
    const { id: userId } = req.user;
    return this._create(res, userId, loId, transactionId, serverType);
  }

  adminCreate = async (req, res) =>{
    const { loId, transactionId, serverType, userId } = req.body;

    // check if user exists
    const user = await UserService.findUserById(userId);
    if (!user) return res.sendResponse(404, { message: "User not found" });

    return this._create(res, userId, loId, transactionId, serverType);
  }

  async getLicenseActivityLimits(licenseId, userId){
    try{
        const license = await LicenseService.getById(licenseId);
        if(!license) throw new Error('Invalid license id');

        if(license.isSuspended) return {isValid:false, message:'License is suspended'};
        if(license.expiryDate < new Date()) return {isValid:false, message:'License is expired'};
        if(!license.isActive) return {isValid:false, message:'License is inactive'};

        const {weeklyLimit} = license;
        const weeklyUsage = await activityUsageService.getWeeklyActivityUsageByUserId(userId);
        const totalUsage = weeklyUsage.reduce((acc,curr)=>acc+curr.count,0);

        return {
            weeklyLimit,
            weeklyUsage: totalUsage,
            remaining: weeklyLimit - totalUsage,
            isValid:true
        }
    }catch(err){
        throw err;
    }
  }

  async getLicenseForUser(req, res) {
    const {licenseId} = req.user;
    if(!licenseId) return res.sendResponse(400,{message:'No license found for user'});
    try{
        const license = await LicenseService.getById(licenseId);
        if(!license) throw new Error('Invalid license id');

        return res.sendResponse(200,license,'success');
    }catch(err){
        console.error('LicenseControllerError: getLicenseForUser',err);
        return res.sendResponse(500,{message:'Internal Server Error',error:err.message});
    }
  }

  async getById(req, res) {
    const { id } = req.params;
    try {
      const license = await LicenseService.getById(id);
      if (!license) return res.sendResponse(404, { message: "License not found" });

      return res.sendResponse(200, license, "success");
    } catch (err) {
      console.error("LicenseControllerError: getById", err);
      return res.sendResponse(500, {
        message: "Internal Server Error",
        error: err.message,
      });
    }
  }

  async suspendById(req, res) {
    const { id } = req.params;
    const {isSuspended} = req.body;
    try {
      const license = await LicenseService.updateById(id, {isSuspended});
      if (!license) return res.sendResponse(400, { message: "Failed to suspend license" });

      return res.sendResponse(200, license, "success");
    } catch (err) {
      console.error("LicenseControllerError: suspendById", err);
      return res.sendResponse(500, {
        message: "Internal Server Error",
        error: err.message,
      });
    }
  }

  
  
}

export default new licenseController();
