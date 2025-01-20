const { date } = require("joi");
const bcrypt = require("bcrypt");
const JwtService = require("../../shared/services/jwt.service");
const UserService = require("../services/user.service");
const UserValidator = require("../validators/user.validator");
// const otpGenerator = require("otp-generator");
// const { sendOtpTwilio } = require("../services/twilio.service");


// todo: implement refresh token later on v2
// username login
async function registerWithUsername(req, res) {
  try {
    const { error, value } = UserValidator.createUserValidator.validate(
      req.body
    );
    if (error) return res.sendResponse(400, `AuthError: registerWithUsername - ${error.message}`);
    // const refreshToken = generateRefreshToken(newUser);
    // const newUser = await createUserService({ ...value, refreshToken });
    const newUser = await UserService.createUser(value);
    if (!newUser) return res.sendResponse(500, "Failed to create user");
    const accessToken = generateAccessToken(newUser);
    return res.sendResponse(200, {
      user: newUser,
      accessToken,
      // refreshToken,
    });
  } catch (err) {
    if (err.code === 11000) return res.sendResponse(400, "User already exists");
    console.error(`AuthError: registerWithUsername - ${err.message}`);
    return res.sendResponse(400, `AuthError: registerWithUsername - ${err.message}`);
  }
}

async function loginWithUsername(req, res) {
  const { username, password } = req.body;
  if (!username || !password)
    return res.sendResponse(400, "Username and password required");
  try {
    const user = await UserService.findUserByUsername(
      username,
      (passwordRequired = true)
    );
    if (!user) return res.sendResponse(404, "User not found");
    if (!user.isActive)
      return res.sendResponse(403, "Account Banned or Suspended");
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
    console.error(`AuthError: loginWithUsername - ${err.message}`);
    return res.sendResponse(400, `AuthError: loginWithUsername - ${err.message}`);
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

module.exports = {
  // loginWithGoogleTokenController,
  registerWithUsername,
  loginWithUsername,
  logoutUser,
  // sendOtp,
};
