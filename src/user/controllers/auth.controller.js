import bcrypt from "bcrypt";
import * as JwtService from "../../shared/services/jwt.service.js";
import * as UserService from "../services/user.service.js";
import * as UserValidator from "../validators/user.validator.js";
import licenseController from "../../license/controllers/license.controller.js";
import googleAuthProvider from "../auth/google.auth.js";
// const otpGenerator = require("otp-generator");
// const { sendOtpTwilio } = require("../services/twilio.service");

async function googleAuth(req, res) {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ message: "ID token is required" });
  }

  try {
    const googleResponse = await googleAuthProvider(idToken);
    if (!googleResponse) {
      return res.status(401).json({ message: "Invalid ID token" });
    }

    // check if user exists in database
    let existingUser = await UserService.findUserByEmail(
      googleResponse.email,
      true
    );

    if (existingUser) {
      const accessToken = JwtService.generateAccessToken(existingUser);
      return res.sendResponse(200, {
        user: existingUser,
        accessToken,
      });
    }

    // if not create a new user
    let licenseId = null;
    const trialPlanId = process.env.TRIAL_PLAN_ID;
    if (trialPlanId) {
      licenseId = await licenseController._createLicense(
        "orateMe",
        trialPlanId,
        "trial",
        "local",
        false
      );
    }
    const newUser = await UserService.createUser({
      email: googleResponse.email,
      username: googleResponse.username,
      firstName: googleResponse.name.split(" ")[0],
      lastName: googleResponse.name.split(" ")[1] || "",
      provider: googleResponse.provider,
      licenseId,
    });
    if (!newUser) {
      return res.status(500).json({ message: "Failed to create user" });
    }
    const accessToken = JwtService.generateAccessToken(newUser);
    return res.sendResponse(201, {
      user: newUser,
      accessToken,
    });
  } catch (error) {
    console.error("Google authentication error:", error);
    return res.sendResponse(500, error.message, "Authentication failed");
  }
}

// onnext: implement refresh token later on v2
// username login
async function registerWithUsername(req, res) {
  try {
    const { error, value } = UserValidator.createUserValidator.validate(
      req.body
    );
    if (error)
      return res.sendResponse(
        400,
        `AuthError: registerWithUsername - ${error.message}`
      );
    // const refreshToken = generateRefreshToken(newUser);
    // const newUser = await createUserService({ ...value, refreshToken });

    let licenseId = null;
    const trialPlanId = process.env.TRIAL_PLAN_ID;
    if (trialPlanId) {
      licenseId = await licenseController._createLicense(
        "orateMe",
        trialPlanId,
        "trial",
        "local",
        false
      );
    }
    value.licenseId = licenseId;
    const newUser = await UserService.createUser(value);
    if (!newUser) return res.sendResponse(500, "Failed to create user");
    const accessToken = JwtService.generateAccessToken(newUser);

    return res.sendResponse(200, {
      user: newUser,
      accessToken,
      // refreshToken,
    });
  } catch (err) {
    console.error(`AuthError: registerWithUsername - ${err.message}`);
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.sendResponse(400, `${field} is already taken`);
    }
    return res.sendResponse(
      400,
      `AuthError: registerWithUsername - ${err.message}`
    );
  }
}

async function loginWithUsername(req, res) {
  const { username, password } = req.body;
  if (!username || !password)
    return res.sendResponse(400, "Username and password required");
  try {
    const user = await UserService.findUserByUsername(username, true);
    if (!user) return res.sendResponse(404, "User not found");
    if (!user.isActive)
      return res.sendResponse(403, "Account Banned or Suspended");
    // console.log("login user: ", user);
    // console.log("user password: ", user.password);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.sendResponse(401, "Invalid password");
    }

    const accessToken = JwtService.generateAccessToken(user);
    // const refreshToken = generateRefreshToken(user);
    return res.sendResponse(200, {
      user,
      accessToken,
      // refreshToken,
    });
  } catch (err) {
    console.error(err);
    console.error(`AuthError: loginWithUsername - ${err.message}`);
    return res.sendResponse(
      400,
      `AuthError: loginWithUsername - ${err.message}`
    );
  }
}

// async function sendOtp(req, res) {
//   const { phone } = req.body;
//   if (!phone) return res.sendResponse(400, "Phone number is required");
//   const otp = otpGenerator.generate(6, {
//     upperCaseAlphabets: false,
//     specialChars: false,
//     alphabets: false,
//     lowerCaseAlphabets: false,
//   });

//   console.log(otp);
//   // send otp to phone
//   try {
//     await sendOtpTwilio(phone, otp);
//     return res.sendResponse(200, { otp });
//   } catch (err) {
//     return res.sendResponse(500, "Failed to send OTP");
//   }
// }

async function logoutUser() {
  // todo: implement logout user
  
}

export {
  // loginWithGoogleTokenController,
  registerWithUsername,
  loginWithUsername,
  logoutUser,
  googleAuth,
  // sendOtp,
};
