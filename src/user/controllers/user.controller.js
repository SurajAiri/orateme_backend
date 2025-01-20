const UserService = require("../services/user.service");
const UserValidator = require("../validators/user.validator");

// common operations [private access]
async function _updateUser(userId, body, res) {
  try {
    const { error, value } = UserValidator.updateUserValidator.validate(body);
    if (error) {
      return res.sendResponse(400, { message: error.message });
    }
    const user = await UserService.updateUser(userId, value);
    if (!user) return res.sendResponse(404, { message: "User not found" });

    return res.sendResponse(200, user);
  } catch (error) {
    console.error("UserControllerError: updateUser", error);
    return res.sendResponse(500, { message: "Internal Server Error" });
  }
}

async function _getUserInfo(userId, res) {
  try {
    const user = await UserService.findUserById(userId);
    if (!user) return res.sendResponse(404, { message: "User not found" });

    return res.sendResponse(200, user);
  } catch (error) {
    console.error("UserControllerError: getUserInfo", error);
    return res.sendResponse(500, { message: "Internal Server Error" });
  }
}

async function _deleteUser(userId, res) {
  try {
    const user = await UserService.deleteUser(userId);
    if (!user) return res.sendResponse(404, { message: "User not found" });

    return res.sendResponse(201, { message: "User deleted successfully" });
  } catch (error) {
    console.error("UserControllerError: deleteUser", error);
    return res.sendResponse(400, { message: error.message });
  }
}

// user only
const updateUserSelf = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.sendResponse(401, { message: "Unauthorized user" });
  if (!req.body)
    return res.sendResponse(400, { message: "At least one field is required" });
  return _updateUser(userId, req.body, res);
};

const getUserSelf = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.sendResponse(401, { message: "Unauthorized user" });
  return _getUserInfo(userId, res);
};

const deleteUserSelf = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.sendResponse(401, { message: "Unauthorized user" });
  return _deleteUser(userId, res);
};

// admin only
const getUserById = async (req, res) => {
  const userId = req.params.userId;
  if (!userId) return res.sendResponse(400, { message: "User ID is required" });
  return _getUserInfo(userId, res);
};

const updateUserById = async (req, res) => {
  const userId = req.params.userId;
  const body = req.body;
  if (!userId) return res.sendResponse(400, { message: "User ID is required" });
  return _updateUser(userId, body, res);
};

const deleteUserById = async (req, res) => {
  const userId = req.params.userId;
  if (!userId) return res.sendResponse(400, { message: "User ID is required" });
  return _deleteUser(userId, res);
};

const createUser = async (req, res) => {
  const body = req.body;
  try {
    const { error, value } = createUserValidator.validate(body);
    if (error) {
      return res.sendResponse(400, { message: error.message });
    }
    const user = await UserService.createUser(value);
    return res.sendResponse(201, user);
  } catch (error) {
    console.error("UserControllerError: createUser", error);
    // Check for duplicate key error
    if (error.code === 11000 && error.keyPattern && error.keyPattern) {
      const duplicateKey = Object.keys(error.keyPattern)[0]; // Get the field that caused the duplicate key error
      const message = `${
        duplicateKey.charAt(0).toUpperCase() + duplicateKey.slice(1)
      } already in use`;
      return res.sendResponse(409, { message });
    }
    return res.sendResponse(400, { message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const users = await UserService.findAllUser({ page, limit });

    if (!users || users.length == 0)
      return res.sendResponse(404, { message: "No users found" });

    const totalUsers = await userCount();
    return res.sendResponse(200, users, "success", {
      page,
      limit,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
    });
  } catch (error) {
    console.error("UserControllerError: getAllUsers", error);
    return res.sendResponse(500, { message: "Internal Server Error" });
  }
};

module.exports = {
  // user only
  updateUserSelf,
  getUserSelf,
  deleteUserSelf,
  // admin only
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
  getAllUsers,
};
