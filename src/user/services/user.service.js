import User from "../models/user.model.js";

// create user, update, delete, find by id, find all

const createUser = async (user) => {
  return await User.create(user);
};

const updateUser = async (id, user) => {
  return await User.findByIdAndUpdate(id, user, { new: true });
};

const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};

// admin access only
const findUserById = async (id, passwordRequired) => {
  if(passwordRequired)
  return await User.findById(id).select("+password");
  return await User.findById(id);
};

async function findUserByUsername(username, passwordRequired) {
  if (passwordRequired === true)
    return await User.findOne({ username }).select("+password");
  return await User.findOne({ username });
}

async function findUserByEmail(email) {
  return await User.findOne({ email });
}

const findAllUser = async (query) => {
  const { page, limit } = query;
  return await User.find()
    .skip((page - 1) * limit)
    .limit(limit)
    .exec();
};

const userCount = async () => {
  return await User.countDocuments();
};

export  {
  createUser,
  updateUser,
  deleteUser,
  findUserById,
  findAllUser,
  findUserByUsername,
  findUserByEmail,
  userCount,
};
