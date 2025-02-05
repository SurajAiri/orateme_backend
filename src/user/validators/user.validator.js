import Joi from "joi";

const createUserValidator = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  userType: Joi.string().valid("teacher", "student").required(),
  dateOfBirth: Joi.date().optional(),
  country: Joi.string().optional(),
});

const updateUserValidator = Joi.object({
  username: Joi.string().optional(),
  // email: Joi.string().email().optional(), // can't update email for now
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  userType: Joi.string().valid("teacher", "student").optional(),
  dateOfBirth: Joi.date().optional(),
  country: Joi.string().optional(),
  // isActive: Joi.boolean().optional(), // can't update isActive for now
}).min(1); // Ensure at least one field is being updated

export  {
  createUserValidator,
  updateUserValidator,
};
