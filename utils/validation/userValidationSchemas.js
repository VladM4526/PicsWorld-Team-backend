import Joi from 'joi';

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const genderList = ["male", "female"];

const registerSchema = Joi.object({
	email: Joi.string().required().pattern(new RegExp(emailRegexp)).messages({
		'any.required': `Missing required email field`,
		'string.pattern.base': `Invalid email format`,
	}),

	password: Joi.string().required().min(8).max(64).messages({
		'any.required': `Missing required password field`,
		'string.min': `Password must be at least 8 characters long`,
    	'string.max': `Password must be at most 64 characters long`,
	}),
});

const loginSchema = Joi.object({
	email: Joi.string().required().pattern(new RegExp(emailRegexp)).messages({
		'any.required': `Missing required email field`,
		'string.pattern.base': `Invalid email format`,
	}),

	password: Joi.string().required().min(8).max(64).messages({
		'any.required': `Missing required password field`,
		'string.min': `Password must be at least 8 characters long`,
    	'string.max': `Password must be at most 64 characters long`,
	}),
});

const updateSchema = Joi.object({
	email: Joi.string().pattern(new RegExp(emailRegexp)).messages({
		'any.required': `Missing required email field`,
		'string.pattern.base': `Invalid email format`,
	}),

	oldPassword: Joi.string().min(8).max(64).messages({
		'any.required': `Missing required password field`,
		'string.min': `Password must be at least 8 characters long`,
        'string.max': `Password must be at most 64 characters long`,
	}),

	newPassword: Joi.string().min(8).max(64).messages({
		'any.required': `Missing required password field`,
		'string.min': `Password must be at least 8 characters long`,
        'string.max': `Password must be at most 64 characters long`,
	}),
	
	name: Joi.string().max(32).messages({
		'string.max': `The name must be shorter than 32 characters`,
	}),
	
	gender: Joi.string().valid('male', 'female').messages({
		'any.only': 'Invalid gender value',
	  }),

});

const userValidationSchemas = {
	registerSchema,
	loginSchema,
	updateSchema
};

export default userValidationSchemas;
