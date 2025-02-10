import activityUsageService from "../services/activityUsage.service";

class licenseController {
  async _createLicense(data) {
    const { loId, transactionId, serverType, userId } = data;

    try {
      // 1. get license outline
      const plan = await LicenseOutlineService.getById(loId);
      if (!plan) throw new Error("Invalid license outline id");

      // 3. create license
      const rawLicense = {
        name: plan.name,
        featureTier: plan.featureTier,
        loId,
        boughtBy: userId,
        boughtOn: new Date(),
        transactionId,
        serverType,
        weeklyLimit: plan.weeklyLimit,
        expiryDate: moment().add(plan.validity, "day").toDate(),
      };

      return await LicenseService.createLicense(rawLicense);
    } catch (err) {
      throw err;
    }
  }

  async createByUser(req, res) {
    const { loId, transactionId, serverType } = req.body;
    const { id: userId } = req.user;

    if (!loId || !transactionId || !serverType)
      return res.sendResponse(400, {
        message: "loId, transactionId and serviceType are required",
      });

    try {
      const license = await this._createLicense({
        loId,
        transactionId,
        serverType,
        userId,
      });
      if (!license) throw new Error("Failed to create license");
      return res.sendResponse(201, license, "success");
    } catch (err) {
      console.error("LicenseControllerError: createByUser", err);
      return res.sendResponse(
        err.message === "Invalid license outline id" ? 400 : 500,
        {
          message:
            err.message === "Invalid license outline id"
              ? err.message
              : "Internal Server Error",
          error: err.message,
        }
      );
    }
  }

  async createByAdmin(req, res) {
    const { loId, transactionId, serverType, userId } = req.body;

    if (!loId || !transactionId || !serverType || !userId)
      return res.sendResponse(400, {
        message: "loId, transactionId, serviceType and userId are required",
      });

    try {
      const license = await this._createLicense({
        loId,
        transactionId,
        serverType,
        userId,
      });
      if (!license) throw new Error("Failed to create license");
      return res.sendResponse(201, license, "success");
    } catch (err) {
      console.error("LicenseControllerError: createByAdmin", err);
      return res.sendResponse(
        err.message === "Invalid license outline id" ? 400 : 500,
        {
          message:
            err.message === "Invalid license outline id"
              ? err.message
              : "Internal Server Error",
          error: err.message,
        }
      );
    }
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
      const license = await LicenseService.updateLicenseById(id, {isSuspended});
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
