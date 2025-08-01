import { updateUserById } from "../../user/controllers/user.controller.js";
import {
  findUserById,
  findUserByUsername,
  updateUser,
} from "../../user/services/user.service.js";
import { calculateWorkingTimePeriod } from "../../utils/utility.js";
import activityUsageService from "../services/activityUsage.service.js";
import LicenseService from "../services/license.service.js";
import licenseOutlineService from "../services/licenseOutline.service.js";

class licenseController {
  async _create(res, userId, loId, transactionId, serverType) {
    try {
      const success = await this._createLicense(userId, loId, transactionId, serverType);
      return res.sendResponse(200, { success }, "License created successfully");
    } catch (err) {
      console.error("LicenseControllerError: _create", err);
      return res.sendResponse(500, {
        message: "Failed to create license",
        error: err.message,
      });
    }
  }

  async _createLicense(userId, loId, transactionId, serverType, doUpdateUser = true) {
    if (!userId) throw new Error("Unauthorized user");
    if (!loId || !transactionId || !serverType)
      throw new Error("loId, transactionId and serviceType are required");

    // 1. get license outline
    const plan = await licenseOutlineService.getById(loId);
    if (!plan) throw new Error("Invalid license outline id");

    // 2. create license
    const rawLicense = {
      name: plan.name,
      featureTier: plan.featureTier,
      loId,
      boughtBy: transactionId === "trial" ? undefined : userId,
      boughtOn: new Date(),
      transactionId: transactionId === "trial" ? undefined : transactionId,
      serverType,
      weeklyLimit: plan.weeklyLimit,
      expiryDate: new Date(Date.now() + plan.validity * 24 * 60 * 60 * 1000),
    };
    const license = await LicenseService.createLicense(rawLicense);
    if (!license) throw new Error("Failed to create license");

    if(!doUpdateUser) return license._id;

    // 3. update user
    const user = await updateUser(userId, { licenseId: license._id });
    if (!user) {
      console.error(
        `Failed to update licenseId: ${license._id} in user: ${userId}`
      );
      throw new Error("Failed to update user with license");
    }

    return license._id;
  }

  userCreate = async (req, res) => {
    const { loId, transactionId, serverType } = req.body;
    const { id: userId } = req.user;
    return this._create(res, userId, loId, transactionId, serverType);
  };

  adminCreate = async (req, res) => {
    const { loId, transactionId, serverType, userId } = req.body;

    // check if user exists
    const user = await findUserById(userId);
    if (!user) return res.sendResponse(404, { message: "User not found" });

    return this._create(res, userId, loId, transactionId, serverType);
  };

  async getLicenseActivityLimits(licenseId, userId) {
    try {
      const license = await LicenseService.getById(licenseId);
      if (!license) throw new Error("Invalid license id");

      if (license.isSuspended)
        return { isValid: false, message: "License is suspended" };
      if (license.expiryDate < new Date())
        return { isValid: false, message: "License is expired" };
      if (!license.isActive)
        return { isValid: false, message: "License is inactive" };

      const { weeklyLimit } = license;
      const periodHours = calculateWorkingTimePeriod(license.boughtOn);
      const weeklyUsage =
        await activityUsageService.getWeeklyActivityUsageByUserId(userId,Math.ceil(periodHours));

      const totalUsage = weeklyUsage.reduce((acc, curr) => acc + curr.count, 0);

      return {
        weeklyLimit,
        weeklyUsage: totalUsage,
        remaining: weeklyLimit - totalUsage,
        isValid: true,
        expiryDate:license.expiryDate,
      };
    } catch (err) {
      throw err;
    }
  }

  userLicenseActivityLimitInfo = async (req, res) => {
    const { id: userId, licenseId } = req.user;
    if (!licenseId)
      return res.sendResponse(400, { message: "No license found for user" });
    try {
      const info = await this.getLicenseActivityLimits(licenseId, userId);
      if (info === null)
        return res.sendResponse(400, {
          isValid: false,
          message: "Failed to get license activity limits",
        });
      return res.sendResponse(200, info, "success");
    } catch (err) {
      console.error(
        "LicenseControllerError: userLicenseActivityLimitInfo",
        err
      );
      return res.sendResponse(500, {
        isValid: false,
        message: "Internal Server Error",
        error: err.message,
      });
    }
  };

  async adminLicenseActivityLimitInfo(req, res) {
    const { userId, licenseId } = req.body;
    if (!userId || !licenseId)
      return res.sendResponse(400, {
        isValid: false,
        message: "userId and licenseId are required",
      });
    try {
      const info = await this.getLicenseActivityLimits(licenseId, userId);
      if (info === null)
        return res.sendResponse(400, {
          isValid: false,
          message: "Failed to get license activity limits",
        });
      return res.sendResponse(200, info, "success");
    } catch (err) {
      console.error(
        "LicenseControllerError: adminLicenseActivityLimitInfo",
        err
      );
      return res.sendResponse(500, {
        isValid: false,
        message: "Internal Server Error",
        error: err.message,
      });
    }
  }

  // onnext: optimize calling this function (some internal logic so that user not have to call this everytime) [frontend-side + backend(better logic if required)]
  async getLicenseForUser(req, res) {
    const { licenseId } = req.user;
    if (!licenseId)
      return res.sendResponse(400, { message: "No license found for user" });
    try {
      const license = await LicenseService.getById(licenseId);
      if (!license) throw new Error("Invalid license id");

      return res.sendResponse(200, license, "success");
    } catch (err) {
      console.error("LicenseControllerError: getLicenseForUser", err);
      return res.sendResponse(500, {
        message: "Internal Server Error",
        error: err.message,
      });
    }
  }

  async getById(req, res) {
    const { id } = req.params;
    try {
      const license = await LicenseService.getById(id);
      if (!license)
        return res.sendResponse(404, { message: "License not found" });

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
    const { isSuspended } = req.body;
    try {
      const license = await LicenseService.updateById(id, { isSuspended });
      if (!license)
        return res.sendResponse(400, { message: "Failed to suspend license" });

      return res.sendResponse(200, license, "success");
    } catch (err) {
      console.error("LicenseControllerError: suspendById", err);
      return res.sendResponse(500, {
        message: "Internal Server Error",
        error: err.message,
      });
    }
  }

  // activity use
  async registerActivityUsage(userId, activityId, costMultiplier) {
    try {
      const rawAU = {
        userId,
        activityId,
        costMultiplier,
      };
      return await activityUsageService.createActivityUsage(rawAU);
    } catch (err) {
      console.error("LicenseController: registerActivityUsage: ", err);
    }
    return null;
  }
}

export default new licenseController();
