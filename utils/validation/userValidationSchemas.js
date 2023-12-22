import Joi from "joi";

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const registerSchema = Joi.object({
  email: Joi.string().pattern(new RegExp(emailRegexp)).required().messages({
    'any.required': `Missing required email field`,
  }),

  password: Joi.string().min(8).max(64).required().messages({
    'any.required': `Missing required password field`,
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(new RegExp(emailRegexp)).required().messages({
    'any.required': `Missing required email field`,
  }),

  password: Joi.string().min(8).max(64).required().messages({
    'any.required': `Missing required password field`,
  }),
});


const userValidationSchemas = {
  registerSchema,
  loginSchema,
};

export default userValidationSchemas